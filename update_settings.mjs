import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  description: { type: String },
});

const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

async function updateSettings() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Telegram
  await Setting.findOneAndUpdate(
    { key: 'telegramLink' },
    { value: 'https://t.me/+_JqY7DXwWpAxOGUx' },
    { upsert: true }
  );

  // PDF - assuming he doesn't have one right now, we can make it empty so it shows "Coming Soon" or link to a placeholder
  await Setting.findOneAndUpdate(
    { key: 'pdfLink' },
    { value: '' }, // empty value will make the fallback "Coming soon" show up.
    { upsert: true }
  );
  
  console.log("Settings updated in MongoDB");
  process.exit(0);
}

updateSettings();
