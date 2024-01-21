document.addEventListener('DOMContentLoaded', function () {
    const clearButton = document.getElementById('clearButton');
    const translateButton = document.getElementById('translateButton');
    const inputUa = document.querySelector('.translate-input input');
    const inputEn = document.querySelector('.translate-output input');

    clearButton.addEventListener('click', function () {
        clearInputFields();
    });

    function clearInputFields() {
        inputUa.value = '';
        inputEn.value = '';
    }

    translateButton.addEventListener('click', function () {
        const textUa = inputUa.value;

        if (textUa) {
            const isFirstLetterUkrainian = checkIfFirstLetterUkrainian(textUa);

            if (isFirstLetterUkrainian) {
                const translatedTextEn = translateToEnglish(textUa);
                inputEn.value = translatedTextEn;
            } else {
                const translatedTextUa = translateToUkrainian(textUa);
                inputEn.value = translatedTextUa;

            }
        }
    });

    function checkIfFirstLetterUkrainian(text) {
        // ASCII-коди для літер 'а' - 'я' та 'А' - 'Я' на українській розкладці
        const ukrainianLowerCaseRange = [1072, 1103];
        const ukrainianUpperCaseRange = [1040, 1071];

        const firstCharCode = text.charCodeAt(0);
        return (
            (firstCharCode >= ukrainianLowerCaseRange[0] && firstCharCode <= ukrainianLowerCaseRange[1]) ||
            (firstCharCode >= ukrainianUpperCaseRange[0] && firstCharCode <= ukrainianUpperCaseRange[1])
        );
    }

    function translateToUkrainian(textEn) {
        const ukrainianLayout = {
            'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з',
            '[': 'х', ']': 'ї', 'a': 'ф', 's': 'і', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л',
            'l': 'д', ';': 'ж', "'": 'є', 'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь',
            ',': 'б', '.': 'ю', '/': '.',
            'Q': 'Й', 'W': 'Ц', 'E': 'У', 'R': 'К', 'T': 'Е', 'Y': 'Н', 'U': 'Г', 'I': 'Ш', 'O': 'Щ', 'P': 'З',
            '{': 'Х', '}': 'Ї', 'A': 'Ф', 'S': 'І', 'D': 'В', 'F': 'А', 'G': 'П', 'H': 'Р', 'J': 'О', 'K': 'Л',
            'L': 'Д', ':': 'Ж', '"': 'Є', 'Z': 'Я', 'X': 'Ч', 'C': 'С', 'V': 'М', 'B': 'И', 'N': 'Т', 'M': 'Ь',
            '<': 'Б', '>': 'Ю', '?': ','
        };

        return textEn.split('').map(char => ukrainianLayout[char] || char).join('');
    }

    function translateToEnglish(textUa) {
        const englishLayout = {
            'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p',
            'х': '[', 'ї': ']', 'ф': 'a', 'і': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k',
            'д': 'l', 'ж': ';', 'є': "'", 'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm',
            'б': ',', 'ю': '.', '.': '/',
            'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P',
            'Х': '{', 'Ї': '}', 'Ф': 'A', 'І': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K',
            'Д': 'L', 'Ж': ':', 'Є': '"', 'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'M',
            'Б': '<', 'Ю': '>', ',': '?'
        };

        return textUa.split('').map(char => englishLayout[char] || char).join('');
    }
});