const mongoose = require("mongoose");
const argon2 = require("argon2");

const user_schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Your username is required"],
  },
  created_date: {
    type: Date,
    default: new Date(),
  },
  graph_data: {
    nodes: [{
      id: {
        type: String,
        // required: true,
      },
      group: {
        type: String,
        // required: true,
      }
    }],
    links: {
      type: [{
        source: {
          type: String,
          // required: true,
        },
        target: {
          type: String,
          // required: true,
        }
      }],
      unique: true,
    }
  }
});

// this requires function() format
user_schema.pre("save", async function() {
  if (this.isModified("password") || this.isNew) {
    this.password = await argon2.hash(this.password);
  }
});

module.exports = mongoose.model("user", user_schema);