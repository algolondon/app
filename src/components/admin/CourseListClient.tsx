"use client";

import { useState } from "react";
import { 
  Plus, Edit2, Trash2, Video, Check, X, GripVertical, 
  ExternalLink, Copy, Play, Eye, EyeOff, Search, ArrowUp, ArrowDown,
  Sparkles, Layers, CheckCircle2, AlertCircle, RefreshCw, Paperclip,
  FileText, Link2, FileCode, FolderPlus
} from "lucide-react";

export interface CourseAttachment {
  title: string;
  url: string;
  type?: string;
}

export interface CourseItem {
  _id: string;
  title: string;
  url: string;
  youtubeUrl?: string;
  courseCategory?: string;
  description?: string;
  attachments?: CourseAttachment[];
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
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = cleanUrl.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

const DEFAULT_CATEGORIES = [
  "Course 1: Trend Algo Strategy",
  "Course 2: London X Breakout",
  "Course 3: ATM Institutional System",
  "Course 4: Risk Management & Psychology"
];

export function CourseListClient({ initialCourses }: Props) {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "hidden">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    url: string;
    courseCategory: string;
    description: string;
    attachments: CourseAttachment[];
    order: number;
    isActive: boolean;
  }>({
    title: "",
    url: "",
    courseCategory: "Course 1: Trend Algo Strategy",
    description: "",
    attachments: [],
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
      courseCategory: categoryFilter !== "all" ? categoryFilter : "Course 1: Trend Algo Strategy",
      description: "",
      attachments: [],
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
      courseCategory: course.courseCategory || "Course 1: Trend Algo Strategy",
      description: course.description || "",
      attachments: course.attachments || [],
      order: course.order || 1,
      isActive: course.isActive !== false
    });
    setIsModalOpen(true);
  };

  // Attachment Management inside Form
  const handleAddAttachment = () => {
    setFormData({
      ...formData,
      attachments: [
        ...formData.attachments,
        { title: "Cheat Sheet PDF", url: "", type: "pdf" }
      ]
    });
  };

  const handleUpdateAttachment = (index: number, field: keyof CourseAttachment, value: string) => {
    const updated = [...formData.attachments];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, attachments: updated });
  };

  const handleRemoveAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index)
    });
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
          courseCategory: updated.courseCategory || formData.courseCategory,
          description: updated.description || formData.description,
          attachments: updated.attachments || formData.attachments,
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
          courseCategory: created.courseCategory || formData.courseCategory,
          description: created.description || formData.description,
          attachments: created.attachments || formData.attachments,
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

    const updatedWithOrder = newCourses.map((c, i) => ({
      ...c,
      order: i + 1
    }));

    setCourses(updatedWithOrder);

    try {
      await fetch("/api/admin/courses/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: updatedWithOrder.map(c => ({ id: c._id, order: c.order }))
        })
      });
      showToast("Order sequence updated");
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

  // Extract unique categories in current list
  const existingCategories = Array.from(
    new Set([
      ...DEFAULT_CATEGORIES,
      ...courses.map(c => c.courseCategory || "Course 1: Trend Algo Strategy")
    ])
  );

  // Filtered List
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.url || course.youtubeUrl || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" ? true :
      filterStatus === "active" ? course.isActive : !course.isActive;

    const currentCat = course.courseCategory || "Course 1: Trend Algo Strategy";
    const matchesCategory = categoryFilter === "all" ? true : currentCat === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalCourses = courses.length;
  const activeCount = courses.filter(c => c.isActive).length;
  const hiddenCount = totalCourses - activeCount;
  const totalAttachments = courses.reduce((acc, c) => acc + (c.attachments?.length || 0), 0);

  const currentFormVideoId = extractYouTubeId(formData.url);

  return (
    <div className="space-y-8 pb-16">
      
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-[#12223A]/80 via-[#0E1A2D]/80 to-[#0A1628]/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D4FF]/10 blur-[100px] rounded-full pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              Course Library &amp; Tracks
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 shadow-[0_0_12px_rgba(0,212,255,0.15)]">
              <Sparkles className="w-3.5 h-3.5" />
              Multi-Course System
            </span>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Manage Course 1, Course 2, and Course 3 tracks, attach downloadable PDF cheat sheets, notes, and reorder video modules.
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10 shrink-0">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2.5 bg-gradient-to-r from-[#00D4FF] to-[#00A3FF] hover:from-[#00E5FF] hover:to-[#00B4FF] text-[#050B14] font-bold px-6 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(0,212,255,0.3)] hover:shadow-[0_0_35px_rgba(0,212,255,0.5)] transition-all duration-200 transform hover:-translate-y-0.5 text-sm md:text-base"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            Add New Module
          </button>
        </div>
      </div>

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <span className="text-xs text-gray-500 font-mono">{existingCategories.length} Tracks</span>
        </div>

        <div className="bg-[#12223A]/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Live &amp; Active</p>
              <p className="text-2xl font-bold text-emerald-400 mt-0.5">{activeCount}</p>
            </div>
          </div>
          <span className="text-xs text-emerald-500/80 font-medium">Published</span>
        </div>

        <div className="bg-[#12223A]/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Paperclip className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Attached Files</p>
              <p className="text-2xl font-bold text-purple-400 mt-0.5">{totalAttachments}</p>
            </div>
          </div>
          <span className="text-xs text-purple-500/80 font-medium">PDFs &amp; Links</span>
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
          <span className="text-xs text-amber-500/80 font-medium">Unpublished</span>
        </div>
      </div>

      {/* ── COURSE TRACK FILTER TABS (Course 1, Course 2, Course 3) ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            categoryFilter === "all"
              ? "bg-[#00D4FF] text-black shadow-lg shadow-[#00D4FF]/20"
              : "bg-[#12223A]/70 text-gray-400 hover:text-white border border-white/5"
          }`}
        >
          All Tracks ({totalCourses})
        </button>

        {existingCategories.map((cat) => {
          const count = courses.filter(c => (c.courseCategory || "Course 1: Trend Algo Strategy") === cat).length;
          const isSelected = categoryFilter === cat;

          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? "bg-[#00D4FF] text-black shadow-lg shadow-[#00D4FF]/20"
                  : "bg-[#12223A]/70 text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── SEARCH & STATUS FILTER ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#12223A]/40 backdrop-blur-md border border-white/5 p-3.5 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by module title or URL..."
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

        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-[#0A1628]/80 border border-white/5 rounded-xl self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "all" 
                ? "bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30 shadow-sm" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            All ({filteredCourses.length})
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "active" 
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Active ({filteredCourses.filter(c => c.isActive).length})
          </button>
          <button
            onClick={() => setFilterStatus("hidden")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "hidden" 
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Hidden ({filteredCourses.filter(c => !c.isActive).length})
          </button>
        </div>
      </div>

      {/* ── COURSES LIST ── */}
      {filteredCourses.length === 0 ? (
        <div className="bg-[#12223A]/40 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-gray-400">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No course modules found</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            {searchQuery 
              ? "No modules match your search in this course track." 
              : "Add your first video module to this course track."}
          </p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-[#00D4FF] text-black rounded-xl text-sm font-bold hover:bg-[#00D4FF]/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Module
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 flex items-center justify-between">
            <span>Sequence List (Drag to Reorder)</span>
            <span>{filteredCourses.length} Modules in View</span>
          </p>

          {filteredCourses.map((course, index) => {
            const videoId = extractYouTubeId(course.url || course.youtubeUrl || "");
            const thumbnailUrl = videoId 
              ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` 
              : null;
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;
            const attachmentsCount = course.attachments?.length || 0;

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
                {/* Left: Drag Handle, Order, Thumbnail & Details */}
                <div className="flex items-center gap-3.5 md:gap-5 flex-1 min-w-0 w-full md:w-auto">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div 
                      className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleShiftOrder(index, "up")}
                        disabled={index === 0}
                        className="text-gray-500 hover:text-[#00D4FF] disabled:opacity-20 p-0.5 rounded"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleShiftOrder(index, "down")}
                        disabled={index === courses.length - 1}
                        className="text-gray-500 hover:text-[#00D4FF] disabled:opacity-20 p-0.5 rounded"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300 font-mono">
                      #{course.order || index + 1}
                    </span>
                  </div>

                  {/* YouTube Thumbnail */}
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

                  {/* Title, Track, and Attachments Badge */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white text-base md:text-lg truncate group-hover:text-[#00D4FF] transition-colors">
                        {course.title}
                      </h4>
                      
                      {/* Course Track Pill */}
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {course.courseCategory || "Course 1"}
                      </span>

                      {/* Attachments Pill */}
                      {attachmentsCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <Paperclip className="w-3 h-3" />
                          {attachmentsCount} {attachmentsCount === 1 ? 'Resource' : 'Resources'}
                        </span>
                      )}

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
                        {course.url || course.youtubeUrl || "No URL"}
                      </span>

                      {(course.url || course.youtubeUrl) && (
                        <button
                          onClick={() => handleCopyLink(course)}
                          className="p-1 text-gray-500 hover:text-white rounded hover:bg-white/5"
                          title="Copy Link"
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
                          className="p-1 text-gray-500 hover:text-[#00D4FF] rounded hover:bg-white/5"
                          title="Open on YouTube"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Active Switch & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/5 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      {course.isActive ? "Visible" : "Hidden"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(course)}
                      className={`
                        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                        transition-colors duration-200 ease-in-out
                        ${course.isActive ? "bg-emerald-500" : "bg-gray-700"}
                      `}
                    >
                      <span
                        className={`
                          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg 
                          transition duration-200
                          ${course.isActive ? "translate-x-5" : "translate-x-0"}
                        `}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#0A1628]/80 border border-white/5 p-1 rounded-xl">
                    {videoId && (
                      <button
                        onClick={() => setPreviewVideoId(videoId)}
                        className="p-2 text-gray-400 hover:text-[#00D4FF] hover:bg-white/10 rounded-lg transition-colors"
                        title="Watch Video"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => openEditModal(course)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit Module & Attachments"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(course)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Module"
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

      {/* ── ADD / EDIT MODAL WITH ATTACHMENT BUILDER ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12223A] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95">
            
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
                    Assign to course track (Course 1/2/3) and attach downloadable resources.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-5">
              
              {/* Course Track Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderPlus className="w-4 h-4 text-[#00D4FF]" />
                  Course Track / Category *
                </label>
                <select
                  value={formData.courseCategory}
                  onChange={(e) => setFormData({ ...formData, courseCategory: e.target.value })}
                  className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00D4FF]"
                >
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Course 1: Trend Algo Strategy">Course 1: Trend Algo Strategy</option>
                  <option value="Course 2: London X Breakout">Course 2: London X Breakout</option>
                  <option value="Course 3: ATM Institutional System">Course 3: ATM Institutional System</option>
                  <option value="Course 4: Advanced Strategy Masterclass">Course 4: Advanced Strategy Masterclass</option>
                </select>
              </div>

              {/* Title Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Module Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Module 1: Strategy Introduction & Setup"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D4FF] text-sm"
                />
              </div>

              {/* YouTube URL Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  YouTube Video URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D4FF] text-sm font-mono"
                />
              </div>

              {/* Live Preview */}
              {currentFormVideoId && (
                <div className="p-3 bg-[#0A1628] border border-[#00D4FF]/20 rounded-2xl flex items-center gap-3.5 animate-in fade-in">
                  <div className="w-20 h-12 rounded-lg overflow-hidden bg-black shrink-0">
                    <img 
                      src={`https://img.youtube.com/vi/${currentFormVideoId}/mqdefault.jpg`} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="text-xs space-y-0.5 min-w-0">
                    <p className="font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valid YouTube Video
                    </p>
                    <p className="text-gray-400 truncate font-mono text-[11px]">ID: {currentFormVideoId}</p>
                  </div>
                </div>
              )}

              {/* Optional Lesson Notes / Summary */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Lesson Summary &amp; Key Takeaways (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of what members learn in this module..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#0A1628] border border-white/10 rounded-2xl p-3 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              {/* ── ATTACHMENTS & RESOURCES BUILDER ── */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4" /> Downloadable Attachments &amp; PDF Links ({formData.attachments.length})
                  </label>

                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add Resource / PDF
                  </button>
                </div>

                {formData.attachments.length === 0 ? (
                  <p className="text-xs text-gray-500 italic p-3 bg-[#0A1628] rounded-2xl border border-white/5 text-center">
                    No attachments added yet. Click "+ Add Resource" to attach strategy PDFs, templates, or links.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {formData.attachments.map((att, attIdx) => (
                      <div key={attIdx} className="p-3 bg-[#0A1628] border border-white/10 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-purple-300">Resource #{attIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(attIdx)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Remove attachment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Title (e.g. Trend Strategy Cheat Sheet PDF)"
                            value={att.title}
                            onChange={(e) => handleUpdateAttachment(attIdx, "title", e.target.value)}
                            className="bg-[#12223A] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-400"
                          />
                          <input
                            type="text"
                            placeholder="URL (e.g. https://.../cheat-sheet.pdf)"
                            value={att.url}
                            onChange={(e) => handleUpdateAttachment(attIdx, "url", e.target.value)}
                            className="bg-[#12223A] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order & Publish Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Display Sequence</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-2.5 text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Visibility Status</label>
                  <div className="flex items-center justify-between p-2.5 bg-[#0A1628] border border-white/10 rounded-2xl">
                    <span className="text-xs text-gray-300 font-medium">
                      {formData.isActive ? "Visible in Portal" : "Hidden (Draft)"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                      className={`
                        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                        transition-colors duration-200
                        ${formData.isActive ? "bg-emerald-500" : "bg-gray-700"}
                      `}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ${
                        formData.isActive ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-400 hover:text-white rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !formData.title.trim() || !formData.url.trim()}
                  className="flex items-center gap-2 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {isSaving ? "Saving..." : editingCourse ? "Update Module" : "Publish Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VIDEO PLAYER PREVIEW MODAL ── */}
      {previewVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12223A] border border-white/15 rounded-3xl p-4 sm:p-6 max-w-3xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold">
                <Video className="w-5 h-5 text-[#00D4FF]" />
                Video Player Preview
              </div>
              <button
                onClick={() => setPreviewVideoId(null)}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10"
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

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12223A] border border-red-500/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Delete Course Module?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Are you sure you want to delete <span className="text-white font-medium">"{deleteTarget.title}"</span>?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 text-gray-400 hover:text-white rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-red-500/20"
              >
                Yes, Delete Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00D4FF] text-[#050B14] font-bold px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(0,212,255,0.4)] flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 stroke-[3]" />
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
