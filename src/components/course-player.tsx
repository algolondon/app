"use client";

import { useState, useEffect } from "react";
import { 
  PlayCircle, CheckCircle, CheckCircle2, Paperclip, Download, 
  ExternalLink, FileText, Sparkles, BookOpen, ChevronRight, Layers,
  Play, HelpCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

export interface CourseAttachment {
  title: string;
  url: string;
  type?: string;
}

export interface Course {
  _id: string;
  videoTitle: string;
  youtubeUrl: string;
  courseCategory?: string;
  description?: string;
  attachments?: CourseAttachment[];
}

interface CoursePlayerProps {
  courses: Course[];
  completedModules: string[];
}

export function CoursePlayer({ courses, completedModules }: CoursePlayerProps) {
  const router = useRouter();
  const [activeCourseId, setActiveCourseId] = useState<string>(courses[0]?._id || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [localCompletedModules, setLocalCompletedModules] = useState<string[]>(completedModules || []);

  useEffect(() => {
    if (completedModules) {
      setLocalCompletedModules(completedModules);
    }
  }, [completedModules]);

  // Extract unique categories
  const categories = Array.from(
    new Set(courses.map(c => c.courseCategory || "Course 1: Trend Algo Strategy"))
  );

  // Filter courses by category
  const filteredCourses = courses.filter(course => {
    if (selectedCategory === "all") return true;
    return (course.courseCategory || "Course 1: Trend Algo Strategy") === selectedCategory;
  });

  // Ensure an active course is selected
  const activeCourse = courses.find(c => c._id === activeCourseId) || filteredCourses[0] || courses[0];
  const activeIndexInFiltered = filteredCourses.findIndex(c => c._id === activeCourse?._id);

  const toggleModuleComplete = async (moduleId: string) => {
    if (!moduleId) return;
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
        throw new Error(`API request failed: ${res.status}`);
      }

      const data = await res.json();
      if (data.completedModules) {
        setLocalCompletedModules(data.completedModules.map((id: any) => id.toString()));
      }
      router.refresh();
    } catch (e) {
      console.error("Failed to update progress:", e);
      setLocalCompletedModules(prev => 
        newCompleted ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
      );
    }
  };

  // Helper to safely get embed url
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("/embed/")) return url;
    
    const videoIdMatch = url.match(/(?:v=|\/|youtu\.be\/)([0-9A-Za-z_-]{11}).*/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?rel=0&modestbranding=1`;
    }
    return url;
  };

  const progressPercentage = courses.length > 0
    ? Math.round((localCompletedModules.length / courses.length) * 100)
    : 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)] w-full max-w-[1680px] mx-auto border-t border-[#00D4FF]/10">
      
      {/* ── LEFT COLUMN: Playlist & Track Selector Sidebar ── */}
      <div className="w-full lg:w-[420px] xl:w-[460px] bg-[#050B14] border-r border-[#00D4FF]/10 flex flex-col order-2 lg:order-1 shrink-0">
        
        {/* Sticky Header with Track Switcher */}
        <div className="p-6 border-b border-[#00D4FF]/10 sticky top-0 bg-[#050B14] z-20 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-extrabold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00D4FF]" />
              Masterclass Curriculum
            </h2>
            <span className="text-xs font-bold text-[#00D4FF] bg-[#00D4FF]/10 border border-[#00D4FF]/20 px-2.5 py-0.5 rounded-full">
              {progressPercentage}% Done
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{localCompletedModules.length} of {courses.length} Completed</span>
              <span>{courses.length - localCompletedModules.length} Remaining</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00D4FF] to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(4, progressPercentage)}%` }}
              />
            </div>
          </div>

          {/* Course Track Filter Pills */}
          {categories.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#00D4FF] text-black shadow-md shadow-[#00D4FF]/20"
                    : "bg-[#12223A] text-gray-400 hover:text-white border border-white/5"
                }`}
              >
                All ({courses.length})
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = courses.filter(c => (c.courseCategory || "Course 1: Trend Algo Strategy") === cat).length;
                const shortLabel = cat.split(":")[0] || cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#00D4FF] text-black shadow-md shadow-[#00D4FF]/20"
                        : "bg-[#12223A] text-gray-400 hover:text-white border border-white/5"
                    }`}
                  >
                    <span>{shortLabel}</span>
                    <span className={`text-[10px] px-1.5 rounded-full ${isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filteredCourses.map((course, idx) => {
            const isActive = activeCourse?._id === course._id;
            const isCompleted = localCompletedModules.includes(course._id);
            const attachmentsCount = course.attachments?.length || 0;

            return (
              <button
                key={course._id || idx}
                onClick={() => setActiveCourseId(course._id)}
                className={`w-full text-left p-4 sm:p-5 flex gap-4 items-start transition-all relative ${
                  isActive 
                    ? "bg-gradient-to-r from-[#00D4FF]/15 to-transparent border-l-4 border-l-[#00D4FF]" 
                    : "hover:bg-white/5"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isCompleted ? (
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  ) : isActive ? (
                    <div className="w-7 h-7 rounded-xl bg-[#00D4FF] text-black flex items-center justify-center shadow-[0_0_12px_rgba(0,212,255,0.4)]">
                      <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-400 font-bold font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 pr-2 min-w-0 space-y-1">
                  <h3 className={`font-bold text-sm leading-snug transition-colors line-clamp-2 ${
                    isActive ? "text-[#00D4FF]" : "text-white/90"
                  }`}>
                    {course.videoTitle}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                    <span className="text-[11px] text-gray-500 font-medium">{course.courseCategory?.split(":")[0] || "Module"}</span>
                    {attachmentsCount > 0 && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-purple-400 font-semibold">
                          <Paperclip className="w-3 h-3" /> {attachmentsCount} {attachmentsCount === 1 ? 'Resource' : 'Resources'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT COLUMN: Main Video Player & Lesson Hub ── */}
      <div className="flex-1 bg-[#0A1628] flex flex-col relative order-1 lg:order-2 overflow-y-auto">
        
        {/* Video Container (16:9 aspect ratio) */}
        <div className="relative w-full pb-[56.25%] bg-black shadow-2xl">
          {activeCourse ? (
            <iframe
              src={getEmbedUrl(activeCourse.youtubeUrl)}
              title={activeCourse.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              No video selected
            </div>
          )}
        </div>

        {/* Video Details & Attachments Hub */}
        <div className="p-6 md:p-10 space-y-8 flex-1">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00D4FF]/10 text-[#00D4FF] text-xs font-bold uppercase rounded-xl border border-[#00D4FF]/25 tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {activeCourse?.courseCategory || "Course Masterclass"}
              </span>

              {localCompletedModules.includes(activeCourse?._id) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/25">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              {activeCourse?.videoTitle || "Untitled Module"}
            </h1>

            {/* Description / Summary */}
            <p className="text-gray-300 text-sm sm:text-base max-w-4xl leading-relaxed">
              {activeCourse?.description || (
                "In this lesson, you will master the technical parameters, entry confluence, and execution checklist for this strategy. Take detailed notes and review any attached cheat sheets before live execution."
              )}
            </p>
          </div>

          {/* ── ATTACHMENTS & RESOURCES DOWNLOAD SECTION ── */}
          {activeCourse?.attachments && activeCourse.attachments.length > 0 && (
            <div className="p-6 rounded-3xl bg-[#12223A]/80 border border-purple-500/25 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Lesson Attachments &amp; Resources</h3>
                  <p className="text-xs text-gray-400">Download the cheat sheets and files associated with this module.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {activeCourse.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-[#0A1628] hover:bg-[#0A1628]/80 border border-white/10 hover:border-purple-500/50 flex items-center justify-between gap-3 group transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-sm truncate group-hover:text-purple-300 transition-colors">
                          {att.title}
                        </h4>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-mono">
                          {att.type || 'PDF Document'}
                        </p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-purple-500/20 text-gray-400 group-hover:text-purple-300 flex items-center justify-center shrink-0 transition-colors">
                      <Download className="w-4 h-4" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button 
              type="button"
              disabled={!activeCourse}
              onClick={() => activeCourse && toggleModuleComplete(activeCourse._id)}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all cursor-pointer text-sm shadow-lg ${
                localCompletedModules.includes(activeCourse?._id) 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30" 
                  : "bg-[#00D4FF] hover:bg-[#00B3D6] text-black shadow-[0_0_20px_rgba(0,212,255,0.3)]"
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              {localCompletedModules.includes(activeCourse?._id) ? "Lesson Completed (Click to Undo)" : "Mark Lesson as Complete"}
            </button>

            {activeIndexInFiltered < filteredCourses.length - 1 && (
              <button 
                onClick={() => {
                  const nextCourse = filteredCourses[activeIndexInFiltered + 1];
                  if (nextCourse) setActiveCourseId(nextCourse._id);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white px-6 py-3.5 rounded-2xl font-bold transition-colors text-sm border border-white/10"
              >
                Next Lesson <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
