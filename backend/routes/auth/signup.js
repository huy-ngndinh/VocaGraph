const user = require("./user");
const { secret_token } = require("./secret_token");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, confirm_password, created_date } = req.body;
    if (password !== confirm_password) return res.json({ status: 0, message: "Password mismatched" });
    const existing_user = await user.findOne({ email: email });
    if (existing_user) return res.json({ status: 0, message: "User already exists" });
    const new_user = await user.create({ email: email, password: password, created_date: created_date, graph_data: { nodes: [], links: [] } });
    const token = secret_token(new_user._id);
    // res.cookie("token", token, {
    //   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'Lax',
    // });
    res.status(201).json({ status: 1, message: "User signed up successfully!", token: token });
  } catch(error) {
    console.error(error);
  }
}