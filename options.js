// localize the HTML
document.querySelectorAll('[data-message]').forEach(elem => {
    elem.textContent = chrome.i18n.getMessage(elem.dataset.message);
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get({
        refresh: true
    }, (items) => {
        document.getElementById('refresh').checked = items.refresh;
    });
});

document.getElementById('save').addEventListener('click', () => {
    const refresh = document.getElementById('refresh').checked;
    chrome.storage.sync.set({
        refresh: refresh
    }, () => {
        const message = document.getElementById('message');
        message.textContent = chrome.i18n.getMessage('optionsSaved');
        setTimeout(() => {
            message.textContent = '\u00A0';
        }, 1000);
    });
});
