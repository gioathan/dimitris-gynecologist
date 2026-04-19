"use client";

import { Button, Upload, message, Input, InputNumber, Spin, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";
import { adminFetch } from "@/lib/adminFetch";
import { uploadImage } from "@/lib/uploadImage";
import Image from "next/image";

interface ClinicImage { id: string; url: string; alt: string | null; display_order: number; }

export default function ClinicImagesPage() {
  const [images, setImages] = useState<ClinicImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchImages = async () => {
    const { data } = await supabaseClient.from("clinic_images").select("*").order("display_order");
    setImages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file, "clinic");
      if (!url) { message.error("Upload failed"); return false; }
      const res = await adminFetch("/api/admin/clinic-images", {
        method: "POST",
        body: JSON.stringify({ url, display_order: images.length }),
      });
      if (!res.ok) throw new Error("Failed to save");
      message.success("Image added");
      await fetchImages();
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleDelete = async (id: string) => {
    const res = await adminFetch(`/api/admin/clinic-images/${id}`, { method: "DELETE" });
    if (res.ok) { message.success("Image deleted"); await fetchImages(); }
    else message.error("Delete failed");
  };

  const handleUpdateAlt = async (id: string, alt: string, display_order: number) => {
    await adminFetch(`/api/admin/clinic-images/${id}`, {
      method: "PUT",
      body: JSON.stringify({ alt, display_order }),
    });
    await fetchImages();
  };

  if (loading) return <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0, color: "#ededed" }}>Clinic Images</h1>
        <Upload showUploadList={false} beforeUpload={handleUpload} accept="image/*">
          <Button type="primary" icon={<PlusOutlined />} loading={uploading}>Add Image</Button>
        </Upload>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {images.map((img) => (
          <div key={img.id} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ position: "relative", height: 200 }}>
              <Image src={img.url} alt={img.alt ?? ""} fill style={{ objectFit: "cover" }} />
            </div>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <Input
                placeholder="Alt text"
                defaultValue={img.alt ?? ""}
                style={{ background: "#0a0a0a", borderColor: "#3a3a3a", color: "#ededed" }}
                onBlur={(e) => handleUpdateAlt(img.id, e.target.value, img.display_order)}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#888", fontSize: 12 }}>Order:</span>
                <InputNumber
                  min={0}
                  defaultValue={img.display_order}
                  style={{ background: "#0a0a0a", borderColor: "#3a3a3a", color: "#ededed", width: 70 }}
                  onBlur={(e) => handleUpdateAlt(img.id, img.alt ?? "", parseInt(e.target.value) || 0)}
                />
                <Popconfirm title="Delete this image?" onConfirm={() => handleDelete(img.id)} okText="Yes" cancelText="No">
                  <Button danger icon={<DeleteOutlined />} size="small" style={{ marginLeft: "auto" }}>Delete</Button>
                </Popconfirm>
              </div>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && <p style={{ color: "#888" }}>No images yet. Upload your first one.</p>}
    </div>
  );
}
