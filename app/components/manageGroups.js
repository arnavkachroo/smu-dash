"use client";

import { useState, useEffect } from "react";

const ManageGroups = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");

    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState("");

    const [groupMembers, setGroupMembers] = useState([]);
    const [studentsInCourse, setStudentsInCourse] = useState([]);

    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [message, setMessage] = useState("");

    // Fetch all courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch("/api/courses/students");
                const data = await res.json();
                console.log("Courses:", data);
                setCourses(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setCourses([]);
            }
        };

        fetchCourses();
    }, []);

    // Fetch groups and students for selected course
    useEffect(() => {
        if (!selectedCourseId) return;

        const fetchGroups = async () => {
            const res = await fetch(`/api/groups?courseId=${selectedCourseId}`);
            const data = await res.json();
            setGroups(Array.isArray(data) ? data : []);
        };

        const fetchStudents = async () => {
            const res = await fetch(`/api/courses/students?courseId=${selectedCourseId}`);
            const data = await res.json();
            setStudentsInCourse(Array.isArray(data) ? data : []);
        };

        fetchGroups();
        fetchStudents();
        setSelectedGroupId("");
        setGroupMembers([]);
    }, [selectedCourseId]);

    // Fetch members in selected group
    useEffect(() => {
        if (!selectedGroupId) return;

        const fetchGroupMembers = async () => {
            const res = await fetch(`/api/groupmembers?groupId=${selectedGroupId}`);
            const data = await res.json();
            setGroupMembers(Array.isArray(data) ? data : []);
        };

        fetchGroupMembers();
    }, [selectedGroupId]);

    const handleAddToGroup = async () => {
        if (!selectedStudentId || !selectedGroupId) {
            setMessage("Please select both a student and a group.");
            return;
        }

        const res = await fetch("/api/groupmembers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                studentId: parseInt(selectedStudentId),
                groupId: parseInt(selectedGroupId),
            }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage("Student added to group!");
            setSelectedStudentId("");
            const refresh = await fetch(`/api/groupmembers?groupId=${selectedGroupId}`);
            const updated = await refresh.json();
            setGroupMembers(Array.isArray(updated) ? updated : []);
        } else {
            setMessage(data.error || "Error assigning student.");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6 justify-center">
            {/* LEFT: Group info */}
            <div className="w-full lg:w-1/2 border p-4 rounded shadow bg-white">
                <div className="flex gap-4 mb-4">
                    <select
                        className="w-1/2 border px-3 py-2 rounded"
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                    >
                        <option value="">Select Course</option>
                        {Array.isArray(courses) &&
                            courses.map((course) => (
                                <option key={course.Course_ID} value={course.Course_ID}>
                                    {course.CourseName}
                                </option>
                            ))}
                    </select>

                    <select
                        className="w-1/2 border px-3 py-2 rounded"
                        value={selectedGroupId}
                        onChange={(e) => setSelectedGroupId(e.target.value)}
                        disabled={!selectedCourseId}
                    >
                        <option value="">Select Group</option>
                        {Array.isArray(groups) &&
                            groups.map((group) => (
                                <option key={group.Group_ID} value={group.Group_ID}>
                                    Group #{group.Group_ID}
                                </option>
                            ))}
                    </select>
                </div>

                <h2 className="text-lg font-semibold mb-2">Students in Group</h2>
                <ul className="border-t pt-2 max-h-64 overflow-auto">
                    {groupMembers.length > 0 ? (
                        groupMembers.map((student) => (
                            <li key={student.UserID} className="py-1 border-b text-sm">
                                {student.FirstName} {student.LastName}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500 text-sm">No students in group.</li>
                    )}
                </ul>
            </div>

            {/* RIGHT: Assign student to group */}
            <div className="w-full lg:w-1/2 border p-6 rounded shadow bg-white">
                <h2 className="text-xl font-semibold mb-4">Assign Student to Group</h2>
                <div className="space-y-4">
                    <select
                        className="w-full border px-3 py-2 rounded"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        disabled={!selectedCourseId}
                    >
                        <option value="">Select Student</option>
                        {Array.isArray(studentsInCourse) &&
                            studentsInCourse.map((student) => (
                                <option key={student.UserID} value={student.UserID}>
                                    {student.FirstName} {student.LastName}
                                </option>
                            ))}
                    </select>

                    <select
                        className="w-full border px-3 py-2 rounded"
                        value={selectedGroupId}
                        onChange={(e) => setSelectedGroupId(e.target.value)}
                        disabled={!selectedCourseId}
                    >
                        <option value="">Select Group</option>
                        {Array.isArray(groups) &&
                            groups.map((group) => (
                                <option key={group.Group_ID} value={group.Group_ID}>
                                    Group #{group.Group_ID}
                                </option>
                            ))}
                    </select>

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleAddToGroup}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => setSelectedStudentId("")}
                            className="bg-gray-300 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>

                    {message && <p className="text-sm text-green-600">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default ManageGroups;
