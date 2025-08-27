"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to posts page
    router.push("/posts");
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="mt-4 text-default-600">Redirecting to posts...</p>
      </div>
    </div>
  );
}
