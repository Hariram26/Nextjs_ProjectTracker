'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineDocumentText, HiOutlineDeviceMobile, HiOutlineGlobeAlt, HiOutlineShoppingCart, HiOutlineFolder, HiOutlineUsers, HiOutlineBriefcase, HiOutlineClipboardList } from "react-icons/hi";

const getProjectIcon = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('blog') || lowerName.includes('doc')) return <HiOutlineDocumentText className="w-5 h-5 text-violet-600 dark:text-violet-400" />;
  if (lowerName.includes('app') || lowerName.includes('mobile')) return <HiOutlineDeviceMobile className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
  if (lowerName.includes('shop') || lowerName.includes('store') || lowerName.includes('commerce')) return <HiOutlineShoppingCart className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
  if (lowerName.includes('web') || lowerName.includes('site') || lowerName.includes('platform') || lowerName.includes('online')) return <HiOutlineGlobeAlt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
  if (lowerName.includes('employee') || lowerName.includes('hr') || lowerName.includes('team') || lowerName.includes('staff')) return <HiOutlineUsers className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
  if (lowerName.includes('portfolio') || lowerName.includes('resume') || lowerName.includes('career')) return <HiOutlineBriefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
  if (lowerName.includes('task') || lowerName.includes('management') || lowerName.includes('todo') || lowerName.includes('board')) return <HiOutlineClipboardList className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;

  return <HiOutlineFolder className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />;
};
export default function Home() {
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Fetch projects from API
  const fetchProjects = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      fetchProjects(token);
    } else {
      router.push('/login');
    }
  }, [router]);

  // Called when the form is submitted — adds a new project via API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: projectName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setProjects([data.data, ...projects]);
        setProjectName("");
      }
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  // Calculate stats for the dashboard
  const totalProjects = projects.length;
  const todoProjects = projects.filter(p => p.status === 'Todo').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Page header showing greeting and summary text */}
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Welcome Back{user ? `, ${user.name}` : ''}!😎</h2>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-2">Here's what is happening with your projects today</p>

      {/* Stats Container */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
        <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-xl border border-violet-100 dark:border-violet-800/50 shadow-sm flex flex-col items-center justify-center transition-all hover:shadow-md">
          <span className="text-2xl font-bold text-violet-700 dark:text-violet-400">{totalProjects}</span>
          <span className="text-sm font-medium text-violet-600 dark:text-violet-300 mt-1">Total</span>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 shadow-sm flex flex-col items-center justify-center transition-all hover:shadow-md">
          <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{todoProjects}</span>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-300 mt-1">To Do</span>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/50 shadow-sm flex flex-col items-center justify-center transition-all hover:shadow-md">
          <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">{inProgressProjects}</span>
          <span className="text-sm font-medium text-amber-600 dark:text-amber-300 mt-1">In Progress</span>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm flex flex-col items-center justify-center transition-all hover:shadow-md">
          <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{completedProjects}</span>
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-300 mt-1">Completed</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl">
        {/* Form Container */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md">
          <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Add New Project</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-500 focus:border-transparent transition-all shadow-sm"
              type="text"
              placeholder="Enter project name"
              value={projectName}
              required
              onChange={(e) => setProjectName(e.target.value)}
            />

            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-violet-800 hover:bg-violet-700 active:scale-[0.98] text-white font-medium rounded-xl transition-all shadow-md shadow-violet-800/10 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 cursor-pointer text-center"
            >
              Add Project
            </button>
          </form>
        </div>
      </div>
      {/* View projects Container */}
      <div className="mt-8">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Recent Projects</h1>
          <a href="/projects" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">View All Projects</a>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.length === 0 ? (
            <div className="col-span-full">
              <p className="text-center text-zinc-500 dark:text-zinc-400">
                No projects yet. Add your first project to get started!
              </p>
            </div>
          ) : (
            projects.slice(0, 4).map(project => (
              <div key={project._id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
                    {getProjectIcon(project.name)}
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{project.name}</h3>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Status: <span className="font-medium">{project.status}</span>
                </p>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
                  Created: {project.createdAt}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}
