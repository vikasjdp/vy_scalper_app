import mongoose, { InferSchemaType, Types } from "mongoose";

export interface IAccount {
  _id: string;
  user: Types.ObjectId;
  name: string;
  userId: string;
  password: string;
  totpCode: string;
  broker: string;
  key: string;
  secret: string;
  token?: string;
  tokenExp?: string;
}

const accountSchema = new mongoose.Schema<IAccount>({
  user: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Name is Required"],
  },
  userId: {
    type: String,
    required: [true, "UserId is Required"],
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  totpCode: {
    type: String,
    required: [true, "TOTP Code is Required"],
  },
  broker: {
    type: String,
    required: [true, "Broker is Required"],
  },
  key: {
    type: String,
    required: [true, "Key is Required"],
  },
  secret: {
    type: String,
    required: [true, "Secret/VC is Required"],
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: String,
    get: (v: string) => v === new Date().toDateString(),
  },
});

accountSchema.pre("save", function (next) {
  if (!this.isModified("token")) return next();
  this.tokenExp = new Date().toDateString();
  next();
});

const Account =
  mongoose.models.Account || mongoose.model("Account", accountSchema);

export default Account;
