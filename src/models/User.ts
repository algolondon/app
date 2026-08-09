import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tier: { type: String, default: "tier1" },
  tradingviewUsername: { type: String, default: "" },
  active: { type: Boolean, default: false },
  status: { type: String, default: "pending_payment" },
  paypalSubscriptionId: { type: String, default: null },
  completedModules: { type: [String], default: [] },
  abandonedEmailSent: { type: Boolean, default: false },
  role: { type: String, default: "user" },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
