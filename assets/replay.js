
var cookieEnabled = (navigator.cookieEnabled) ? true : false

if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
  document.cookie = 'testcookie'
  cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false
}

if (!cookieEnabled) {
  throw ('Cookies not enabled, exiting better replay')
}

(function (w, d, n, u, o, t, m) {
  w['SrecObject'] = o; w[o] = w[o] || function () {
    (w[o].q = w[o].q || []).push(arguments)
  }, w[o].l = 1 * new Date(); t = d.createElement(n),
    m = d.getElementsByTagName(n)[0]; t.async = 1; t.src = u; m.parentNode.insertBefore(t, m)
})(window, document, 'script', 'https://replayapp.io/collect/initialize.js', 'srec');
srec('init', 'e2f93130-5337-11ea-8afd-b5fe39c17130');

function isOnRecentThankYouPage() {
  /* COPIED FROM CART SYNC JS */
  /* it starts as /checkouts/.../thank_you when the order is placed */
  /* any subsequent calls will auto redirect to /orders/ */
  var orders_check = window.location.href.indexOf('/orders/') > 0
  // if(orders_check) return false;

  var checkouts_check = window.location.href.indexOf('/checkouts/') > 0
  var thank_you_check = window.location.href.indexOf('/thank_you') > 0
  if (!checkouts_check && !thank_you_check && !orders_check) return false;

  /* this should be available on the thank you page */
  if (!window.Shopify.checkout || !window.Shopify.checkout.updated_at) return false;

  /* if everything checks out, check the updated_at and if its 
  less than 1 min old, we have a match */
  var currTime = Number(new Date)
  var checkoutTime = Number(Date.parse(window.Shopify.checkout.updated_at))
  if (((currTime - checkoutTime) / 60000.0) < 1.0) return true;

  return false
}

if (isOnRecentThankYouPage()) srec('tag', 'order_placed');

function __brGetCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

window.__brCartToken = ""
function __brTokenSet() {
  var currCartToken = __brGetCookie('cart')

  if (currCartToken.length == 0) return;
  if (currCartToken == window.__brCartToken) return;

  window.__brCartToken = currCartToken;
  console.log("assets/replay.js brTokenSet")
  srec('tag', 'add_to_cart')
}

__brTokenSet()
window.setInterval(__brTokenSet, 1000)
