"use client";

import { useState, useEffect } from "react";
import { PlayCircle, CheckCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Course {
  _id: string;
  videoTitle: string;
  youtubeUrl: string;
}

interface CoursePlayerProps {
  courses: Course[];
  completedModules: string[];
}

export function CoursePlayer({ courses, completedModules }: CoursePlayerProps) {
  const router = useRouter();
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);
  const [localCompletedModules, setLocalCompletedModules] = useState<string[]>(completedModules || []);

  useEffect(() => {
    if (completedModules) {
      setLocalCompletedModules(completedModules);
    }
  }, [completedModules]);

  const toggleModuleComplete = async (moduleId: string) => {
    if (!moduleId) {
      console.error("toggleModuleComplete called with empty moduleId");
      return;
    }
    const isCompleted = localCompletedModules.includes(moduleId);
    const newCompleted = !isCompleted;
    
    // Optimistic UI update
    setLocalCompletedModules(prev => 
      newCompleted ? [...prev, moduleId] : prev.filter(id => id !== moduleId)
    );

    try {
      const res = await fetch('/api/course/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, completed: newCompleted })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("API error:", res.status, errData);
        throw new Error(`API request failed: ${res.status}`);
      }

      const data = await res.json();
      // Update state directly from server response — most reliable approach
      if (data.completedModules) {
        setLocalCompletedModules(data.completedModules.map((id: any) => id.toString()));
      }
      router.refresh();
    } catch (e) {
      console.error("Failed to update progress:", e);
      // Revert optimistic update on failure
      setLocalCompletedModules(prev => 
        newCompleted ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
      );
    }
  };

  const activeCourse = courses[activeCourseIndex];

  // Helper to safely get embed url
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("/embed/")) return url;
    
    // Convert watch?v= format or youtu.be/ format
    const videoIdMatch = url.match(/(?:v=|\/|youtu\.be\/)([0-9A-Za-z_-]{11}).*/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] w-full max-w-[1600px] mx-auto border-t border-[#00D4FF]/10">
      
      {/* LEFT COLUMN: Playlist / Modules Sidebar */}
      <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#050B14] border-r border-[#00D4FF]/10 flex flex-col order-2 lg:order-1 shrink-0">
        <div className="p-6 border-b border-[#00D4FF]/10 sticky top-0 bg-[#050B14] z-10">
          <h2 className="text-xl font-bold text-white mb-2">Course Modules</h2>
          <p className="text-sm text-muted-foreground">
            {localCompletedModules.length} / {courses.length} completed
          </p>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
             <div 
               className="h-full bg-[#00D4FF] rounded-full transition-all duration-500"
               style={{ width: `${Math.max(5, (localCompletedModules.length / courses.length) * 100)}%` }}
             />
          </div>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto">
          {courses.map((course, idx) => {
            const isActive = activeCourseIndex === idx;
            const isCompleted = localCompletedModules.includes(course._id);
            
            return (
              <button
                key={course._id || idx}
                onClick={() => setActiveCourseIndex(idx)}
                className={`w-full text-left p-4 flex gap-4 items-start transition-colors border-b border-white/5 relative ${
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00D4FF]" />
                )}

                <div className="shrink-0 mt-1">
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-[#00D4FF]" />
                  ) : isActive ? (
                    <PlayCircle className="w-6 h-6 text-white" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center text-xs text-white/50 font-bold">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 pr-2">
                  <h3 className={`font-medium leading-tight mb-1 ${isActive ? "text-white" : "text-white/80"}`}>
                    {course.videoTitle}
                  </h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>Module {idx + 1}</span>
                    <span>•</span>
                    <span>Video</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Main Video Player */}
      <div className="flex-1 bg-[#0A1628] flex flex-col relative order-1 lg:order-2">
        
        {/* Video Container (16:9 aspect ratio) */}
        <div className="relative w-full pb-[56.25%] bg-black">
          {activeCourse ? (
            <iframe
              src={getEmbedUrl(activeCourse.youtubeUrl)}
              title={activeCourse.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No video selected
            </div>
          )}
        </div>

        {/* Video Info below player */}
        <div className="p-6 lg:p-10">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center justify-center px-3 py-1 bg-[#00D4FF]/20 text-[#00D4FF] text-xs font-bold uppercase rounded-md border border-[#00D4FF]/30 tracking-wider">
              Module {activeCourseIndex + 1}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {activeCourse?.videoTitle || "Untitled Module"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
            Welcome to Module {activeCourseIndex + 1}. In this lesson, we will cover the essential concepts required to master the trading strategy. Make sure to take notes and complete the exercises before moving on to the next module.
          </p>
          
          <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
             <button 
               type="button"
               disabled={!activeCourse}
               onClick={() => activeCourse && toggleModuleComplete(activeCourse._id)}
               className={`flex items-center justify-center gap-2 px-6 py-3 rounded-[4px] font-bold transition-colors cursor-pointer z-10 relative ${
                 localCompletedModules.includes(activeCourse?._id) 
                   ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30" 
                   : "bg-[#00D4FF] text-[#0A1628] hover:brightness-110"
               }`}
             >
               <CheckCircle2 className="w-5 h-5" />
               {localCompletedModules.includes(activeCourse?._id) ? "Completed" : "Mark as Complete"}
             </button>
             {activeCourseIndex < courses.length - 1 && (
               <button 
                 onClick={() => setActiveCourseIndex(activeCourseIndex + 1)}
                 className="flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-[4px] font-bold hover:bg-white/20 transition-colors"
               >
                 Next Module
               </button>
             )}
          </div>
        </div>

      </div>

    </div>
  );
}
