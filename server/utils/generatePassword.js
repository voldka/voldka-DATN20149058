function generateRandomPassword() {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const digitChars = '0123456789';
  const specialChars = '@!';

  const allChars = uppercaseChars + lowercaseChars + digitChars + specialChars;

  const getRandomChar = (charSet) => {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet.charAt(randomIndex);
  };

  // Ensure at least one character from each character set
  const password =
    getRandomChar(uppercaseChars) +
    getRandomChar(lowercaseChars) +
    getRandomChar(digitChars) +
    getRandomChar(specialChars) +
    // Generate the rest of the password
    Array.from({ length: 4 }, () => getRandomChar(allChars)).join('');

  // Shuffle the password to randomize the order
  const shuffledPassword = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  return shuffledPassword;
}

module.exports = generateRandomPassword;
