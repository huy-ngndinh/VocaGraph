const user = require("../auth/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.Get_Graph = async (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.json({ status: 0 });
    jwt.verify(token, process.env.TOKEN_KEY, async (error, data) => {
      if (error) return res.json({ status: 0 });
      const existing_user = await user.findById(data.id);
      if (!existing_user) return res.json({ status: 0 });
      return res.json({ status: 1, graph_data: existing_user.graph_data });
    });
  } catch(error) {
    console.error(error);
  }
}