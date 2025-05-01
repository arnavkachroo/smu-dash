"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import Link from "next/link";
import "react-calendar/dist/Calendar.css";

const ProfessorDashboard = () => {
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState([]);
  const [dueDates, setDueDates] = useState([]);
  const [date, setDate] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    axios.get("/api/courses").then((res) => setCourses(res.data));
    axios.get("/api/evaluations").then((res) => setDueDates(res.data));
  }, []);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen pt-16">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Welcome, {session.user.name}!</h2>
      </div>


      {/* Main Dashboard */}
      <h1 className="text-4xl font-bold mb-6 text-left">Dashboard</h1>

      <div className="flex gap-6">
        {/* Left Section */}
        <div className="w-2/3 space-y-6">
          {/* Classes */}
          <div className="border p-4">
            <h3 className="text-2xl font-semibold mb-2">Classes</h3>
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <p key={index}>
                  <Link href={`/courses/${course.CourseID}`} className="text-blue-600 underline">
                    {course.CourseName}
                  </Link>
                </p>
              ))
            ) : (
              <p className="text-gray-500">No classes available.</p>
            )}
          </div>

          {/* Due Dates */}
          <div className="border p-4">
            <h3 className="text-2xl font-semibold mb-2">Due Dates</h3>
            {dueDates.length > 0 ? (
              dueDates.map((item) => (
                <p key={item.scheduled_eval_id}>
                    {item.CourseName} - {item.SprintLabel || "Sprint"} -{" "}
                    {item.DueDate ? item.DueDate.split("T")[0] : "No Due Date"}
                </p>
              ))
            ) : (
              <p className="text-gray-500">No due dates available.</p>
            )}
          </div>
        </div>

        {/* Right Section - Calendar */}
        <div className="w-1/3 bg-white p-4 rounded-lg shadow h-fit">
          <h3 className="text-xl font-semibold mb-4">Calendar</h3>
          <Calendar onChange={setDate} value={date} />
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
