"use client";

import { useState, useEffect } from "react";

const ManageStudents = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState({ UserID: "", FirstName: "", LastName: "", Email: "" });
    const [message, setMessage] = useState("");

    // Fetch list of classes from API
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await fetch("/api/courses/students");
                const data = await res.json();
                console.log("Classes:", data);
                setClasses(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching classes:", err);
                setClasses([]);
            }
        };

        fetchClasses();
    }, []);

    // Fetch students in selected class
    useEffect(() => {
        const fetchStudents = async () => {
            if (!selectedClassId) return;
            const res = await fetch(`/api/courses/students?courseId=${selectedClassId}`);
            const data = await res.json();
            setStudents(Array.isArray(data) ? data : []);
        };

        fetchStudents();
    }, [selectedClassId]);

    // Handle form submission to add student
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/courses/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage("Student added successfully!");
            setForm({ UserID: "", FirstName: "", LastName: "", Email: "" });
        } else {
            setMessage(data.error || "Failed to add student.");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6 justify-center">
            {/* Left: Dropdown + Student List */}
            <div className="w-full lg:w-1/2 border p-4 rounded shadow bg-white">
                <select
                    className="w-full border px-3 py-2 rounded mb-4"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                >
                    <option value="">Select Class</option>
                    {Array.isArray(classes) ? (
                        classes.map((cls) => (
                            <option key={cls.CourseID} value={cls.CourseID}>
                                {cls.CourseName}
                            </option>
                        ))
                    ) : (
                        <option disabled>Error loading classes</option>
                    )}
                </select>

                <h2 className="text-lg font-semibold mb-2">Students in Class</h2>
                <ul className="border-t pt-2 max-h-64 overflow-auto">
                    {students.length > 0 ? (
                        students.map((student) => (
                            <li key={student.UserID} className="py-1 border-b text-sm">
                                {student.FirstName} {student.LastName}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500 text-sm">No students found.</li>
                    )}
                </ul>
            </div>

            {/* Right: Add Student Form */}
            <div className="w-full lg:w-1/2 border p-6 rounded shadow bg-white">
                <h2 className="text-xl font-semibold mb-4">Add Student</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="number"
                        placeholder="User ID"
                        value={form.UserID}
                        onChange={(e) => setForm({ ...form, UserID: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="First Name"
                        value={form.FirstName}
                        onChange={(e) => setForm({ ...form, FirstName: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={form.LastName}
                        onChange={(e) => setForm({ ...form, LastName: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.Email}
                        onChange={(e) => setForm({ ...form, Email: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add Student
                    </button>
                    {message && <p className="text-sm text-green-600">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default ManageStudents;
