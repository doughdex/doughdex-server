const setOffset = (page, limit) => {
  return (page - 1) * limit;
};

module.exports = { setOffset };