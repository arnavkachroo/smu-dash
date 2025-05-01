/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import SubmitEval from "@/app/components/SubmitEval.js";
import Navbar from "@/app/components/StudentNavbar.js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const EvaluationPage = (props: any) => {
  const { params } = props as { params: { id: string } };
  const { data: session, status } = useSession();
  const router = useRouter();

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
      <SubmitEval params={params} />
    </div>
  );
};

export default EvaluationPage;
