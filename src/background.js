('use strict');

const { name, version } = chrome.runtime.getManifest();
let currentTabId;

chrome.browserAction.setBadgeBackgroundColor({ color: '#F00' }); // sets default badge color to red
chrome.browserAction.disable(); //Makes left click behave like a right click and open the context menu

const setBrowserActionView = (setEnabled, tabId) => {
  const enabled = {
    title: `${name} v${version}`,
    badgeText: '',
    iconPath: './images/highlightActiveRowIcon16.png'
  };

  const disabled = {
    title: `${name} v${version} \nClick to Enable!`,
    badgeText: '!',
    iconPath: './images/highlightActiveRowIcon16OFF.png'
  };

  const { title, badgeText, iconPath } = setEnabled ? enabled : disabled;

  chrome.browserAction.setTitle({ tabId, title });
  chrome.browserAction.setIcon({ path: iconPath, tabId });
  chrome.browserAction.setBadgeText({ text: badgeText, tabId });
};
/*
 * Adapted from webext-domain-permission-toggle
 * https://github.com/fregante/webext-domain-permission-toggle @ v1.0.0
 */

async function getManifestPermissions() {
  const manifest = chrome.runtime.getManifest();
  const manifestPermissions = {
    origins: [],
    permissions: []
  };
  const list = new Set([
    ...(manifest.permissions || []),
    ...(manifest.content_scripts || []).flatMap(config => config.matches || [])
  ]);
  for (const permission of list) {
    if (permission.includes('://')) {
      manifestPermissions.origins.push(permission);
    } else {
      manifestPermissions.permissions.push(permission);
    }
  }
  return manifestPermissions;
}

const contextMenuId = 'webext-domain-permission-toggle:add-permission';
let globalOptions;
async function p(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, result => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result);
      }
    });
  });
}
async function isOriginPermanentlyAllowed(origin) {
  return p(chrome.permissions.contains, {
    origins: [origin + '/*']
  });
}
function createMenu() {
  chrome.contextMenus.remove(contextMenuId, () => chrome.runtime.lastError);
  chrome.contextMenus.create({
    id: contextMenuId,
    type: 'checkbox',
    checked: false,
    title: globalOptions.title,
    contexts: ['page_action', 'browser_action'],
    documentUrlPatterns: ['http://*/*', 'https://*/*']
  });
}
function updateItem({ tabId }) {
  console.log('updating..', tabId);
  currentTabId = tabId;
  chrome.tabs.executeScript(
    tabId,
    {
      code: 'location.origin'
    },
    async ([origin] = []) => {
      const settings = {
        checked: false,
        enabled: true
      };
      if (!chrome.runtime.lastError && origin) {
        const manifestPermissions = await getManifestPermissions();
        const isDefault = manifestPermissions.origins.some(permission =>
          permission.startsWith(origin)
        );
        settings.enabled = !isDefault;
        settings.checked =
          isDefault || (await isOriginPermanentlyAllowed(origin));
      }
      chrome.contextMenus.update(contextMenuId, settings);
      setBrowserActionView(settings.checked, tabId);

      if (settings.checked) {
        chrome.tabs.executeScript(tabId, {
          file: 'contentScript.js'
        });
      }
    }
  );
}
async function handleClick({ wasChecked, menuItemId }, tab) {
  if (menuItemId !== contextMenuId || !tab) {
    return;
  }
  try {
    const successful = await p(
      wasChecked ? chrome.permissions.remove : chrome.permissions.request,
      {
        origins: [new URL(tab.url).origin + '/*']
      }
    );
    if (wasChecked && successful) {
      chrome.contextMenus.update(contextMenuId, {
        checked: false
      });
    }
    if (!wasChecked && successful && globalOptions.reloadOnSuccess) {
      chrome.tabs.executeScript({
        code: `confirm(${JSON.stringify(
          globalOptions.reloadOnSuccess
        )}) && location.reload()`
      });
    }
  } catch (error) {
    console.error(error.message);
    alert(`Error: ${error.message}`);
    updateItem({ tabId: tab.id });
  }
}
function addDomainPermissionToggle(options) {
  globalOptions = {
    title: `Enable ${name} on this domain`,
    reloadOnSuccess: `Do you want to reload this page to apply ${name}?`,
    ...options
  };
  chrome.contextMenus.onClicked.addListener(handleClick);
  chrome.tabs.onActivated.addListener(updateItem);
  chrome.tabs.onUpdated.addListener((tabId, { status }) => {
    if (currentTabId === tabId && status === 'complete') {
      updateItem({ tabId });
    }
  });
  createMenu();
}

addDomainPermissionToggle();
