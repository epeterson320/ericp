import getAppHtml from './getAppHtml';

const rootEl = document.createElement('div');
rootEl.innerHTML = getAppHtml();
document.body.appendChild(rootEl);
