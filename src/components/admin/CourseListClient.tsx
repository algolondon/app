"use client";

import { useState, useTransition } from "react";
import { 
  Plus, Edit2, Trash2, Video, Check, X, GripVertical, 
  ExternalLink, Copy, Play, Eye, EyeOff, Search, ArrowUp, ArrowDown,
  Sparkles, Layers, CheckCircle2, AlertCircle, RefreshCw
} from "lucide-react";
import Image from "next/image";

export interface CourseItem {
  _id: string;
  title: string;
  url: string;
  youtubeUrl?: string;
  order: number;
  isActive: boolean;
  createdAt?: string | null;
}

interface Props {
  initialCourses: CourseItem[];
}

// Helper to extract YouTube Video ID
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();
  
  // Patterns for youtu.be, youtube.com/watch, youtube.com/embed, youtube.com/shorts
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = cleanUrl.match(regExp);

  return (match && match[2].length === 11) ? match[2] : null;
}

export function CourseListClient({ initialCourses }: Props) {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "hidden">("all");
  
  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    order: 0,
    isActive: true
  });
  
  // Video Preview Modal
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);
  
  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<CourseItem | null>(null);
  
  // Toast & Action States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Add Modal
  const openAddModal = () => {
    const nextOrder = courses.length > 0 ? Math.max(...courses.map(c => c.order || 0)) + 1 : 1;
    setEditingCourse(null);
    setFormData({
      title: "",
      url: "",
      order: nextOrder,
      isActive: true
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (course: CourseItem) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      url: course.url || course.youtubeUrl || "",
      order: course.order || 1,
      isActive: course.isActive !== false
    });
    setIsModalOpen(true);
  };

  // Save Course (Create or Update)
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) return;

    setIsSaving(true);
    try {
      if (editingCourse) {
        // Update
        const res = await fetch(`/api/admin/courses/${editingCourse._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        if (!res.ok) throw new Error("Failed to update");
        const updated = await res.json();

        setCourses(prev => prev.map(c => c._id === editingCourse._id ? {
          ...c,
          title: updated.title || formData.title,
          url: updated.url || formData.url,
          youtubeUrl: updated.url || formData.url,
          order: updated.order ?? formData.order,
          isActive: updated.isActive ?? formData.isActive
        } : c).sort((a, b) => (a.order || 0) - (b.order || 0)));

        showToast("Course module updated successfully");
      } else {
        // Create
        const res = await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        if (!res.ok) throw new Error("Failed to create");
        const created = await res.json();

        const newCourse: CourseItem = {
          _id: created._id,
          title: created.title,
          url: created.url,
          youtubeUrl: created.url,
          order: created.order,
          isActive: created.isActive
        };

        setCourses(prev => [...prev, newCourse].sort((a, b) => (a.order || 0) - (b.order || 0)));
        showToast("New course module published");
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Error saving course. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (course: CourseItem) => {
    const nextState = !course.isActive;
    
    // Optimistic UI update
    setCourses(prev => prev.map(c => c._id === course._id ? { ...c, isActive: nextState } : c));

    try {
      const res = await fetch(`/api/admin/courses/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextState })
      });

      if (!res.ok) throw new Error("Status update failed");
      showToast(nextState ? `"${course.title}" is now visible to members` : `"${course.title}" is now hidden`);
    } catch (err) {
      console.error(err);
      // Revert on error
      setCourses(prev => prev.map(c => c._id === course._id ? { ...c, isActive: !nextState } : c));
      showToast("Failed to update status");
    }
  };

  // Delete Course
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget._id;

    try {
      const res = await fetch(`/api/admin/courses/${targetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      setCourses(prev => prev.filter(c => c._id !== targetId));
      showToast("Course deleted successfully");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete course");
    } finally {
      setDeleteTarget(null);
    }
  };

  // Copy Link
  const handleCopyLink = (course: CourseItem) => {
    const targetUrl = course.url || course.youtubeUrl || "";
    if (!targetUrl) return;
    navigator.clipboard.writeText(targetUrl);
    setCopiedId(course._id);
    showToast("Video URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Shift Order Up/Down
  const handleShiftOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= courses.length) return;

    const newCourses = [...courses];
    const temp = newCourses[index];
    newCourses[index] = newCourses[targetIndex];
    newCourses[targetIndex] = temp;

    // Recalculate orders
    const updatedWithOrder = newCourses.map((c, i) => ({
      ...c,
      order: i + 1
    }));

    setCourses(updatedWithOrder);

    // Save to API
    try {
      await fetch("/api/admin/courses/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: updatedWithOrder.map(c => ({ id: c._id, order: c.order }))
        })
      });
      showToast("Order updated");
    } catch (err) {
      console.error("Failed to persist order", err);
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...courses];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, draggedItem);

    const updatedWithOrder = reordered.map((c, i) => ({
      ...c,
      order: i + 1
    }));

    setCourses(updatedWithOrder);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Bulk save
    try {
      await fetch("/api/admin/courses/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: updatedWithOrder.map(c => ({ id: c._id, order: c.order }))
        })
      });
      showToast("Course sequence reordered");
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered List
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.url || course.youtubeUrl || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === "active") return matchesSearch && course.isActive;
    if (filterStatus === "hidden") return matchesSearch && !course.isActive;
    return matchesSearch;
  });

  const totalCourses = courses.length;
  const activeCount = courses.filter(c => c.isActive).length;
  const hiddenCount = totalCourses - activeCount;

  // Live video preview in form
  const currentFormVideoId = extractYouTubeId(formData.url);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header & Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-[#12223A]/80 via-[#0E1A2D]/80 to-[#0A1628]/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D4FF]/10 blur-[100px] rounded-full pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              Course Library
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 shadow-[0_0_12px_rgba(0,212,255,0.15)]">
              <Sparkles className="w-3.5 h-3.5" />
              Member Curriculum
            </span>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Manage, organize, and preview all video training modules accessible to active subscription members.
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10 shrink-0">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2.5 bg-gradient-to-r from-[#00D4FF] to-[#00A3FF] hover:from-[#00E5FF] hover:to-[#00B4FF] text-[#050B14] font-bold px-6 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(0,212,255,0.3)] hover:shadow-[0_0_35px_rgba(0,212,255,0.5)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            Add New Module
          </button>
        </div>
      </div>

      {/* Stats & Filtering Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#12223A]/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Modules</p>
              <p className="text-2xl font-bold text-white mt-0.5">{totalCourses}</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">In Curriculum</span>
        </div>

        <div className="bg-[#12223A]/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Live & Active</p>
              <p className="text-2xl font-bold text-emerald-400 mt-0.5">{activeCount}</p>
            </div>
          </div>
          <span className="text-xs text-emerald-500/80 font-medium">Visible to Users</span>
        </div>

        <div className="bg-[#12223A]/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Draft / Hidden</p>
              <p className="text-2xl font-bold text-amber-400 mt-0.5">{hiddenCount}</p>
            </div>
          </div>
          <span className="text-xs text-amber-500/80 font-medium">Internal Only</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#12223A]/40 backdrop-blur-md border border-white/5 p-3.5 rounded-2xl">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or video URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A1628]/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-[#0A1628]/80 border border-white/5 rounded-xl self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "all" 
                ? "bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30 shadow-sm" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            All ({totalCourses})
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "active" 
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilterStatus("hidden")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "hidden" 
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Hidden ({hiddenCount})
          </button>
        </div>
      </div>

      {/* Courses List Section */}
      {filteredCourses.length === 0 ? (
        <div className="bg-[#12223A]/40 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-gray-400">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No course modules found</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            {searchQuery 
              ? "No modules match your current search query. Try clearing the filter." 
              : "Get started by adding your first educational video module."}
          </p>
          {searchQuery ? (
            <button
              onClick={() => { setSearchQuery(""); setFilterStatus("all"); }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Clear Search
            </button>
          ) : (
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-[#00D4FF] text-black rounded-xl text-sm font-bold hover:bg-[#00D4FF]/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add First Module
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 flex items-center justify-between">
            <span>Module Sequence (Drag to Reorder)</span>
            <span>{filteredCourses.length} Items</span>
          </p>

          {filteredCourses.map((course, index) => {
            const videoId = extractYouTubeId(course.url || course.youtubeUrl || "");
            const thumbnailUrl = videoId 
              ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` 
              : null;
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <div
                key={course._id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
                className={`
                  group bg-[#12223A]/70 hover:bg-[#12223A] backdrop-blur-xl border rounded-2xl p-4 md:p-5 transition-all duration-200
                  flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg relative
                  ${isDragging ? "opacity-40 border-dashed border-[#00D4FF] scale-[0.98]" : "border-white/5 hover:border-white/15"}
                  ${isDragOver ? "border-t-2 border-t-[#00D4FF] bg-[#00D4FF]/5" : ""}
                `}
              >
                {/* Left: Drag Handle, Order, Thumbnail & Title */}
                <div className="flex items-center gap-3.5 md:gap-5 flex-1 min-w-0 w-full md:w-auto">
                  {/* Drag Handle & Order Controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div 
                      className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                      title="Drag to reorder sequence"
                    >
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleShiftOrder(index, "up")}
                        disabled={index === 0}
                        className="text-gray-500 hover:text-[#00D4FF] disabled:opacity-20 disabled:hover:text-gray-500 p-0.5 rounded transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleShiftOrder(index, "down")}
                        disabled={index === courses.length - 1}
                        className="text-gray-500 hover:text-[#00D4FF] disabled:opacity-20 disabled:hover:text-gray-500 p-0.5 rounded transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300 font-mono">
                      #{course.order || index + 1}
                    </span>
                  </div>

                  {/* YouTube Thumbnail Preview */}
                  <div 
                    onClick={() => videoId && setPreviewVideoId(videoId)}
                    className={`
                      relative w-28 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0 group/thumb
                      ${videoId ? "cursor-pointer" : ""}
                    `}
                  >
                    {thumbnailUrl ? (
                      <img 
                        src={thumbnailUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-[#0A1628]">
                        <Video className="w-6 h-6" />
                        <span className="text-[10px] mt-1">No Video</span>
                      </div>
                    )}
                    
                    {videoId && (
                      <div className="absolute inset-0 bg-black/40 group-hover/thumb:bg-black/20 flex items-center justify-center transition-colors">
                        <div className="w-8 h-8 rounded-full bg-[#00D4FF] text-black flex items-center justify-center shadow-lg transform group-hover/thumb:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-black ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title & URL link */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white text-base md:text-lg truncate group-hover:text-[#00D4FF] transition-colors">
                        {course.title}
                      </h4>
                      {course.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Hidden
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="truncate max-w-[200px] sm:max-w-xs font-mono text-gray-400/90">
                        {course.url || course.youtubeUrl || "No URL specified"}
                      </span>

                      {/* Quick copy link */}
                      {(course.url || course.youtubeUrl) && (
                        <button
                          onClick={() => handleCopyLink(course)}
                          className="p-1 text-gray-500 hover:text-white rounded hover:bg-white/5 transition-colors"
                          title="Copy YouTube URL"
                        >
                          {copiedId === course._id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}

                      {(course.url || course.youtubeUrl) && (
                        <a
                          href={course.url || course.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-500 hover:text-[#00D4FF] rounded hover:bg-white/5 transition-colors"
                          title="Open in YouTube"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Toggle Switch & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/5 shrink-0">
                  
                  {/* Status Toggle Switch */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      {course.isActive ? "Visible" : "Hidden"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(course)}
                      className={`
                        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                        transition-colors duration-200 ease-in-out focus:outline-none
                        ${course.isActive ? "bg-emerald-500" : "bg-gray-700"}
                      `}
                      title={course.isActive ? "Click to hide from members" : "Click to publish to members"}
                    >
                      <span
                        className={`
                          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 
                          transition duration-200 ease-in-out
                          ${course.isActive ? "translate-x-5" : "translate-x-0"}
                        `}
                      />
                    </button>
                  </div>

                  {/* Actions Group */}
                  <div className="flex items-center gap-1.5 bg-[#0A1628]/80 border border-white/5 p-1 rounded-xl">
                    {videoId && (
                      <button
                        onClick={() => setPreviewVideoId(videoId)}
                        className="p-2 text-gray-400 hover:text-[#00D4FF] hover:bg-white/10 rounded-lg transition-colors"
                        title="Watch Preview"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => openEditModal(course)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit Course Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(course)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12223A] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF]">
                  {editingCourse ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingCourse ? "Edit Course Module" : "Add New Course Module"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {editingCourse ? "Update the title, video link, or order." : "Publish a new video lesson to the member portal."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCourse} className="space-y-5">
              
              {/* Title Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex justify-between">
                  <span>Module Title *</span>
                  <span className="text-gray-500 font-normal">{formData.title.length} chars</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Module 1: Introduction to Trend Lines"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D4FF] transition-colors text-sm"
                />
              </div>

              {/* YouTube URL Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  YouTube Video Link *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://youtu.be/OjKrub9Hl_Y or https://www.youtube.com/watch?v=..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D4FF] transition-colors text-sm font-mono"
                />
              </div>

              {/* Live Thumbnail & Embed Preview */}
              {currentFormVideoId && (
                <div className="p-3.5 bg-[#0A1628] border border-[#00D4FF]/20 rounded-2xl flex items-center gap-4 animate-in fade-in duration-200">
                  <div className="w-24 h-14 rounded-lg overflow-hidden bg-black shrink-0 relative">
                    <img 
                      src={`https://img.youtube.com/vi/${currentFormVideoId}/mqdefault.jpg`} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="text-xs space-y-1 min-w-0 flex-1">
                    <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Valid YouTube Video Detected
                    </p>
                    <p className="text-gray-400 truncate font-mono">
                      ID: {currentFormVideoId}
                    </p>
                  </div>
                </div>
              )}

              {/* Order and Active Switch Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Display Order Sequence
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] transition-colors text-sm"
                  />
                  <p className="text-[11px] text-gray-500">Determines module display position.</p>
                </div>

                <div className="space-y-2 flex flex-col justify-between">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Publish Status
                  </label>
                  <div className="flex items-center justify-between p-3 bg-[#0A1628] border border-white/10 rounded-2xl">
                    <span className="text-xs text-gray-300 font-medium">
                      {formData.isActive ? "Visible in Portal" : "Hidden (Draft)"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                      className={`
                        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                        transition-colors duration-200 ease-in-out focus:outline-none
                        ${formData.isActive ? "bg-emerald-500" : "bg-gray-700"}
                      `}
                    >
                      <span
                        className={`
                          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg 
                          transition duration-200 ease-in-out
                          ${formData.isActive ? "translate-x-5" : "translate-x-0"}
                        `}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-400 hover:text-white rounded-xl transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !formData.title.trim() || !formData.url.trim()}
                  className="flex items-center gap-2 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all disabled:opacity-50 text-sm"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {editingCourse ? "Update Module" : "Publish Module"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-Page Video Player Modal */}
      {previewVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12223A] border border-white/15 rounded-3xl p-4 sm:p-6 max-w-3xl w-full shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold">
                <Video className="w-5 h-5 text-[#00D4FF]" />
                Video Player Preview
              </div>
              <button
                onClick={() => setPreviewVideoId(null)}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${previewVideoId}?autoplay=1`}
                title="YouTube Course Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12223A] border border-red-500/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Delete Course Module?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Are you sure you want to delete <span className="text-white font-medium">"{deleteTarget.title}"</span>? This will immediately remove it from the members training portal.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 text-gray-400 hover:text-white rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-red-500/20"
              >
                Yes, Delete Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00D4FF] text-[#050B14] font-bold px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(0,212,255,0.4)] flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <Check className="w-4 h-4 stroke-[3]" />
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
