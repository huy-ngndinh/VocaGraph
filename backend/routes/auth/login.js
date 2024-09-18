const { secret_token } = require("./secret_token");
const user = require("./user");
const argon2 = require("argon2");

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const exisiting_user = await user.findOne({ email: email });
    if (!exisiting_user) return res.json({ status: 0, message: "User not registered!" });
    const password_match = await argon2.verify(exisiting_user.password, password);
    if (!password_match) return res.json({ status: 0, message: "Password incorrect!" });
    const token = secret_token(exisiting_user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    });
    res.status(201).json({ status: 1, message: "Login successfully!" });
  } catch(error) {
    console.error(error);
  }
};