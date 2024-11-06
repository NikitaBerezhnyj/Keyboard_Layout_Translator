let ukrainianLetters, englishLetters;

import("./letters.js")
  .then(module => {
    ukrainianLetters = module.ukrainianLetters;
    englishLetters = module.englishLetters;
  })
  .catch(err => {
    console.error("Error loading letters module:", err);
  });

document.addEventListener("DOMContentLoaded", function () {
  const clearButton = document.getElementById("clearButton");
  const translateButton = document.getElementById("translateButton");
  const inputTextField = document.querySelector(".translate-input input");
  const outputTextField = document.querySelector(".translate-output input");
  const inputLangSelect = document.getElementById("input-lang");
  const outputLangSelect = document.getElementById("output-lang");
  const langChanger = document.getElementById("lang-changer");
  const langChangerImg = document.getElementById("lang-changer-img");

  inputTextField.focus();

  browser.storage.local.get("selectedText").then(result => {
    const text = result.selectedText || "";
    inputTextField.value = text;
    browser.storage.local.set({
      selectedText: ""
    });

    translateText();
  });

  function getSavedSelectValues() {
    browser.storage.local
      .get(["inputLangValue", "outputLangValue"])
      .then(result => {
        const { inputLangValue, outputLangValue } = result;
        if (inputLangValue && outputLangValue) {
          inputLangSelect.value = inputLangValue;
          outputLangSelect.value = outputLangValue;
        }
      });
  }

  function saveSelectValues() {
    const inputLangValue = inputLangSelect.value;
    const outputLangValue = outputLangSelect.value;
    browser.storage.local.set({ inputLangValue, outputLangValue });
  }

  function translateText() {
    const text = inputTextField.value.trim();
    const inputLangValue = inputLangSelect.value;
    const outputLangValue = outputLangSelect.value;

    if (text !== "") {
      let translatedText;

      const fromLayout = inputLangValue === "ukr" ? "ukr" : "eng";
      const toLayout = outputLangValue === "ukr" ? "ukr" : "eng";

      translatedText = translateTextByLayout(text, fromLayout, toLayout);

      if (translatedText === "") {
        outputTextField.value = "Invalid input language";
      } else {
        outputTextField.value = translatedText;
      }
    } else {
      outputTextField.value = "";
    }
  }

  clearButton.addEventListener("click", function () {
    inputTextField.value = "";
    outputTextField.value = "";
  });

  translateButton.addEventListener("click", translateText);

  inputLangSelect.addEventListener("change", function () {
    saveSelectValues();
    translateText();
  });

  outputLangSelect.addEventListener("change", function () {
    saveSelectValues();
    translateText();
  });

  langChanger.addEventListener("click", function () {
    const currentInputValue = inputLangSelect.value;
    const currentOutputValue = outputLangSelect.value;

    langChangerImg.classList.add("change-animation");

    setTimeout(() => {
      inputLangSelect.value = currentOutputValue;
      outputLangSelect.value = currentInputValue;
      saveSelectValues();
      langChangerImg.classList.remove("change-animation");
    }, 1000);
  });

  getSavedSelectValues();
});

function translateTextByLayout(text, fromLayout, toLayout) {
  let fromLetters, toLetters;

  switch (fromLayout) {
    case "ukr":
      fromLetters = ukrainianLetters;
      break;
    case "eng":
      fromLetters = englishLetters;
      break;
    default:
      return text;
  }

  switch (toLayout) {
    case "ukr":
      toLetters = ukrainianLetters;
      break;
    case "eng":
      toLetters = englishLetters;
      break;
    default:
      return text;
  }

  let translatedText = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const index = fromLetters.indexOf(char);
    if (index !== -1) {
      translatedText += toLetters[index];
    } else {
      translatedText += char;
    }
  }

  return translatedText;
}
