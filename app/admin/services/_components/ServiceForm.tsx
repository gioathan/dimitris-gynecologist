"use client";

import { Form, Input, InputNumber, Switch, Button, Space, Upload, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImage, deleteImage } from "@/lib/uploadImage";
import Image from "next/image";

interface ServiceFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  isEdit?: boolean;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function ServiceForm({ initialValues, onSubmit, isEdit = false }: ServiceFormProps) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEdit) form.setFieldValue("slug", slugify(e.target.value));
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" };

  return (
    <Form form={form} layout="vertical" initialValues={{ is_published: true, display_order: 0, sections: [], ...initialValues }} onFinish={handleSubmit}>
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input onChange={handleTitleChange} style={inputStyle} />
      </Form.Item>

      <Form.Item label="Slug" name="slug" rules={[{ required: true }]} extra="URL identifier, auto-generated from title">
        <Input style={inputStyle} />
      </Form.Item>

      <Form.Item label="Excerpt" name="excerpt" extra="Short description shown in listings">
        <Input.TextArea rows={2} style={inputStyle} />
      </Form.Item>

      <Form.Item label="Full Description" name="description">
        <Input.TextArea rows={5} style={inputStyle} />
      </Form.Item>

      <Form.Item label="Icon" name="icon" extra="Lucide icon name, e.g. 'Heart', 'Baby', 'Microscope'">
        <Input style={inputStyle} />
      </Form.Item>

      <Form.Item label="Display Order" name="display_order" extra="Lower numbers appear first">
        <InputNumber min={0} style={{ width: 120, ...inputStyle }} />
      </Form.Item>

      <Form.Item name="is_published" valuePropName="checked" label="Published">
        <Switch defaultChecked />
      </Form.Item>

      <Form.Item label="SEO Title" name="seo_title">
        <Input style={inputStyle} />
      </Form.Item>

      <Form.Item label="SEO Description" name="seo_description">
        <Input.TextArea rows={2} style={inputStyle} />
      </Form.Item>

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ color: "#ededed", marginBottom: 12 }}>Service Sections</h3>
        <Form.List name="sections">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ background: "#0a0a0a", border: "1px solid #3a3a3a", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ color: "#888", fontSize: 12 }}>Section {name + 1}</span>
                    <Button danger icon={<DeleteOutlined />} size="small" onClick={() => remove(name)}>Remove</Button>
                  </div>
                  <Form.Item {...restField} name={[name, "title"]} label="Section Title" rules={[{ required: true, message: "Title required" }]}>
                    <Input style={inputStyle} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "content"]} label="Content">
                    <Input.TextArea rows={4} style={inputStyle} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "display_order"]} label="Order" initialValue={name}>
                    <InputNumber min={0} style={{ width: 100, ...inputStyle }} />
                  </Form.Item>
                </div>
              ))}
              <Button onClick={() => add()} icon={<PlusOutlined />} style={{ background: "#2a2a2a", borderColor: "#3a3a3a", color: "#ededed" }}>
                Add Section
              </Button>
            </>
          )}
        </Form.List>
      </div>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {isEdit ? "Update Service" : "Create Service"}
          </Button>
          <Button onClick={() => router.push("/admin/services")} size="large">Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
