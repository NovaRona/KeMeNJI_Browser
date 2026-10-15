const HOME = "https://www.google.com/";
const tabs = [];
let active = null;
let counter = 0;
const views = document.getElementById("views");
const tabsBar = document.getElementById("tabs");
const address = document.getElementById("address");
function current() { return tabs.find(t => t.id === active); }
function navigateInput(text) {
  text = text.trim();
  if (!text) return HOME;
  if (/^https?:\/\//i.test(text)) return text;
  if (/^[\w-]+(\.[\w-]+)+(:\d+)?(\/.*)?$/.test(text)) return "https://" + text;
  return "https://www.google.com/search?q=" + encodeURIComponent(text);
}

function renderTabs() {
  tabsBar.replaceChildren();

  tabs.forEach(t => {
    const tab = document.createElement("div");
    tab.className = "tab" + (t.id === active ? " active" : "");

    const title = document.createElement("button");
    title.className = "tab-title";
    title.textContent = t.title || "New tab";
    title.type = "button";
    title.onclick = () => activate(t.id);

    const close = document.createElement("button");
    close.className = "tab-close";
    close.textContent = "×";
    close.type = "button";
    close.title = "Close tab";
    close.onclick = event => {
      event.stopPropagation();
      closeTab(t.id);
    };

    tab.append(title, close);
    tabsBar.appendChild(tab);
  });
}

function closeTab(id) {
  const index = tabs.findIndex(t => t.id === id);
  if (index === -1) return;

  const [tab] = tabs.splice(index, 1);
  tab.view.remove();

  if (active === id) {
    if (tabs.length === 0) {
      addTab();
      return;
    }

    const next = tabs[Math.min(index, tabs.length - 1)];
    activate(next.id);
  } else {
    renderTabs();
  }
}
function activate(id) {
  active = id;
  tabs.forEach(t => t.view.classList.toggle("hidden", t.id !== id));
  const t = current();
  if (t) address.value = t.url;
  renderTabs();
}
function addTab(url = HOME) {
  const id = ++counter;
  const view = document.createElement("webview");
  view.setAttribute("src", url);
  view.setAttribute("partition", "persist:kemenji");
  views.appendChild(view);
  const t = { id, view, url, title: "New tab" };
  tabs.push(t);
  view.addEventListener("page-title-updated", e => { t.title = e.title; renderTabs(); });
  view.addEventListener("did-navigate", e => { t.url = e.url; if (active === id) address.value = e.url; });
  view.addEventListener("new-window", e => { if (e.url) addTab(e.url); });
  activate(id);
}
document.getElementById("addressform").onsubmit = e => {
  e.preventDefault();
  const t = current();
  if (!t) return;
  t.url = navigateInput(address.value);
  t.view.loadURL(t.url);
  address.blur();
};
document.getElementById("back").onclick = () => { const t = current(); if (t && t.view.canGoBack()) t.view.goBack(); };
document.getElementById("forward").onclick = () => { const t = current(); if (t && t.view.canGoForward()) t.view.goForward(); };
document.getElementById("reload").onclick = () => { const t = current(); if (t) t.view.reload(); };
document.getElementById("home").onclick = () => {
  const t = current();
  if (t) { t.url = HOME; t.view.loadURL(HOME); address.value = HOME; }
};
document.getElementById("newtab").onclick = () => addTab();
addTab();
