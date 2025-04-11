"use client";

import { useState, useEffect } from "react";

const ManageGroups = () => {
    const [classes, setClasses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState("");
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState({ FirstName: "", LastName: "", Email: "" });
    const [message, setMessage] = useState("");

    // Fetch all classes
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await fetch("/api/courses/groupmembers");
                const data = await res.json();
                setClasses(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching classes:", err);
            }
        };
        fetchClasses();
    }, []);

    // Fetch groups for selected class
    useEffect(() => {
        if (!selectedClassId) return;

        const fetchGroups = async () => {
            try {
                const res = await fetch(`/api/courses/groupmembers?courseId=${selectedClassId}`);
                const data = await res.json();
                setGroups(Array.isArray(data) ? data : []);
                setSelectedGroupId("");
                setStudents([]);
            } catch (err) {
                console.error("Error fetching groups:", err);
            }
        };

        fetchGroups();
    }, [selectedClassId]);

    // Fetch students in selected group
    useEffect(() => {
        if (!selectedClassId || !selectedGroupId) return;

        const fetchStudents = async () => {
            try {
                const res = await fetch(
                    `/api/courses/groupmembers?courseId=${selectedClassId}&groupId=${selectedGroupId}`
                );
                const data = await res.json();
                setStudents(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching students:", err);
            }
        };

        fetchStudents();
    }, [selectedGroupId, selectedClassId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fullForm = {
            ...form,
            groupId: selectedGroupId,
        };

        const res = await fetch("/api/courses/groupmembers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fullForm),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("Student added successfully!");
            setForm({ FirstName: "", LastName: "", Email: "" });

            // Immediately add new student to the list
            setStudents((prev) => [
                ...prev,
                {
                    UserID: data.student.UserID,
                    FirstName: data.student.FirstName,
                    LastName: data.student.LastName,
                    Email: data.student.Email,
                },
            ]);
        } else {
            setMessage(data.error || "Failed to add student.");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6 justify-center">
            <div className="w-full lg:w-1/2 border p-4 rounded shadow bg-white">
                <select
                    className="w-full border px-3 py-2 rounded mb-4"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                        <option key={cls.Course_ID} value={cls.Course_ID}>
                            {cls.CourseName}
                        </option>
                    ))}
                </select>

                {groups.length > 0 && (
                    <select
                        className="w-full border px-3 py-2 rounded mb-4"
                        value={selectedGroupId}
                        onChange={(e) => setSelectedGroupId(e.target.value)}
                    >
                        <option value="">Select Group</option>
                        {groups.map((group) => (
                            <option key={group.Group_ID} value={group.Group_ID}>
                                {group.GroupName}
                            </option>
                        ))}
                    </select>
                )}

                <h2 className="text-lg font-semibold mb-2">Students in Group</h2>
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

            <div className="w-full lg:w-1/2 border p-6 rounded shadow bg-white">
                <h2 className="text-xl font-semibold mb-4">Add Student</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Add Student
                    </button>
                    <br></br>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Add File
                    </button>
                    {message && <p className="text-sm text-green-600">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default ManageGroups;
