const { invoke } = window.__TAURI__.core;
const { Window, CloseRequestEvent } = window.__TAURI__.window;
const { Webview } = window.__TAURI__.webview;

let urlInputEl;
let urlMsgEl;

async function greet() {
  const urlHead = 'https://'
  let openUrl;
  if (urlInputEl.value.length > 0) {
    if (urlInputEl.value.slice(0, 7) === urlHead) {
      openUrl = urlInputEl;
    } else {
      openUrl = urlHead.concat(urlInputEl.value);
    }
    urlMsgEl.textContent = "Let's Open ".concat(openUrl);

    const appWindow = new Window('urlWin');
    const appSize = await appWindow.innerSize();
  
    const webview = new Webview(appWindow, 'urlWinWV', {
      url: openUrl,
      parent: "main",
      x: 0, 
      y: 0,
      width: appSize.width,
      height: appSize.height
    });

    appWindow.listen('tauri://close-requested', function (e) {
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
