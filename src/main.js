const { invoke } = window.__TAURI__.core;
const { Window, CloseRequestEvent } = window.__TAURI__.window;
const { Webview } = window.__TAURI__.webview;

let urlInputEl;
let urlMsgEl;
const wvMap = new Map();

async function greet() {
  const urlHead = 'https://'
  const winLabel = 'urlWin'
  const wvLabel = 'urlWv'

  let openUrl;
  const url = urlInputEl.value
  const urlKey = url.replace(".", "_")
  if (url.length > 0) {
    if (url.slice(0, 7) === urlHead) {
      openUrl = urlInputEl;
    } else {
      openUrl = urlHead.concat(url);
    }
    urlMsgEl.textContent = "Let's Open ".concat(openUrl);

    let appWindow = await Window.getByLabel(winLabel);
    if (appWindow === null) {
      console.log('window is not created yet')
      appWindow = new Window(winLabel)
    } else {
      console.log('window is already created', appWindow)
      appWindow.show()
    };

    // const appWindow = new Window('urlWin');
    const appSize = await appWindow.innerSize();

    let webview;
    if (wvMap.has(urlKey)) {
      console.log('webview already created')
      webview = wvMap.get(urlKey)
      webview.reparent(appWindow)
    } else {
      console.log('webview is not created yet')
      webview = new Webview(appWindow, urlKey, {
        url: openUrl,
        x: 0, 
        y: 0,
        width: appSize.width,
        height: appSize.height
      })
      wvMap.set(urlKey, webview)
    }
 
    appWindow.onCloseRequested(function (e) {
      console.log('close requested', e)
      e.preventDefault();
      appWindow.hide();
    });
    webview.once('tauri://created', function () {
      console.log("Successful loading")
      appWindow.show()
    });
    webview.once('tauri://error', function (e) {
      console.log("failed to launch ", e.payload)
      appWindow.show()
     });  
  } else {
    urlMsgEl.textContent = 'Please enter a valid URL'
  }
}

window.addEventListener("DOMContentLoaded", () => {
  urlInputEl = document.querySelector("#url-input");
  urlMsgEl = document.querySelector("#url-msg");
  document.querySelector("#url-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});
