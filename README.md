# Highlight Active Row

This extension helps prevent mistaken data entry by making the currently selected table row more visible. Anytime an input box inside of a table is selected the entire table row gets its style changed. The goal is to make it extremely obvious which row you are currently inputting data on to reduce the chances of inputting data on the wrong row.

Chrome Web Store Link: [Highlight Active Row](https://chrome.google.com/webstore/detail/highlight-active-row/dcbeiccbdljdceifakkgndpemfaoeaip)

---

## Development - Getting Started

1. clone the repo:
   In the terminal navigate to desired install directory and type the following command:

   `$git clone https://github.com/tomrule007/Highlight-Active-Row.git`

2. Open Chrome and navigate to the extensions settings page: [chrome://extensions](chrome://extensions)
3. Turn on 'Developer mode' by clicking the toggle switch in the upper right hand corner.
4. Now select 'Load unpacked' in the upper left hand corner and navigate to the cloned repo folder and select open.
   (Make sure it is the folder with the `manifest.json` file.)

The extension should now be loaded! You can serve the included webpage in the test folder to test the extension.

\*Note any change will require manually refreshing the webpage or possibly the entire extension as there is no hot reloading included with this extension.

---

## How the extension works

The extension injects a small script that adds a 'focusin'/'focusout' event listener to the root document object.

When the 'focusin' event fires it starts at the event.target and traverses the DOM in search of a '`<tr>`' parent element. If a '`<tr>`' is found it sets the inline style to a preset highlight style.

When the 'focusout' event fires it starts at the event.target and traverses the DOM in search of a '`<tr>`' parent element. If a '`<tr>`' is found it clears the inline style.

### Extra Details

- The extension needs to be enabled the first time you visit a new website by clicking the extension icon and selecting `Enable Highlight Active Row on this domain` from the context menu. This allows the user to only run the extension on select websites.
- Currently has a hard set MAX_DEPTH of 5 which limits how many parents it check before stopping. This should prevent all unnecessary DOM traversing for nodes not connected to a table, but also allow some wiggle room if the input is in a '`<div>`' or two.

## Future features

- add an options page that allows the user to set a custom highlight style

## Version History

- 1.2.0: Allow the user to enable/disable the extension for each website domain
- 1.1.0: Switched to focusin/focusout events & delegation which works with dynamically added content.
- 1.0.0: Event listener were attached to each input element on load & didn't work with dynamically added content.
