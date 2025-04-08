"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";


const Classes = () => {
    const [classes, setClasses] = useState([]);
    const { data: session, status } = useSession();
    const router = useRouter();


    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        axios.get("/api/courses").then((res) => setClasses(res.data));
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
            <h1 className="text-3xl font-bold mb-6 text-center">All Classes for {session.user.name}</h1>
            {classes.length > 0 ? (
                classes.map((course, index) => (
                    <p key={index} className="text-blue-600">{course.CourseName}</p>
                ))
            ) : (
                <p className="text-gray-500">No classes available.</p>
            )}
            {/* Key Legend */}


        </div>
    );
};

export default Classes;