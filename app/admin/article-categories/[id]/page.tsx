"use client";

import { Card, message, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminFetch";
import CategoryForm from "../_components/CategoryForm";
import { useEffect, useState } from "react";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await adminFetch("/api/admin/article-categories");
      const all = await res.json();
      const data = Array.isArray(all) ? all.find((c: any) => c.id === params.id) : null;
      if (!data) { message.error("Failed to load"); router.push("/admin/article-categories"); return; }
      setInitialValues(data);
      setLoading(false);
    }
    fetchData();
  }, [params.id, router]);

  const handleSubmit = async (values: any) => {
    const res = await adminFetch(`/api/admin/article-categories/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update");
    message.success("Category updated");
    router.push("/admin/article-categories");
  };

  if (loading) return <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div>;

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Edit Article Category</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <CategoryForm initialValues={initialValues} onSubmit={handleSubmit} isEdit />
      </Card>
    </div>
  );
}
