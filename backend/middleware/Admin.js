module.exports = (req, res, next) => {
  // If we had multiple roles, we'd check here. For now, just pass.
  next();
};