"use client";

import { Card, Form, Input, Button, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";
import { adminFetch } from "@/lib/adminFetch";

const SETTING_LABELS: Record<string, string> = {
  address: "Address",
  phone: "Phone",
  phone_mobile: "Mobile Phone",
  email: "Email",
  instagram: "Instagram (username or full URL)",
  hours_mon_fri: "Hours (Mon–Fri)",
  hours_sat_sun: "Hours (Sat–Sun)",
  google_maps_embed: "Google Maps Embed URL",
};

export default function SiteSettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabaseClient.from("site_settings").select("*").then(({ data }) => {
      if (data) {
        const values: Record<string, string> = {};
        data.forEach((row) => { values[row.key] = row.value ?? ""; });
        form.setFieldsValue(values);
      }
      setLoading(false);
    });
  }, [form]);

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/site-settings", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      message.success("Settings saved");
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
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Site Settings</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {Object.entries(SETTING_LABELS).map(([key, label]) => (
            <Form.Item key={key} name={key} label={label}>
              {key === "google_maps_embed" ? (
                <Input.TextArea rows={3} style={inputStyle} placeholder="Paste embed URL or iframe src" />
              ) : (
                <Input style={inputStyle} />
              )}
            </Form.Item>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving} size="large">Save Settings</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
