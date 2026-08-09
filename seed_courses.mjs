import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.log("MONGODB_URI is not set!");
  process.exit(1);
}

const CourseSchema = new mongoose.Schema({
  title: String,
  videoTitle: String,
  youtubeUrl: String,
  order: Number,
  isActive: { type: Boolean, default: true }
}, { strict: false });

mongoose.connect(MONGODB_URI).then(async () => {
  const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
  
  await Course.deleteMany({});
  
  const videos = [
    { title: "Module 1", videoTitle: "Welcome Video", youtubeUrl: "https://youtu.be/OjKrUb9H1nU", order: 1, isActive: true },
    { title: "Module 2", videoTitle: "Setup & Installation", youtubeUrl: "https://youtu.be/2R3GSTrHNSo", order: 2, isActive: true },
    { title: "Module 3", videoTitle: "Understanding The System", youtubeUrl: "https://youtu.be/u-P_jS7z2S0", order: 3, isActive: true },
    { title: "Module 4", videoTitle: "Understanding The System Confirmations", youtubeUrl: "https://youtu.be/s4tMVKlQ6Ps", order: 4, isActive: true },
    { title: "Module 5", videoTitle: "How to use the system confirmations and best time frames", youtubeUrl: "https://youtu.be/ruRVwPZJwN8", order: 5, isActive: true },
    { title: "Module 6", videoTitle: "Finding Buy Setups", youtubeUrl: "https://youtu.be/ah6lkTulJok", order: 6, isActive: true },
    { title: "Module 7", videoTitle: "FInding Sell Setups", youtubeUrl: "https://youtu.be/_MFTZI5iwpg", order: 7, isActive: true },
    { title: "Module 8", videoTitle: "Complete 16London Trading Routine", youtubeUrl: "https://youtu.be/isPfoz6tGJw", order: 8, isActive: true }
  ];

  await Course.insertMany(videos);
  console.log('Inserted 8 videos.');
  process.exit(0);
});
