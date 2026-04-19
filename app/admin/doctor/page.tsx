"use client";

import { Card, Form, Input, Button, Space, Upload, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";
import { adminFetch } from "@/lib/adminFetch";
import { uploadImage, deleteImage } from "@/lib/uploadImage";
import Image from "next/image";

export default function DoctorPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabaseClient.from("doctor").select("*").limit(1).single().then(({ data }) => {
      if (data) {
        form.setFieldsValue(data);
        setPhotoUrl(data.photo_url ?? null);
      }
      setLoading(false);
    });
  }, [form]);

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      if (photoUrl) await deleteImage(photoUrl);
      const url = await uploadImage(file, "doctor");
      if (url) {
        setPhotoUrl(url);
        message.success("Photo uploaded");
      } else {
        message.error("Upload failed");
      }
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/doctor", {
        method: "PUT",
        body: JSON.stringify({ ...values, photo_url: photoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      message.success("Doctor profile saved");
    } catch (e: any) {
      message.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div>;

  const inputStyle = { background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" };

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Doctor Profile</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Photo">
            <Upload listType="picture-card" showUploadList={false} beforeUpload={handlePhotoUpload} accept="image/*">
              {photoUrl ? (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <Image src={photoUrl} alt="Doctor" fill style={{ objectFit: "cover" }} />
                </div>
              ) : (
                <div><PlusOutlined /><div style={{ marginTop: 8 }}>{uploading ? "Uploading..." : "Upload"}</div></div>
              )}
            </Upload>
            {photoUrl && (
              <Button danger size="small" style={{ marginTop: 8 }} onClick={async () => { await deleteImage(photoUrl); setPhotoUrl(null); }}>
                Remove Photo
              </Button>
            )}
          </Form.Item>

          <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
            <Input style={inputStyle} />
          </Form.Item>

          <Form.Item label="Title / Specialty" name="title" rules={[{ required: true }]}>
            <Input placeholder="Μαιευτήρας - Γυναικολόγος" style={inputStyle} />
          </Form.Item>

          <Form.Item label="Bio" name="bio">
            <Input.TextArea rows={8} style={inputStyle} />
          </Form.Item>

          <Form.Item label="Credentials / Education" name="credentials" extra="Degrees, certifications, postgraduate titles">
            <Input.TextArea rows={4} style={inputStyle} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving} size="large">Save Profile</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
