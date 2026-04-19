"use client";

import { Table, Space, Button, Tag, Switch, message } from "antd";
import { useTable } from "@refinedev/antd";
import { useInvalidate } from "@refinedev/core";
import { EditButton, DeleteButton } from "@refinedev/antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";

export default function ServicesList() {
  const router = useRouter();
  const invalidate = useInvalidate();

  const { tableProps } = useTable({
    resource: "services",
    sorters: { initial: [{ field: "display_order", order: "asc" }] },
  });

  const handleToggle = async (id: string, current: boolean) => {
    const { error } = await supabaseClient.from("services").update({ is_published: !current }).eq("id", id);
    if (error) { message.error("Failed to update"); return; }
    message.success("Updated");
    invalidate({ resource: "services", invalidates: ["list"] });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0, color: "#ededed" }}>Services</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/admin/services/new")}>
          Add Service
        </Button>
      </div>
      <Table {...tableProps} rowKey="id">
        <Table.Column title="Title" dataIndex="title" render={(v, r: any) => (
          <div>
            <div style={{ fontWeight: 600, color: "#ededed" }}>{v}</div>
            <div style={{ fontSize: 12, color: "#888" }}>/services/{r.slug}</div>
          </div>
        )} />
        <Table.Column title="Excerpt" dataIndex="excerpt" render={(v) => <span style={{ color: "#888" }}>{v ? v.slice(0, 80) + (v.length > 80 ? "…" : "") : "—"}</span>} />
        <Table.Column title="Order" dataIndex="display_order" width={80} render={(v) => <Tag color="blue">{v ?? 0}</Tag>} />
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
