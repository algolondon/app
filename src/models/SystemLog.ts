import mongoose from "mongoose";

const SystemLogSchema = new mongoose.Schema({
  level: { type: String, default: "error" },
  source: { type: String, required: true },
  message: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export const SystemLog = mongoose.models.SystemLog || mongoose.model("SystemLog", SystemLogSchema);
