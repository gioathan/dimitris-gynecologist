"use client";

import { Card, Form, Input, Button, message, Spin, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";
import { adminFetch } from "@/lib/adminFetch";
import { uploadImage, deleteImage } from "@/lib/uploadImage";
import Image from "next/image";

export default function HomepagePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabaseClient.from("homepage_content").select("*").limit(1).single().then(({ data }) => {
      if (data) {
        form.setFieldsValue(data);
        setHeroImageUrl(data.hero_image_url ?? null);
      }
      setLoading(false);
    });
  }, [form]);

  const handleHeroUpload = async (file: File) => {
    setUploading(true);
    try {
      if (heroImageUrl) await deleteImage(heroImageUrl);
      const url = await uploadImage(file, "homepage");
      if (url) { setHeroImageUrl(url); message.success("Image uploaded"); }
      else message.error("Upload failed");
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/homepage", {
        method: "PUT",
        body: JSON.stringify({ ...values, hero_image_url: heroImageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      message.success("Homepage saved");
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
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Homepage Content</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Hero Image">
            <Upload listType="picture-card" showUploadList={false} beforeUpload={handleHeroUpload} accept="image/*">
              {heroImageUrl ? (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <Image src={heroImageUrl} alt="Hero" fill style={{ objectFit: "cover" }} />
                </div>
              ) : (
                <div><PlusOutlined /><div style={{ marginTop: 8 }}>{uploading ? "Uploading..." : "Upload"}</div></div>
              )}
            </Upload>
            {heroImageUrl && (
              <Button danger size="small" style={{ marginTop: 8 }} onClick={async () => { await deleteImage(heroImageUrl); setHeroImageUrl(null); }}>
                Remove
              </Button>
            )}
          </Form.Item>

          <Form.Item label="Hero Title" name="hero_title" rules={[{ required: true }]}>
            <Input style={inputStyle} />
          </Form.Item>

          <Form.Item label="Hero Subtitle" name="hero_subtitle">
            <Input style={inputStyle} />
          </Form.Item>

          <Form.Item label="Intro Text" name="intro_text" extra="Short paragraph shown below the hero section">
            <Input.TextArea rows={5} style={inputStyle} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving} size="large">Save Homepage</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
