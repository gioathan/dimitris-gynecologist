"use client";

import { useEffect, useState } from "react";
import { Button, Table, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminFetch";

export default function ArticleCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const res = await adminFetch("/api/admin/article-categories");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id: string) => {
    const res = await adminFetch(`/api/admin/article-categories/${id}`, { method: "DELETE" });
    if (res.ok) { message.success("Deleted"); fetchCategories(); }
    else message.error("Delete failed");
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Slug", dataIndex: "slug", key: "slug", render: (v: string) => <code style={{ color: "#888" }}>{v}</code> },
    { title: "Subtitle", dataIndex: "subtitle", key: "subtitle", render: (v: string) => v || "—" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <span style={{ display: "flex", gap: 8 }}>
          <Button icon={<EditOutlined />} size="small" onClick={() => router.push(`/admin/article-categories/${record.id}`)}>Edit</Button>
          <Popconfirm title="Delete this category?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
            <Button danger icon={<DeleteOutlined />} size="small">Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ color: "#ededed", margin: 0 }}>Article Categories</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/admin/article-categories/new")}>
          New Category
        </Button>
      </div>
      <Table
        dataSource={categories}
        columns={columns}
        rowKey="id"
        loading={loading}
        style={{ background: "#1a1a1a" }}
      />
    </div>
  );
}
