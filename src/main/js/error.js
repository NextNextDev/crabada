import '../css/main';
let buttonNode = document.querySelector('.main__btn--item._submit');
buttonNode.addEventListener('click', () => {
    chrome.storage.local.set({ token: null, refreshToken: null, stepMain: 1 }, function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        }
        chrome.runtime.reload();
    });
})