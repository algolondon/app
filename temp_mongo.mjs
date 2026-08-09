import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log("MONGODB_URI is not set!");
  process.exit(1);
}

mongoose.connect(MONGODB_URI).then(async () => {
  const SettingSchema = new mongoose.Schema({ telegramLink: String }, { strict: false });
  const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
  await Setting.updateOne({}, { telegramLink: 'https://t.me/+_JqY7DXwWpAxOGUx' }, { upsert: true });
  console.log('Telegram link updated in DB');
  process.exit(0);
});
