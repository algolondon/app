import mongoose from "mongoose";
import { Course } from "./src/models/Course";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not set");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await Course.deleteMany({});
  console.log("Cleared existing courses");

  const newCourses = [
    { title: "Intro", url: "https://vimeo.com/955219754/6a81a4bca9?share=copy", order: 1 },
    { title: "Setting up chart", url: "https://vimeo.com/955231737/db19e5eb66?share=copy", order: 2 },
    { title: "Trend algo", url: "https://vimeo.com/955260173/06518c0fba?share=copy", order: 3 },
    { title: "London X algo", url: "https://vimeo.com/955236177/9c065f49ce?share=copy", order: 4 },
    { title: "ATM algo", url: "https://vimeo.com/955255403/cff92ad927?share=copy", order: 5 },
    { title: "Live Trade 1", url: "https://vimeo.com/955246757/800f7c223c?share=copy", order: 6 },
    { title: "Live Trade 2", url: "https://vimeo.com/955240578/7f8a7e44a4?share=copy", order: 7 },
  ];

  await Course.insertMany(newCourses);
  console.log("Inserted new courses");

  await mongoose.disconnect();
}

seed().catch(console.error);
