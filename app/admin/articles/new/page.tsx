"use client";

import { Card, message } from "antd";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminFetch";
import ArticleForm from "../_components/ArticleForm";

export default function CreateArticle() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const res = await adminFetch("/api/admin/articles", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create");
    message.success("Article created");
    router.push("/admin/articles");
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>New Article</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <ArticleForm onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
