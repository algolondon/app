"use client";

import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";

export function CourseCard({ 
  course, 
  idx, 
  embedUrl, 
  isCompletedInitial 
}: { 
  course: any, 
  idx: number, 
  embedUrl: string, 
  isCompletedInitial: boolean 
}) {
  const [completed, setCompleted] = useState(isCompletedInitial);
  const [loading, setLoading] = useState(false);

  const toggleProgress = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/course/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: course._id || `fallback-${idx}`,
          completed: !completed,
        }),
      });
      if (res.ok) {
        setCompleted(!completed);
      }
    } catch (err) {
      console.error("Failed to update progress", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] transition-all duration-300 relative group">
      <div className="aspect-video w-full bg-black relative">
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          title={course.videoTitle}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        {completed && (
          <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1 backdrop-blur-md">
            <CheckCircle className="text-[#00D4FF] w-6 h-6" />
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col justify-between h-[120px]">
        <div>
          <h3 className="font-bold text-lg text-[#00D4FF] line-clamp-1">{course.videoTitle}</h3>
          <p className="text-sm text-muted-foreground">Module {idx + 1}</p>
        </div>
        
        <button 
          onClick={toggleProgress}
          disabled={loading}
          className={`flex items-center gap-2 text-sm font-medium transition-colors mt-4 ${completed ? 'text-[#00D4FF]' : 'text-muted-foreground hover:text-white'}`}
        >
          {completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
          {completed ? "Completed" : "Mark as complete"}
        </button>
      </div>
    </div>
  );
}
