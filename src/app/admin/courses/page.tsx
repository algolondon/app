"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Video, Check, X } from "lucide-react";

interface Course {
  _id: string;
  title: string;
  url: string;
  order: number;
  isActive: boolean;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [order, setOrder] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId 
        ? `/api/admin/courses/${editingId}`
        : "/api/admin/courses";
      
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          url,
          order: parseInt(order) || 0,
          isActive: true
        })
      });

      if (res.ok) {
        setIsAdding(false);
        setEditingId(null);
        resetForm();
        fetchCourses();
      }
    } catch (error) {
      console.error("Failed to save course:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteConfirmId(null);
        fetchCourses();
      }
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setOrder("");
  };

  const startEdit = (course: Course) => {
    setIsAdding(false);
    setEditingId(course._id);
    setTitle(course.title);
    setUrl(course.url);
    setOrder(course.order.toString());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-white">Course Library</h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            resetForm();
          }}
          className="flex items-center gap-2 bg-[#00D4FF] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#00D4FF]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Course
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-[#12223A] rounded-2xl border border-white/10 p-6 space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-white">
            {editingId ? "Edit Course" : "Add New Course"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Course Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to Smart Money Concepts"
                className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">YouTube URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtu.be/..."
                className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-gray-400">Display Order (Optional)</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="0"
                className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title || !url}
              className="flex items-center gap-2 bg-[#00D4FF] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#00D4FF]/90 transition-colors disabled:opacity-50"
            >
              <Check className="w-5 h-5" />
              Save Course
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00D4FF]"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-[#12223A] rounded-2xl border border-white/10 p-12 text-center shadow-xl">
          <Video className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No courses yet</h3>
          <p className="text-gray-400">Click "Add Course" to start building your library.</p>
        </div>
      ) : (
        <div className="bg-[#12223A] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-4 text-sm font-semibold text-gray-400">Order</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Title</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">URL</th>
                  <th className="p-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-gray-300 font-medium text-sm">
                        {course.order}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-white">{course.title}</div>
                    </td>
                    <td className="p-4">
                      <a href={course.url} target="_blank" rel="noopener noreferrer" className="text-[#00D4FF] hover:underline text-sm truncate max-w-[200px] block">
                        {course.url}
                      </a>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(course)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(course._id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#12223A] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in scale-in duration-200">
            <h3 className="text-xl font-bold text-white mb-2">Delete Course</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this course? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
