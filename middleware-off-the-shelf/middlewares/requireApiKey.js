module.exports = function requireApiKey(req, res, next) {
  const expectedKey = process.env.API_KEY || "cyf";
  const providedKey = req.header("x-api-key");

  if (providedKey !== expectedKey) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  next();
};
