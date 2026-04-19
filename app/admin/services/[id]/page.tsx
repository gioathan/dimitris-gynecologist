"use client";

import { Card, message, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import { adminFetch } from "@/lib/adminFetch";
import ServiceForm from "../_components/ServiceForm";
import { useEffect, useState } from "react";

export default function EditService() {
  const params = useParams();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [{ data: service, error }, { data: sections }] = await Promise.all([
        supabaseClient.from("services").select("*").eq("id", params.id).single(),
        supabaseClient.from("service_sections").select("*").eq("service_id", params.id).order("display_order"),
      ]);
      if (error) { message.error("Failed to load"); router.push("/admin/services"); return; }
      setInitialValues({ ...service, sections: sections ?? [] });
      setLoading(false);
    }
    fetchData();
  }, [params.id, router]);

  const handleSubmit = async (values: any) => {
    const res = await adminFetch(`/api/admin/services/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update");
    message.success("Service updated");
    router.push("/admin/services");
  };

  if (loading) return <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div>;

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Edit Service</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <ServiceForm initialValues={initialValues} onSubmit={handleSubmit} isEdit />
      </Card>
    </div>
  );
}
