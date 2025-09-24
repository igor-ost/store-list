"use client"

import { Api } from "@/service/api-clients";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/store/auth-store";

export function UserInfo() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const setSession = authStore((state) => state.setSession)
  useEffect(() => {
    const handleVerify = async () => {
      try {
        const response = await Api.auth.verify();
        if (response.id) {
          setEmail(response.email);
          setSession(response)
        }
      } catch (error) {
        router.push("/");
      }
    };
    handleVerify();
  }, [router]);



    return (
    <>
        <Button variant="ghost" size="sm" className="text-primary-foreground">
            {email}
        </Button>
    </>
    );
}
