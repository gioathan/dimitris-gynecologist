"use client";

import { Card, Col, Row, Statistic, Spin } from "antd";
import { AppstoreOutlined, FileTextOutlined, PictureOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ services: 0, articles: 0, clinicImages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [{ count: services }, { count: articles }, { count: clinicImages }] = await Promise.all([
        supabaseClient.from("services").select("*", { count: "exact", head: true }),
        supabaseClient.from("articles").select("*", { count: "exact", head: true }),
        supabaseClient.from("clinic_images").select("*", { count: "exact", head: true }),
      ]);
      setStats({ services: services ?? 0, articles: articles ?? 0, clinicImages: clinicImages ?? 0 });
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div>;

  return (
    <div>
      <h1 style={{ marginBottom: "24px", color: "#ededed" }}>Dashboard</h1>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
            <Statistic title={<span style={{ color: "#888" }}>Services</span>} value={stats.services} prefix={<AppstoreOutlined />} valueStyle={{ color: "#3b82f6" }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
            <Statistic title={<span style={{ color: "#888" }}>Articles</span>} value={stats.articles} prefix={<FileTextOutlined />} valueStyle={{ color: "#10b981" }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
            <Statistic title={<span style={{ color: "#888" }}>Clinic Images</span>} value={stats.clinicImages} prefix={<PictureOutlined />} valueStyle={{ color: "#f59e0b" }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
