// Allows to format a string in order to have a more permissive and easy search for the user

/**
 * 
 * @param {String} string - The string to normalize
 * @returns {String} The normalized string
 */
// eslint-disable-next-line no-unused-vars
function normalizeString(string) {
  const diacriticRegex = new RegExp(/\p{Diacritic}/, "gu");
  const spaceRegex = new RegExp(/\s/, "g");
  return string
    .normalize("NFD") // returns the string in normalized Unicode form with decomposition of diacritics (accents, umlauts, cedillas, etc.)
    .replace(diacriticRegex, "") // remove diacritics
    .toLowerCase()
    .replace(spaceRegex, ""); // remove all spaces
}