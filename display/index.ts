import getAppHtml from './getAppHtml';

const rootEl = document.getElementById("root");

if (rootEl) {
  rootEl.innerHTML = getAppHtml();
}
