import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, "fullName is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 6,
      select: false,
    },
  },
  { timestamp: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
