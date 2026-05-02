"use client";

import { Form, Input, Button, Space } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  isEdit?: boolean;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function CategoryForm({ initialValues, onSubmit, isEdit = false }: CategoryFormProps) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input onChange={handleTitleChange} style={inputStyle} />
      </Form.Item>

      <Form.Item label="Slug" name="slug" rules={[{ required: true }]} extra="URL identifier, auto-generated from title">
        <Input style={inputStyle} />
      </Form.Item>

      <Form.Item label="Subtitle" name="subtitle" extra="Optional tagline shown under the category title">
        <Input style={inputStyle} />
      </Form.Item>

      <Form.Item label="Icon" name="icon" extra="Material Symbols icon name, e.g. 'folder', 'article', 'favorite', 'pregnant_woman'">
        <Input style={inputStyle} placeholder="folder" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {isEdit ? "Update Category" : "Create Category"}
          </Button>
          <Button onClick={() => router.push("/admin/article-categories")} size="large">Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
