"use client";

import { Form, Input, Switch, Button, Space, Upload, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadImage, deleteImage } from "@/lib/uploadImage";
import { adminFetch } from "@/lib/adminFetch";
import Image from "next/image";

interface ArticleFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  isEdit?: boolean;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function ArticleForm({ initialValues, onSubmit, isEdit = false }: ArticleFormProps) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialValues?.image_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    adminFetch("/api/admin/article-categories").then((res) => res.json()).then((data) => {
      setCategories(Array.isArray(data) ? data : []);
    });
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEdit) form.setFieldValue("slug", slugify(e.target.value));
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      if (imageUrl) await deleteImage(imageUrl);
      const url = await uploadImage(file, "articles");
      if (url) { setImageUrl(url); message.success("Image uploaded"); }
      else message.error("Upload failed");
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await onSubmit({ ...values, image_url: imageUrl });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" };

  return (
    <Form form={form} layout="vertical" initialValues={{ is_published: false, ...initialValues }} onFinish={handleSubmit}>
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input onChange={handleTitleChange} style={inputStyle} />
      </Form.Item>

      <Form.Item label="Slug" name="slug" rules={[{ required: true }]} extra="URL identifier, auto-generated from title">
        <Input style={inputStyle} />
      </Form.Item>

      <Form.Item label="Category" name="category_id" rules={[{ required: true, message: "Category required" }]}>
        <Select
          allowClear
          placeholder="Select a category"
          options={categories.map((c) => ({ value: c.id, label: c.title }))}
          style={{ background: "#1a1a1a" }}
        />
      </Form.Item>

      <Form.Item label="Cover Image">
        <Upload listType="picture-card" showUploadList={false} beforeUpload={handleImageUpload} accept="image/*">
          {imageUrl ? (
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image src={imageUrl} alt="Cover" fill style={{ objectFit: "cover" }} />
            </div>
          ) : (
            <div><PlusOutlined /><div style={{ marginTop: 8 }}>{uploading ? "Uploading..." : "Upload"}</div></div>
          )}
        </Upload>
        {imageUrl && (
          <Button danger size="small" style={{ marginTop: 8 }} onClick={async () => { await deleteImage(imageUrl); setImageUrl(null); }}>
            Remove Image
          </Button>
        )}
      </Form.Item>

      <Form.Item label="Excerpt" name="excerpt" extra="Short summary shown in article listings">
        <Input.TextArea rows={3} style={inputStyle} />
      </Form.Item>

      <Form.Item label="Content" name="content" rules={[{ required: true }]} extra="Supports plain text or markdown">
        <Input.TextArea rows={16} style={inputStyle} />
      </Form.Item>

      <Form.Item name="is_published" valuePropName="checked" label="Published">
        <Switch />
      </Form.Item>

      <Form.Item label="SEO Title" name="seo_title">
        <Input style={inputStyle} />
      </Form.Item>

      <Form.Item label="SEO Description" name="seo_description">
        <Input.TextArea rows={2} style={inputStyle} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {isEdit ? "Update Article" : "Create Article"}
          </Button>
          <Button onClick={() => router.push("/admin/articles")} size="large">Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
