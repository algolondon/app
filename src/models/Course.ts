import mongoose, { Schema, Document } from "mongoose";

export interface ICourseAttachment {
  title: string;
  url: string;
  type?: string; // 'pdf' | 'link' | 'file' | 'image'
}

export interface ICourse extends Document {
  title: string;
  url: string;
  youtubeUrl?: string;
  courseCategory: string;
  description?: string;
  attachments?: ICourseAttachment[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    courseCategory: { type: String, default: "Course 1: Trend Algo Strategy" },
    description: { type: String, default: "" },
    attachments: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, default: "pdf" }
      }
    ],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
