const user = require("./user");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.Verify = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ status: 0 });
    jwt.verify(token, process.env.TOKEN_KEY, async (error, data) => {
      if (error) return res.json({ status: 0 });
      const existing_user = await user.findById(data.id);
      if (!existing_user) return res.json({ status: 0 });
      return res.json({ status: 1, user: existing_user.email });
    });
  } catch(error) {
    console.error(error);
  }
};