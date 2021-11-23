import Preloader from '@/lib/preloader/preloader.js';
import '../css/main';

let preloaderInstance = new Preloader();
preloaderInstance.start(document.querySelector('body'));

let btn = document.getElementsByClassName('main__btn--item')[0];
btn.addEventListener('click', changeStep);

function changeStep() {
    chrome.storage.local.set({ stepMain: 2 }, function () {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
            preloaderInstance.switch(false)
        }
        chrome.browserAction.setPopup({ popup: 'auth.html' });
        window.location = chrome.runtime.getURL('auth.html');
    });
}

preloaderInstance.switch(false)
