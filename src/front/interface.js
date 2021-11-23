import './css/interface.css';
class Interface {
    _html;

    async start() {
        const pathToFile = chrome.runtime.getURL('interface.html');
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return true;
        }
        const textHtml = await (await fetch(pathToFile)).text();
        const master = new DOMParser();
        const parsed = master.parseFromString(textHtml, `text/html`);
        this._html = parsed.getElementById('interface');
        return true;
    }

    get html() {
        return this._html;
    }
}

export {Interface};