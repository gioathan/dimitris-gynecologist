"use client";

import { Table, Space, Button, Tag, Switch, message } from "antd";
import { useTable } from "@refinedev/antd";
import { useInvalidate } from "@refinedev/core";
import { EditButton, DeleteButton } from "@refinedev/antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import Image from "next/image";

export default function ArticlesList() {
  const router = useRouter();
  const invalidate = useInvalidate();

  const { tableProps } = useTable({
    resource: "articles",
    sorters: { initial: [{ field: "created_at", order: "desc" }] },
  });

  const handleToggle = async (id: string, current: boolean) => {
    const { error } = await supabaseClient.from("articles").update({
      is_published: !current,
      published_at: !current ? new Date().toISOString() : null,
    }).eq("id", id);
    if (error) { message.error("Failed to update"); return; }
    message.success("Updated");
    invalidate({ resource: "articles", invalidates: ["list"] });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0, color: "#ededed" }}>Articles</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/admin/articles/new")}>
          Add Article
        </Button>
      </div>
      <Table {...tableProps} rowKey="id">
        <Table.Column title="Image" dataIndex="image_url" width={90} render={(v) => (
          v ? <Image src={v} alt="" width={70} height={50} style={{ objectFit: "cover", borderRadius: 4 }} /> :
          <div style={{ width: 70, height: 50, background: "#2a2a2a", borderRadius: 4 }} />
        )} />
        <Table.Column title="Title" dataIndex="title" render={(v, r: any) => (
          <div>
            <div style={{ fontWeight: 600, color: "#ededed" }}>{v}</div>
            <div style={{ fontSize: 12, color: "#888" }}>/articles/{r.slug}</div>
          </div>
        )} />
        <Table.Column title="Excerpt" dataIndex="excerpt" render={(v) => (
          <span style={{ color: "#888" }}>{v ? v.slice(0, 70) + (v.length > 70 ? "…" : "") : "—"}</span>
        )} />
        <Table.Column title="Published" dataIndex="is_published" width={110} render={(v, r: any) => (
          <Switch checked={v} onChange={() => handleToggle(r.id, v)} />
        )} />
        <Table.Column title="Actions" width={120} render={(_, r: any) => (
          <Space>
            <EditButton size="small" recordItemId={r.id} />
            <DeleteButton size="small" recordItemId={r.id} />
          </Space>
        )} />
      </Table>
    </div>
  );
}
