"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import Image from "next/image";
import Link from "next/link";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [courses, setClasses] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [date, setDate] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    axios.get("/api/courses").then((res) => setClasses(res.data));
    axios.get("/api/evaluations").then((res) => setEvaluations(res.data));
  }, []);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen pt-16">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Welcome, {session.user.name}!</h2>
      </div>
      <div>
        <Image src="/SMU.png" alt="SMU Logo" width={200} height={100} />
      </div>

      <div className="flex mt-6 gap-6">
        <div className="w-2/3 space-y-6 m-1">
          <h2 className="text-3xl font-bold">Dashboard</h2>

          {/* Classes */}
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">Classes</h3>
            {console.log("courses length is " + courses.length + " " + courses)}
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <p key={index} className="text-blue-600">{course.CourseName}</p>
              ))
            ) : (
              <p className="text-gray-500">No classes available.</p>
            )}
          </div>

          {/* Evaluations */}
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">Upcoming Evaluations</h3>
            {evaluations.length > 0 ? (
              evaluations.map((evalItem) => (
                <div key={evalItem.scheduled_eval_id}>
                <Link
                  href={`/submiteval/${evalItem.scheduled_eval_id}`} // Corrected the href
                  className="text-blue-600 underline"
                >
                  
                    {evalItem.CourseName} - {evalItem.DueDate ? evalItem.DueDate.split("T")[0] : "No Due Date"}
                </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming evaluations.</p>
            )}
          </div>

        </div>

        {/* Right Section - Calendar */}
        <div className="w-1/3 bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Calendar</h3>
          <Calendar onChange={setDate} value={date} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;