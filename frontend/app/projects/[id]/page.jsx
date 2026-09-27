'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiOutlineArrowLeft,
    HiOutlineDocumentText, HiOutlineDeviceMobile, HiOutlineGlobeAlt,
    HiOutlineShoppingCart, HiOutlineFolder, HiOutlineUsers,
    HiOutlineBriefcase, HiOutlineClipboardList, HiOutlineCalendar,
    HiOutlineTag, HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamationCircle,
    HiOutlinePencil, HiOutlineTrash, HiOutlineRefresh, HiOutlineSave,
    HiOutlinePaperClip, HiOutlineCloudUpload, HiOutlineLightningBolt, HiOutlineX
} from "react-icons/hi";

// ── Icon helper ────────────────────────────────────────────────────────────
const getProjectIcon = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes('blog') || n.includes('doc'))
        return <HiOutlineDocumentText className="w-10 h-10 text-violet-500" />;
    if (n.includes('app') || n.includes('mobile'))
        return <HiOutlineDeviceMobile className="w-10 h-10 text-blue-500" />;
    if (n.includes('shop') || n.includes('store') || n.includes('commerce'))
        return <HiOutlineShoppingCart className="w-10 h-10 text-amber-500" />;
    if (n.includes('web') || n.includes('site') || n.includes('platform') || n.includes('online'))
        return <HiOutlineGlobeAlt className="w-10 h-10 text-emerald-500" />;
    if (n.includes('employee') || n.includes('hr') || n.includes('team') || n.includes('staff'))
        return <HiOutlineUsers className="w-10 h-10 text-rose-500" />;
    if (n.includes('portfolio') || n.includes('resume') || n.includes('career'))
        return <HiOutlineBriefcase className="w-10 h-10 text-indigo-500" />;
    if (n.includes('task') || n.includes('management') || n.includes('todo') || n.includes('board'))
        return <HiOutlineClipboardList className="w-10 h-10 text-cyan-500" />;
    return <HiOutlineFolder className="w-10 h-10 text-zinc-400" />;
};

