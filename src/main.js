const { invoke } = window.__TAURI__.core;
const { Window } = window.__TAURI__.window;
const { Webview } = window.__TAURI__.webview;

let urlInputEl;
let urlMsgEl;

async function greet() {
  let openUrl = 'https://'.concat(urlInputEl.value)
  urlMsgEl.textContent = "Let's Open ".concat(openUrl)

  const appWindow = new Window('uniqueLabel');

  const webview = new Webview(appWindow, 'theUniqueLabel', {
    url: openUrl,
    parent: "main",
    x: 50, 
    y: 50,
    width: 200,
    height: 200
  });

  webview.once('tauri://created', function () {
    console.log("Successful loading")
  });
  webview.once('tauri://error', function (e) {
    console.log("failed to launch ", e.payload)
   });
}

window.addEventListener("DOMContentLoaded", () => {
  urlInputEl = document.querySelector("#url-input");
  urlMsgEl = document.querySelector("#url-msg");
  document.querySelector("#url-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});
