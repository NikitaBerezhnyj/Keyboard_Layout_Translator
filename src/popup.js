document.addEventListener("DOMContentLoaded", function () {
  const clearButton = document.getElementById("clearButton");
  const translateButton = document.getElementById("translateButton");
  const inputTextField = document.querySelector(".translate-input input");
  const outputTextField = document.querySelector(".translate-output input");
  const inputLangSelect = document.getElementById("input-lang");
  const outputLangSelect = document.getElementById("output-lang");
  const langChanger = document.getElementById("lang-changer");
  const langChangerImg = document.getElementById("lang-changer-img");

  // Встановлення фокусу на поле вводу при завантаженні розширення
  inputTextField.focus();

  // Отримання виділеного тексту з background.js
  browser.storage.local.get("selectedText").then((result) => {
    const text = result.selectedText || ""; // Задаємо значення за замовчуванням, якщо воно відсутнє
    inputTextField.value = text;
    // Очищення збереженого виділеного тексту
    browser.storage.local.set({
      selectedText: "",
    });
  });

  // Завантажуємо збережені значення селектів під час завантаження сторінки
  function getSavedSelectValues() {
    browser.storage.local
      .get(["inputLangValue", "outputLangValue"])
      .then((result) => {
        const { inputLangValue, outputLangValue } = result;
        if (inputLangValue && outputLangValue) {
          inputLangSelect.value = inputLangValue;
          outputLangSelect.value = outputLangValue;
        }
      });
  }

  // Функція для збереження обраних значень селектів в локальному сховищі браузера
  function saveSelectValues() {
    const inputLangValue = inputLangSelect.value;
    const outputLangValue = outputLangSelect.value;
    browser.storage.local.set({ inputLangValue, outputLangValue });
  }

  // Функція для виконання перекладу тексту
  function translateText() {
    const text = inputTextField.value.trim(); // Видаляємо зайві пробіли з початку і кінця введеного тексту
    const inputLangValue = inputLangSelect.value;
    const outputLangValue = outputLangSelect.value;

    if (text !== "") {
      // Перевіряємо, чи текст не порожній
      let translatedText;

      // Перевірка, чи обрана мова вводу співпадає зі значенням inputLangSelect
      const fromLayout = inputLangValue === "ukr" ? "ukr" : "eng";
      const toLayout = outputLangValue === "ukr" ? "ukr" : "eng";

      translatedText = translateTextByLayout(text, fromLayout, toLayout);

      if (translatedText === "") {
        outputTextField.value = "Invalid input language";
      } else {
        outputTextField.value = translatedText;
      }
    } else {
      outputTextField.value = ""; // Якщо текст порожній, очищаємо вивід
    }
  }

  // Натискання на кнопку 'Очищення'
  clearButton.addEventListener("click", function () {
    inputTextField.value = "";
    outputTextField.value = "";
  });

  // Натискання на кнопку 'Переклад'
  translateButton.addEventListener("click", translateText);

  // Обробник події зміни значення селекта вхідної мови
  // та зміни значення селекта вихідної мови
  inputLangSelect.addEventListener("change", function () {
    saveSelectValues();
    translateText();
  });

  outputLangSelect.addEventListener("change", function () {
    saveSelectValues();
    translateText();
  });

  // Обробник події кліку по кнопці для зміни значення селектів
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

  // Завантаження збережених значень селектів після завантаження сторінки
  getSavedSelectValues();
});

// Перевірка мови input та input select
function isInputLangValid(text) {
  const inputLangValue = inputLangSelect.value;
  if (inputLangValue === "ukr") {
    return /^[\u0400-\u04FF\s]+$/.test(text);
  } else if (inputLangValue === "eng") {
    return /^[a-zA-Z\s]+$/.test(text);
  }
  return false;
}

// Займається перекладом
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

// Символи української розкладки
const ukrainianLetters = [
  "й",
  "ц",
  "у",
  "к",
  "е",
  "н",
  "г",
  "ш",
  "щ",
  "з",
  "х",
  "ї",
  "ф",
  "і",
  "в",
  "а",
  "п",
  "р",
  "о",
  "л",
  "д",
  "ж",
  "є",
  "я",
  "ч",
  "с",
  "м",
  "и",
  "т",
  "ь",
  "б",
  "ю",
  ".",
  "Й",
  "Ц",
  "У",
  "К",
  "Е",
  "Н",
  "Г",
  "Ш",
  "Щ",
  "З",
  "Х",
  "Ї",
  "Ф",
  "І",
  "В",
  "А",
  "П",
  "Р",
  "О",
  "Л",
  "Д",
  "Ж",
  "Є",
  "Я",
  "Ч",
  "С",
  "М",
  "И",
  "Т",
  "Ь",
  "Б",
  "Ю",
  ",",
];
// Символи англійської розкладки
const englishLetters = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "[",
  "]",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  ";",
  "'",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  ",",
  ".",
  "/",
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "{",
  "}",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  ":",
  '"',
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "<",
  ">",
  "?",
];
