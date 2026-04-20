"use client";

import { Button, Input, Select, InputNumber, Spin, Popconfirm, message } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";
import { adminFetch } from "@/lib/adminFetch";

interface Facility {
  id: string;
  icon: string;
  color: string;
  title: string;
  description: string;
  display_order: number;
}

const COLOR_OPTIONS = [
  { value: "secondary", label: "Secondary (teal)" },
  { value: "primary", label: "Primary (blue)" },
  { value: "tertiary", label: "Tertiary (purple)" },
  { value: "secondary-alt", label: "Secondary Alt (green)" },
];

const EMPTY: Omit<Facility, "id"> = {
  icon: "medical_services",
  color: "secondary",
  title: "",
  description: "",
  display_order: 0,
};

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Omit<Facility, "id">>(EMPTY);
  const [adding, setAdding] = useState(false);
  const [newData, setNewData] = useState<Omit<Facility, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    const { data } = await supabaseClient.from("facilities").select("*").order("display_order");
    setFacilities(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    if (!newData.title.trim()) { message.error("Title is required"); return; }
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/facilities", {
        method: "POST",
        body: JSON.stringify({ ...newData, display_order: facilities.length }),
      });
      if (!res.ok) throw new Error("Failed to create");
      message.success("Facility added");
      setAdding(false);
      setNewData(EMPTY);
      await fetch();
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (f: Facility) => {
    setEditingId(f.id);
    setEditData({ icon: f.icon, color: f.color, title: f.title, description: f.description, display_order: f.display_order });
  };

  const handleSave = async (id: string) => {
    if (!editData.title.trim()) { message.error("Title is required"); return; }
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/facilities/${id}`, {
        method: "PUT",
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Failed to update");
      message.success("Saved");
      setEditingId(null);
      await fetch();
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await adminFetch(`/api/admin/facilities/${id}`, { method: "DELETE" });
    if (res.ok) { message.success("Deleted"); await fetch(); }
    else message.error("Delete failed");
  };

  if (loading) return <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div>;

  const fieldStyle = { background: "#0a0a0a", borderColor: "#3a3a3a", color: "#ededed" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0, color: "#ededed" }}>Facilities</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setAdding(true); setNewData(EMPTY); }}>
          Add Facility
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {adding && (
          <div style={{ background: "#1a1a1a", border: "1px solid #3a3a3a", borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <h3 style={{ margin: 0, color: "#ededed" }}>New Facility</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input placeholder="Title" value={newData.title} onChange={(e) => setNewData({ ...newData, title: e.target.value })} style={fieldStyle} />
              <Input placeholder="Icon (material symbol)" value={newData.icon} onChange={(e) => setNewData({ ...newData, icon: e.target.value })} style={fieldStyle} />
              <Input.TextArea placeholder="Description" value={newData.description} onChange={(e) => setNewData({ ...newData, description: e.target.value })} style={fieldStyle} rows={2} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Select value={newData.color} onChange={(v) => setNewData({ ...newData, color: v })} options={COLOR_OPTIONS} style={{ width: "100%" }} />
                <InputNumber placeholder="Order" value={newData.display_order} onChange={(v) => setNewData({ ...newData, display_order: v ?? 0 })} style={{ ...fieldStyle, width: "100%" }} min={0} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button type="primary" icon={<CheckOutlined />} loading={saving} onClick={handleAdd}>Save</Button>
              <Button icon={<CloseOutlined />} onClick={() => setAdding(false)} style={fieldStyle}>Cancel</Button>
            </div>
          </div>
        )}

        {facilities.map((f) => (
          <div key={f.id} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: 16 }}>
            {editingId === f.id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} style={fieldStyle} placeholder="Title" />
                  <Input value={editData.icon} onChange={(e) => setEditData({ ...editData, icon: e.target.value })} style={fieldStyle} placeholder="Icon" />
                  <Input.TextArea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} style={fieldStyle} rows={2} placeholder="Description" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Select value={editData.color} onChange={(v) => setEditData({ ...editData, color: v })} options={COLOR_OPTIONS} style={{ width: "100%" }} />
                    <InputNumber value={editData.display_order} onChange={(v) => setEditData({ ...editData, display_order: v ?? 0 })} style={{ ...fieldStyle, width: "100%" }} min={0} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button type="primary" icon={<CheckOutlined />} loading={saving} onClick={() => handleSave(f.id)}>Save</Button>
                  <Button icon={<CloseOutlined />} onClick={() => setEditingId(null)} style={fieldStyle}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: "#888", fontSize: 12, minWidth: 20 }}>#{f.display_order}</span>
                  <span style={{ color: "#ededed", fontFamily: "monospace", fontSize: 13, background: "#2a2a2a", padding: "2px 8px", borderRadius: 4 }}>{f.icon}</span>
                  <div>
                    <p style={{ margin: 0, color: "#ededed", fontWeight: 600 }}>{f.title}</p>
                    <p style={{ margin: 0, color: "#888", fontSize: 12 }}>{f.description}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, shrink: 0 }}>
                  <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(f)} style={fieldStyle} />
                  <Popconfirm title="Delete this facility?" onConfirm={() => handleDelete(f.id)} okText="Yes" cancelText="No">
                    <Button danger icon={<DeleteOutlined />} size="small">Delete</Button>
                  </Popconfirm>
                </div>
              </div>
            )}
          </div>
        ))}

        {facilities.length === 0 && !adding && (
          <p style={{ color: "#888" }}>No facilities yet.</p>
        )}
      </div>
    </div>
  );
}
