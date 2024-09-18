const user = require("../auth/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.Update_Graph = async (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.json({ status: 0 });
    jwt.verify(token, process.env.TOKEN_KEY, async (error, data) => {
      if (error) return res.json({ status: 0 });
      const { new_nodes, new_links } = req.body;
      const existing_user = await user.findById(data.id);
      if (!existing_user) return res.json({ status: 0 });
      new_nodes.forEach((node) => existing_user.graph_data.nodes.push(node));
      new_links.forEach((link) => existing_user.graph_data.links.push(link));
      const new_user = await existing_user.save();
      return res.json({ status: 1, message: "Graph updated successfully!", user: new_user });
    });
  } catch(error) {
    console.log(error);
  }
}