"use client";

import { Card, message } from "antd";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminFetch";
import ServiceForm from "../_components/ServiceForm";

export default function CreateService() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const res = await adminFetch("/api/admin/services", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create");
    message.success("Service created");
    router.push("/admin/services");
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>New Service</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <ServiceForm onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
