"use client";

import { Card, message } from "antd";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminFetch";
import CategoryForm from "../_components/CategoryForm";

export default function NewCategoryPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const res = await adminFetch("/api/admin/article-categories", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create");
    message.success("Category created");
    router.push("/admin/article-categories");
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>New Article Category</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <CategoryForm onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
