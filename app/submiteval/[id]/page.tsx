'use client';
import SubmitEval from "@/app/components/SubmitEval.js";
import Navbar from "@/app/components/StudentNavbar.js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { use } from "react";
  
export default  function EvaluationPage({params}: {params: Promise<{ id: string }>}) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = use(params);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") return <p>Loading...</p>;
    if (status === "unauthenticated") return null;

    return (
        <div>
            <Navbar />
            <br />
            <br />
            <br />
            <SubmitEval params={id} />
        </div>
    );
}
