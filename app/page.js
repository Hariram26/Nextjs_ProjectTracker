'use client';
import Image from "next/image";
import Projects from "./projects/page";
import { useState } from "react";


export default function Home() {

  const [projects, setProjects] = useState([]);        // Array to store project names
  const [inputValue, setInputValue] = useState("");    // Current input field value

  const handleAddProject = () => {
    // Only add a project when the input is not empty.
    if (inputValue.trim() !== "") {
      // Add the trimmed project name to the array.
      setProjects([...projects, inputValue.trim()]);
      // Reset the input field after adding.
      setInputValue("");
    }
  };

  return (
    <div className="container">
      {/* Page header showing greeting and summary text */}
      <h2 className="text-3xl font-bold">Welcome Back, Harish!😎</h2>
      <p className="text-lg mt-4">Here's what is happening with your projects today</p>

      {/* Status summary cards with distinct colors for each project state */}
      <div className="stats mt-6 flex gap-6">
        <div className="stat bg-sky-50 p-4 rounded-md shadow-sm flex-1">
          <h3 className="text-sm font-medium text-sky-700">Total Projects</h3>
          <p className="text-2xl font-bold text-sky-900">{projects.length}</p>
        </div>
        <div className="stat bg-yellow-50 p-4 rounded-md shadow-sm flex-1">
          <h3 className="text-sm font-medium text-yellow-700">In Progress</h3>
          <p className="text-2xl font-bold text-yellow-900">{projects.length > 0 ? projects.length : 0}</p>
        </div>
        <div className="stat bg-emerald-50 p-4 rounded-md shadow-sm flex-1">
          <h3 className="text-sm font-medium text-emerald-700">Completed</h3>
          <p className="text-2xl font-bold text-emerald-900">0</p>
        </div>
        <div className="stat bg-rose-50 p-4 rounded-md shadow-sm flex-1">
          <h3 className="text-sm font-medium text-rose-700">Todo</h3>
          <p className="text-2xl font-bold text-rose-900">0</p>
        </div>
      </div>

      {/* Project input form: type a name and click Add Project */}
      <div className="project-form mt-6 flex flex-col gap-4 max-w-md">
        <label className="form-label text-sm font-medium text-gray-700"> Add New Project </label>
        <input
          className="project-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          type="text"
          placeholder="Enter Project Name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="btn btn-primary bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm"
          onClick={handleAddProject}
        >
          Add Project
        </button>
      </div>

      {projects.length > 0 && (
        <div className="projects-list mt-8 max-w-md">
          {/* Show the list of recently added projects */}
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Recent Projects</h3>
          <ul className="space-y-2">
            {projects.map((project, index) => (
              <li key={index} className="bg-gray-50 px-4 py-3 rounded-md border border-gray-200 shadow-sm">
                {project}
              </li>
            ))}
          </ul>

        </div>
      )}

    </div>
  );
}
