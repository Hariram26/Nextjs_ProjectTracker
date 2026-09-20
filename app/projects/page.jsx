'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiOutlineTrash, HiOutlinePlus, HiOutlineExclamation, HiOutlineDocumentText, HiOutlineDeviceMobile, HiOutlineGlobeAlt, HiOutlineShoppingCart, HiOutlineFolder, HiOutlineUsers, HiOutlineBriefcase, HiOutlineClipboardList, HiOutlineArrowRight } from "react-icons/hi";

const getProjectIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('blog') || lowerName.includes('doc')) return <HiOutlineDocumentText className="w-6 h-6 text-violet-600 dark:text-violet-400" />;
    if (lowerName.includes('app') || lowerName.includes('mobile')) return <HiOutlineDeviceMobile className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    if (lowerName.includes('shop') || lowerName.includes('store') || lowerName.includes('commerce')) return <HiOutlineShoppingCart className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
    if (lowerName.includes('web') || lowerName.includes('site') || lowerName.includes('platform') || lowerName.includes('online')) return <HiOutlineGlobeAlt className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
    if (lowerName.includes('employee') || lowerName.includes('hr') || lowerName.includes('team') || lowerName.includes('staff')) return <HiOutlineUsers className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
    if (lowerName.includes('portfolio') || lowerName.includes('resume') || lowerName.includes('career')) return <HiOutlineBriefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
    if (lowerName.includes('task') || lowerName.includes('management') || lowerName.includes('todo') || lowerName.includes('board')) return <HiOutlineClipboardList className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />;

    return <HiOutlineFolder className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />;
};

export default function Projects() {
    const [projects, setProjects] = useState([]);

    // --- Modal state ---
    // showModal: controls whether the confirm popup is visible
    // confirmId: remembers which project the user wants to delete
    const [showModal, setShowModal] = useState(false);
    const [confirmId, setConfirmId] = useState(null);

    // --- Add Project Modal state ---
    // showAddModal: controls whether the Add Project popup is visible
    // newProjectName: tracks what the user types in the input field
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    // Fetch projects from API
    const fetchProjects = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch('http://localhost:5000/api/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setProjects(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch projects', err);
        }
    };

    // Load projects when the component mounts
    useEffect(() => {
        fetchProjects();
    }, []);

    // Step 1: User clicks trash icon → open the modal and store which project to delete
    const requestDelete = (id) => {
        setConfirmId(id);
        setShowModal(true);
    };

    // Step 2: User clicks "Delete" in the modal → actually delete
    const confirmDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:5000/api/projects/${confirmId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setProjects(projects.filter(project => project._id !== confirmId));
            }
        } catch (err) {
            console.error('Failed to delete project', err);
        }
        setShowModal(false);
        setConfirmId(null);
    };

    // Step 3: User clicks "Cancel" → close modal, do nothing
    const cancelDelete = () => {
        setShowModal(false);
        setConfirmId(null);
    };

    // --- Add Project handlers ---
    // Creates a new project via API, closes modal
    const handleAddProject = async (e) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch('http://localhost:5000/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newProjectName.trim() })
            });
            const data = await res.json();
            if (data.success) {
                setProjects([data.data, ...projects]);
                setNewProjectName("");
                setShowAddModal(false);
            }
        } catch (err) {
            console.error('Failed to create project', err);
        }
    };

    const cancelAdd = () => {
        setNewProjectName("");
        setShowAddModal(false);
    };

    // Find the project name to display in the delete modal
    const projectToDelete = projects.find(p => p._id === confirmId);

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">All Projects</h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-2">Here are all the projects you are tracking.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-violet-800 hover:bg-violet-700 text-white font-medium rounded-xl px-4 py-2 cursor-pointer text-center w-fit transition-all shadow-sm active:scale-[0.98]"
                >
                    <HiOutlinePlus className="w-5 h-5" />
                    New Project
                </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 ? (
                    <div className="col-span-full p-8 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-center text-zinc-500 dark:text-zinc-400 text-lg">
                            No projects found. Go to the Home page to add your first project!
                        </p>
                    </div>
                ) : (
                    projects.map(project => (
                        <div key={project._id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-full transition-all hover:shadow-md">
                            <div>
                                <div className="flex justify-between items-start gap-4 mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
                                            {getProjectIcon(project.name)}
                                        </div>
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{project.name}</h3>
                                    </div>
                                    {/* Trash button now calls requestDelete instead of handleDelete directly */}
                                    <button
                                        onClick={() => requestDelete(project._id)}
                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all -mt-2 -mr-2"
                                        title="Delete Project"
                                    >
                                        <HiOutlineTrash className="w-7 h-6 hover:text-red-700 hover:scale-110 transition-all duration-150 cursor-pointer" />
                                    </button>
                                </div>

                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        project.status === 'In Progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                            project.status === 'Todo' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Created: {project.createdAt}</span>
                                <Link href={`/projects/${project._id}`}>
                                    <button
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 dark:bg-violet-900/20 dark:hover:bg-violet-900/40 text-violet-700 dark:text-violet-400 rounded-lg text-xs font-medium transition-all border border-violet-200 dark:border-violet-800 group cursor-pointer"
                                        title="View Project Overview"
                                    >
                                        Overview
                                        <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ── Confirmation Modal ── */}
            {/* Concept: Conditional rendering — modal only appears when showModal is true */}
            {showModal && (
                // Backdrop: semi-transparent overlay behind the modal
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    {/* Modal box */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-6 w-full max-w-sm mx-4 animate-fadeIn">
                        {/* Warning icon */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
                            <HiOutlineExclamation className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 text-center">
                            Delete Project?
                        </h3>

                        {/* Message — shows the project name */}
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-2">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                &quot;{projectToDelete?.name}&quot;
                            </span>
                            ? This action cannot be undone.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                            {/* Cancel — closes modal, no deletion */}
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-2.5 cursor-pointer rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
                            >
                                Cancel
                            </button>
                            {/* Delete — confirms and deletes */}
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white cursor-pointer text-sm font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <HiOutlineTrash className="w-5 h-5 " />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Add Project Modal ── */}
            {/* Concept: Same modal pattern as delete — controlled by showAddModal state */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-6 w-full max-w-sm mx-4">
                        {/* Plus icon */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 mx-auto mb-4">
                            <HiOutlinePlus className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 text-center">
                            Add New Project
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-1">
                            Enter a name for your new project.
                        </p>

                        {/* Form */}
                        <form onSubmit={handleAddProject} className="mt-4">
                            <input
                                type="text"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                placeholder="Enter project name"
                                autoFocus
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-500 focus:border-transparent transition-all shadow-sm"
                            />

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-5">
                                <button
                                    type="button"
                                    onClick={cancelAdd}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-violet-800 hover:bg-violet-700 text-white text-sm font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <HiOutlinePlus className="w-4 h-4" />
                                    Add Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
