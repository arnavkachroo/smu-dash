"use client";

import { useEffect, useState } from "react";

const CreateEvaluations = () => {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({ Course_ID: "", ScheduledDate_Due: "" });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await fetch("/api/courses/createEvaluation");
            const data = await res.json();
            if (Array.isArray(data)) setCourses(data);
        };
        fetchCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/courses/createEvaluation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage("✅ Evaluation created successfully!");
            setForm({ Course_ID: "", ScheduledDate_Due: "" });
        } else {
            setMessage(data.error || "❌ Failed to create evaluation.");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6">
            {/* LEFT SIDE - Professor Courses */}
            <div className="w-full lg:w-1/2 border p-4 bg-white rounded shadow">
                <h2 className="text-xl font-semibold mb-3">Scheduled Evaluations</h2>
                {courses.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                        {courses.map((c) => (
                            <li key={c.Course_ID} className="text-sm text-gray-800">
                                {c.CourseName}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-sm">No courses found.</p>
                )}
            </div>

            {/* RIGHT SIDE - Evaluation Form */}
            <div className="w-full lg:w-1/2 border p-6 bg-white rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Schedule New Evaluation</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select
                        value={form.Course_ID}
                        onChange={(e) => setForm({ ...form, Course_ID: parseInt(e.target.value) })}
                        className="w-full border px-3 py-2 rounded"
                        required
                    >
                        <option value="">Select Course</option>
                        {courses.map((cls) => (
                            <option key={cls.Course_ID} value={cls.Course_ID}>
                                {cls.CourseName}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={form.ScheduledDate_Due}
                        onChange={(e) => setForm({ ...form, ScheduledDate_Due: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />

                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Submit
                    </button>
                    {message && <p className="text-green-600 text-sm">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreateEvaluations;
