const generateFilename = () => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2);
  return `${timestamp}_${randomString}`;
};

module.exports = generateFilename;
