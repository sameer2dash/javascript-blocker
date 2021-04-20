const message = document.getElementById('message');

// localize the HTML
document.querySelectorAll('[data-message]').forEach(elem => {
    elem.textContent = chrome.i18n.getMessage(elem.dataset.message) || elem.textContent;
});

document.getElementById('optionsLink').addEventListener('click', (e) => {
    e.preventDefault();
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});

async function executeToggleJs() {
    message.textContent = chrome.i18n.getMessage('workingText');
    await chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        if (tabs[0] && tabs[0].url && chrome.contentSettings.javascript) {
            const url = new URL(tabs[0].url);
            const pattern = url.origin + '/*';
            if (!pattern.includes('http')) {
                message.textContent = chrome.i18n.getMessage('invalidSite');
                return;
            }
            const isIncognito = tabs[0].incognito;

            chrome.contentSettings.javascript.get({
                primaryUrl: pattern,
                incognito: isIncognito
            }, (details) => {
                if (typeof details === 'undefined') {
                    message.textContent = chrome.i18n.getMessage('noJs');
                    return;
                }
                let newSetting = 'block';
                if (details.setting === 'block') {
                    newSetting = 'allow';
                }

                chrome.contentSettings.javascript.set({
                    primaryPattern: pattern,
                    scope: isIncognito ? 'incognito_session_only' : 'regular',
                    setting: newSetting
                }, () => {
                    message.textContent = chrome.i18n.getMessage('js_' + newSetting + 'ed');
                    // setTimeout(() => window.close(), 2000);
                    chrome.storage.sync.get({ refresh: true }, (items) => {
                        items.refresh && chrome.tabs.reload(tabs[0].id || undefined);
                    });
                });
            });
        }
    });
}

executeToggleJs();
