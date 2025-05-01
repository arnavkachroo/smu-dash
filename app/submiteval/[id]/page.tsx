'use client';

import SubmitEval from "@/app/components/SubmitEval.js";
import Navbar from "@/app/components/StudentNavbar.js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const EvaluationPage = (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
