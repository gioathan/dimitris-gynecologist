"use client";

import { Card, message, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import { adminFetch } from "@/lib/adminFetch";
import ArticleForm from "../_components/ArticleForm";
import { useEffect, useState } from "react";

export default function EditArticle() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseClient.from("articles").select("*").eq("id", params.id).single().then(({ data, error }) => {
      if (error) { message.error("Failed to load"); router.push("/admin/articles"); return; }
      setArticle(data);
      setLoading(false);
    });
  }, [params.id, router]);

  const handleSubmit = async (values: any) => {
    const res = await adminFetch(`/api/admin/articles/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update");
    message.success("Article updated");
    router.push("/admin/articles");
  };

  if (loading) return <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div>;

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Edit Article</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <ArticleForm initialValues={article} onSubmit={handleSubmit} isEdit />
      </Card>
    </div>
  );
}
