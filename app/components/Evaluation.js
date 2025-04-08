"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";



const Evaluation = () => {
  const [evaluations, setEvaluations] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    axios.get("/api/evaluations").then((res) => setEvaluations(res.data));
  }, []);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return null;

  return (
    <div className="p-6">
      {/* Logo Image */}
      <div className="flex justify-center mb-4">
        <Image src="/SMU.png" alt="SMU Logo" width={200} height={100} />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">All Upcoming Evaluations for {session.user.name}</h1>
      {evaluations.length > 0 ? (
              evaluations.map((evalItem) => (
                <Link
                  key={evalItem.scheduled_eval_id} // Corrected the key
                  href={`/submiteval/${evalItem.scheduled_eval_id}`} // Corrected the href
                  className="text-blue-600 underline"
                >
                  <p>
                    {evalItem.CourseName} - {evalItem.DueDate ? evalItem.DueDate.split("T")[0] : "No Due Date"}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No upcoming evaluations.</p>
            )}
      {/* Key Legend */}


    </div>
  );
};

export default Evaluation;