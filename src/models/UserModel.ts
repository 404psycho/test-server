import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    username: {
      type: "String",
      required: true,
      unique: true,
    },
    password: {
      type: "String",
      required: true,
    },
    role: {
      type: "String",
      required: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
