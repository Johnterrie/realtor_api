import mongoose, { InferSchemaType, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";

const UserSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is Required"],
      unique: true,
      lowercase: true,
      min: [6, "Username must be more than 6 Characters"],
      max: 255,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    email: {
      type: String,
      required: [true, "Please enter an email address"],
      trim: true,
      select: false,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      min: [8, "Password must be More than 6 Characters"],
      max: 255,
      select: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

// create JWT
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.username },
    config.get<string>("JWT_SECRET"),
    {
      expiresIn: "10min",
    }
  );
};

// compare password
UserSchema.methods.comparePassword = async function (userPassword: string) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

type User = InferSchemaType<typeof UserSchema>;

export default model<User>("User", UserSchema);
