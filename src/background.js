console.log("Extension load");

browser.menus.create({
  id: "translate-to-correct-layout",
  title: "Translate to correct layout",
  contexts: ["selection"]
});

browser.menus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText;
  browser.storage.local.set({
    selectedText: selectedText
  });
  // browser.browserAction.openPopup();
  browser.action.openPopup();
});
