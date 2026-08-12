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
  subscriptionEndDate: { type: Date, default: null },
  completedModules: { type: [String], default: [] },
  abandonedEmailSent: { type: Boolean, default: false },
  role: { type: String, default: "user" },
}, { timestamps: true });

UserSchema.index({ active: 1, tier: 1 });
UserSchema.index({ role: 1 });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
