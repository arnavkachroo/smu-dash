"use client";

import { useState, useEffect } from "react";

const ManageCourses = () => {
    const [courseName, setCourseName] = useState("");
    const [message, setMessage] = useState("");
    const [classes, setClasses] = useState([]);
    const [classError, setClassError] = useState("");

    // Fetch courses on mount
    useEffect(() => {
        const fetchClasses = async () => {
            const res = await fetch("/api/courses/professor");
            const data = await res.json();

            if (res.ok) {
                setClasses(data);
            } else {
                setClassError(data?.error || "Failed to load courses.");
            }
        };

        fetchClasses();
    }, []);

    // Submit new course
    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/courses/professor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseName }),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("Course added successfully!");
            setCourseName("");

            // Refresh course list
            const updatedRes = await fetch("/api/courses/professor");
            const updatedData = await updatedRes.json();

            if (updatedRes.ok) {
                setClasses(Array.isArray(updatedData) ? updatedData : []);
            }
        } else {
            setMessage(data.error || "Failed to add course.");
        }
    };

    return (

        <div className="flex flex-col lg:flex-row gap-8 p-6 justify-center">
            {/* Right: List of courses */}
            <div className="w-full lg:w-64 border p-4 rounded shadow bg-white">
                <h2 className="text-lg font-semibold mb-2 text-blue-800">Courses</h2>
                <ul className="space-y-2">
                    {classes.length > 0 ? (
                        classes.map((item, index) => (
                            <li
                                key={index}
                                className="border-b pb-1 cursor-pointer hover:text-blue-600"
                            >
                                {item.CourseName}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">
                            {classError || "No courses found."}
                        </li>
                    )}
                </ul>
            </div>

            {/* Left: Add new course */}
            <div className="flex-1 max-w-md border rounded-lg shadow-md p-6 bg-white">
                <h2 className="text-2xl font-semibold mb-4 text-blue-800">Manage Courses</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Course Name</label>
                        <input
                            type="text"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add Course
                    </button>
                    {message && <p className="text-sm mt-2 text-green-600">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default ManageCourses;