// ── Status config ──────────────────────────────────────────────────────────
const statusConfig = {
    "Completed": { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", border: "border-emerald-500", ring: "ring-emerald-500", bg: "bg-emerald-500", icon: <HiOutlineCheckCircle className="w-5 h-5" /> },
    "In Progress": { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", border: "border-amber-500", ring: "ring-amber-500", bg: "bg-amber-500", icon: <HiOutlineClock className="w-5 h-5" /> },
    "Todo": { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", border: "border-blue-500", ring: "ring-blue-500", bg: "bg-blue-500", icon: <HiOutlineExclamationCircle className="w-5 h-5" /> },
};



// ── Main Page ──────────────────────────────────────────────────────────────
export default function ProjectOverview() {
    const params = useParams();
    const router = useRouter();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState("");
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [aiTasks, setAiTasks] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [completedTasks, setCompletedTasks] = useState({});

    // ── Fetch project from API ────────────────────────────────────
    const fetchProject = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:5000/api/projects/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setProject(data.data);
                setNotes(data.data.notes || "");
                if (data.data.aiTasks) {
                    setAiTasks(data.data.aiTasks);
                    const completed = {};
                    data.data.aiTasks.forEach(t => {
                        if (t.isCompleted) completed[t.id] = true;
                    });
                    setCompletedTasks(completed);
                }
            }
        } catch (err) {
            console.error('Failed to fetch project', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProject();
    }, [params.id]);

    const updateProjectInAPI = async (updates) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:5000/api/projects/${project._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
            const data = await res.json();
            if (data.success) {
                setProject(data.data);
            }
        } catch (err) {
            console.error('Failed to update project', err);
        }
    };

    const cycleStatus = () => {
        if (!project) return;
        const statuses = ["Todo", "In Progress", "Completed"];
        const currentIndex = statuses.indexOf(project.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        updateProjectInAPI({ status: statuses[nextIndex] });
    };

    const handleDelete = async () => {
        if (!project) return;
        if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                await fetch(`http://localhost:5000/api/projects/${project._id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                router.push("/projects");
            } catch (err) {
                console.error('Failed to delete project', err);
            }
        }
    };

    const handleEditName = () => {
        if (!project) return;
        const newName = window.prompt("Enter new project name:", project.name);
        if (newName && newName.trim() !== "") {
            updateProjectInAPI({ name: newName.trim() });
        }
    };

    const saveNotes = () => {
        if (!project) return;
        updateProjectInAPI({ notes });
        setIsEditingNotes(false);
    };

    const generateAiTasks = async () => {
        if (!project) return;
        setAiLoading(true);
        setAiError('');
        setAiTasks([]);
        try {
            const res = await fetch('http://localhost:5000/api/ai/generate-tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectName: project.name })
            });
            const data = await res.json();
            if (data.success) {
                setAiTasks(data.tasks);
                updateProjectInAPI({ aiTasks: data.tasks });
            } else {
                setAiError(data.error || 'Failed to generate tasks');
            }
        } catch (err) {
            setAiError('Cannot connect to backend server. Make sure it is running on port 5000.');
        } finally {
            setAiLoading(false);
        }
    };

    const toggleTask = (taskId) => {
        setCompletedTasks(prev => {
            const newCompleted = { ...prev, [taskId]: !prev[taskId] };
            // Update AI tasks in state and push to API
            const updatedTasks = aiTasks.map(t => 
                t.id === taskId ? { ...t, isCompleted: newCompleted[taskId] } : t
            );
            setAiTasks(updatedTasks);
            updateProjectInAPI({ aiTasks: updatedTasks });
            return newCompleted;
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file || !project) return;

        const newAttachment = {
            id: Date.now().toString(),
            name: file.name,
            size: (file.size / 1024).toFixed(1) + " KB",
            date: new Date().toLocaleDateString()
        };

        const updatedAttachments = [...(project.attachments || []), newAttachment];
        updateProjectInStorage({ ...project, attachments: updatedAttachments });
        e.target.value = ''; // Reset input so same file can be uploaded again if needed
    };

    const removeAttachment = (attId) => {
        if (!project) return;
        const updatedAttachments = (project.attachments || []).filter(a => a.id !== attId);
        updateProjectInStorage({ ...project, attachments: updatedAttachments });
    };

    // ── Loading ────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // ── Not found ──────────────────────────────────────────────────────────
    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
                <HiOutlineFolder className="w-16 h-16 text-zinc-300 dark:text-zinc-700" />
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Project Not Found</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-center">
                    This project may have been deleted or the link is incorrect.
                </p>
                <Link
                    href="/projects"
                    className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-violet-800 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition-all"
                >
                    <HiOutlineArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Link>
            </div>
        );
    }

    const status = statusConfig[project.status] ?? statusConfig["Todo"];

    // Steps logic for progress tracker
    const steps = ["Todo", "In Progress", "Completed"];
    const currentStepIndex = steps.indexOf(project.status);

    return (
        <div className="container mx-auto px-6 py-8 max-w-4xl relative">
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-slide-up { animation: fadeSlideUp 0.45s ease both; }
                .delay-100 { animation-delay: 0.10s; }
                .delay-200 { animation-delay: 0.20s; }
                .delay-300 { animation-delay: 0.30s; }
            `}</style>

            {/* ── Back Button ── */}
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors mb-6 group animate-fade-slide-up"
            >
                <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to All Projects
            </Link>

            {/* ── Hero Header ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800/80 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6 animate-fade-slide-up">
                {/* Status Accent Strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${status.bg}`} />

                <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="p-5 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 flex-shrink-0">
                        {getProjectIcon(project.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight truncate">
                                {project.name}
                            </h1>
                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <button onClick={cycleStatus} className="p-2 text-zinc-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors" title="Change Status">
                                    <HiOutlineRefresh className="w-5 h-5" />
                                </button>
                                <button onClick={handleEditName} className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit Name">
                                    <HiOutlinePencil className="w-5 h-5" />
                                </button>
                                <button onClick={handleDelete} className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete Project">
                                    <HiOutlineTrash className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${status.color} ${status.border} shadow-sm`}>
                                {status.icon}
                                {project.status}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                                <HiOutlineCalendar className="w-4 h-4" />
                                Created {project.createdAt}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Status Progress Stepper ── */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8 mb-6 animate-fade-slide-up delay-100">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-6 uppercase tracking-wider">Project Progress</h3>
                <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                    {/* Connecting lines */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                    <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-500 ${status.bg}`}
                        style={{ width: currentStepIndex === 0 ? '0%' : currentStepIndex === 1 ? '50%' : '100%' }}
                    />

                    {/* Steps */}
                    {steps.map((step, idx) => {
                        const isActive = idx === currentStepIndex;
                        const isPast = idx < currentStepIndex;
                        return (
                            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? `${status.bg} border-transparent text-white ring-4 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 ${status.ring}` :
                                        isPast ? `${status.bg} border-transparent text-white` :
                                            'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-400'
                                    }`}>
                                    {isPast ? <HiOutlineCheckCircle className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                                </div>
                                <span className={`text-xs font-semibold ${isActive || isPast ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`}>
                                    {step}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Detail Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* ── Attachments Card ── */}
                <div className="relative overflow-hidden flex flex-col p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm animate-fade-slide-up delay-200">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                            <HiOutlinePaperClip className="w-5 h-5 text-blue-500" />
                            Attachments
                        </h3>
                        <label className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-medium border border-transparent hover:border-blue-100 dark:hover:border-blue-800">
                            <HiOutlineCloudUpload className="w-4 h-4" /> Upload
                            <input type="file" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[140px] pr-2 space-y-2 mt-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-200 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {project.attachments && project.attachments.length > 0 ? (
                            project.attachments.map(att => (
                                <div key={att.id} className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 group transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-blue-500 rounded-lg shadow-sm">
                                            <HiOutlinePaperClip className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate" title={att.name}>{att.name}</p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{att.size} • {att.date}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => removeAttachment(att.id)} className="p-1.5 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all flex-shrink-0" title="Delete attachment">
                                        <HiOutlineTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">No attachments yet. Upload files related to this project.</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="relative overflow-hidden flex flex-col p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm animate-fade-slide-up delay-300">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-violet-500" />
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                            <HiOutlineDocumentText className="w-5 h-5 text-violet-500" />
                            Notes & Description
                        </h3>
                        {isEditingNotes ? (
                            <button onClick={saveNotes} className="text-violet-600 hover:bg-violet-50 p-1.5 rounded-md transition-colors flex items-center gap-1 text-sm font-medium">
                                <HiOutlineSave className="w-4 h-4" /> Save
                            </button>
                        ) : (
                            <button onClick={() => setIsEditingNotes(true)} className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-md transition-colors">
                                <HiOutlinePencil className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    {isEditingNotes ? (
                        <textarea
                            className="w-full flex-1 min-h-[100px] p-3 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none"
                            placeholder="Add project details, goals, or notes here..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    ) : (
                        <p className={`text-sm flex-1 ${notes ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 italic'}`}>
                            {notes || "No notes added yet. Click the edit icon to add a description."}
                        </p>
                    )}
                </div>
            </div>
            {/* ── AI Task Generator ── */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-6 animate-fade-slide-up delay-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-600 rounded-xl shadow-sm">
                            <HiOutlineLightningBolt className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">AI Task Generator</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Powered by Google Gemini</p>
                        </div>
                    </div>
                    <button
                        onClick={generateAiTasks}
                        disabled={aiLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all active:scale-[0.98] shadow-sm"
                    >
                        {aiLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <HiOutlineLightningBolt className="w-4 h-4" />
                                {aiTasks.length > 0 ? 'Regenerate Tasks' : 'Generate Tasks'}
                            </>
                        )}
                    </button>
                </div>

                <div className="p-6 sm:p-8">
                    {/* Error state */}
                    {aiError && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl mb-4">
                            <HiOutlineX className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-400">{aiError}</p>
                        </div>
                    )}

                    {/* Empty state */}
                    {!aiLoading && aiTasks.length === 0 && !aiError && (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-16 h-16 bg-violet-50 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mb-4">
                                <HiOutlineLightningBolt className="w-8 h-8 text-violet-400" />
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No tasks generated yet</p>
                            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">Click &quot;Generate Tasks&quot; to get an AI-powered task list for this project</p>
                        </div>
                    )}

                    {/* Loading skeleton */}
                    {aiLoading && (
                        <div className="space-y-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 animate-pulse">
                                    <div className="w-5 h-5 bg-zinc-200 dark:bg-zinc-700 rounded-full flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
                                        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
                                    </div>
                                    <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Task list */}
                    {aiTasks.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
                                {aiTasks.filter(t => completedTasks[t.id]).length} / {aiTasks.length} completed
                            </p>
                            {aiTasks.map((task) => {
                                const isDone = completedTasks[task.id];
                                const priorityStyles = {
                                    High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                                    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                                    Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                                };
                                const categoryStyles = {
                                    Planning: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                                    Design: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
                                    Development: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400',
                                    Testing: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
                                    Deployment: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
                                };
                                return (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task.id)}
                                        className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all group ${
                                            isDone
                                                ? 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 opacity-60'
                                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm'
                                        }`}
                                    >
                                        {/* Checkbox */}
                                        <div className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all ${
                                            isDone
                                                ? 'bg-emerald-500 border-emerald-500'
                                                : 'border-zinc-300 dark:border-zinc-600 group-hover:border-violet-400'
                                        }`}>
                                            {isDone && <HiOutlineCheckCircle className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-semibold ${isDone ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                                {task.title}
                                            </p>
                                            <p className={`text-xs mt-1 ${isDone ? 'text-zinc-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                                {task.description}
                                            </p>
                                        </div>
                                        {/* Badges */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryStyles[task.category] || 'bg-zinc-100 text-zinc-600'}`}>
                                                {task.category}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${priorityStyles[task.priority] || 'bg-zinc-100 text-zinc-600'}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
