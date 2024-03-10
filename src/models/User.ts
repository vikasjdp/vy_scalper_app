import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Required"],
    },
    email: {
        type: String,
        unique: [true, "Email already exist"],
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is requierd"],
      },
    isAdmin: {
        type: Boolean,
        default: false,
    }
})

userSchema.pre('save', async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswrodCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
  };

const User = mongoose.models.User || mongoose.model("User",userSchema)

export default User;