let ukrainianLetters, englishLetters;

const lettersReady = import("./letters.js")
  .then(module => {
    ukrainianLetters = module.ukrainianLetters;
    englishLetters = module.englishLetters;
  })
  .catch(err => {
    console.error("Error loading letters module:", err);
  });

document.addEventListener("DOMContentLoaded", async function () {
  const clearButton = document.getElementById("clearButton");
  const copyButton = document.getElementById("copyButton");
  const inputTextField = document.querySelector(".translate-input input");
  const outputTextField = document.querySelector(".translate-output input");
  const inputLangSelect = document.getElementById("input-lang");
  const outputLangSelect = document.getElementById("output-lang");
  const langChanger = document.getElementById("lang-changer");
  const langChangerImg = document.getElementById("lang-changer-img");

  inputTextField.focus();

  await lettersReady;

  const result = await browser.storage.local.get("selectedText");
  const text = result.selectedText || "";

  if (text) {
    inputTextField.value = text;
    await browser.storage.local.set({ selectedText: "" });
    translateText();
  }

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
    let inputLangValue = inputLangSelect.value;
    let outputLangValue = outputLangSelect.value;

    if (text === "") {
      outputTextField.value = "";
      return;
    }

    if (!inputLangValue) {
      const detectedLang = detectLanguage(
        text,
        ukrainianLetters,
        englishLetters
      );
      if (detectedLang) {
        inputLangValue = detectedLang;
        inputLangSelect.value = detectedLang;
        outputLangValue = detectedLang === "ukr" ? "eng" : "ukr";
        outputLangSelect.value = outputLangValue;
        saveSelectValues();
      }
    }

    if (!inputLangValue || !outputLangValue) {
      outputTextField.value = "Select or type text to detect language";
      return;
    }

    const translatedText = translateTextByLayout(
      text,
      inputLangValue,
      outputLangValue
    );
    outputTextField.value = translatedText || "Invalid input language";
  }

  clearButton.addEventListener("click", function () {
    inputTextField.value = "";
    outputTextField.value = "";
  });

  inputTextField.addEventListener("input", translateText);

  copyButton.addEventListener("click", function () {
    const textToCopy = outputTextField.value.trim();
    if (!textToCopy) return;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        copyButton.textContent = "✅ Copied!";
        setTimeout(() => (copyButton.textContent = "Copy"), 1500);
      })
      .catch(err => console.error("Clipboard error:", err));
  });

  inputLangSelect.addEventListener("change", () => {
    saveSelectValues();
    translateText();
  });

  outputLangSelect.addEventListener("change", () => {
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
      translateText();
    }, 1000);
  });

  getSavedSelectValues();
});

function detectLanguage(text, ukrainianLetters, englishLetters) {
  if (!text.trim()) return null;
  const ukrCount = [...text].filter(ch => ukrainianLetters.includes(ch)).length;
  const engCount = [...text].filter(ch => englishLetters.includes(ch)).length;
  if (ukrCount === 0 && engCount === 0) return null;
  return ukrCount > engCount ? "ukr" : "eng";
}

function translateTextByLayout(text, fromLayout, toLayout) {
  let fromLetters, toLetters;

  if (fromLayout === "ukr") fromLetters = ukrainianLetters;
  else if (fromLayout === "eng") fromLetters = englishLetters;
  else return text;

  if (toLayout === "ukr") toLetters = ukrainianLetters;
  else if (toLayout === "eng") toLetters = englishLetters;
  else return text;

  return [...text]
    .map(ch => {
      const index = fromLetters.indexOf(ch);
      return index !== -1 ? toLetters[index] : ch;
    })
    .join("");
}
