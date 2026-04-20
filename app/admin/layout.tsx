"use client";

import { supabaseClient } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "antd";
import Providers from "../providers";
import {
  LogoutOutlined,
  DashboardOutlined,
  UserOutlined,
  PictureOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SettingOutlined,
  HomeOutlined,
  BuildOutlined,
} from "@ant-design/icons";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.push("/login");
        else setUser(session.user);
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div suppressHydrationWarning style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0a0a0a" }}>
        <div style={{ color: "#ededed" }}>Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <DashboardOutlined /> },
    { href: "/admin/homepage", label: "Homepage", icon: <HomeOutlined /> },
    { href: "/admin/doctor", label: "Doctor", icon: <UserOutlined /> },
    { href: "/admin/clinic-images", label: "Clinic Images", icon: <PictureOutlined /> },
    { href: "/admin/facilities", label: "Facilities", icon: <BuildOutlined /> },
    { href: "/admin/services", label: "Services", icon: <AppstoreOutlined /> },
    { href: "/admin/articles", label: "Articles", icon: <FileTextOutlined /> },
    { href: "/admin/site-settings", label: "Site Settings", icon: <SettingOutlined /> },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <Providers>
      <div data-admin="true" suppressHydrationWarning style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0a0a0a" }}>
        <header style={{ background: "#1a1a1a", color: "#ededed", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2a2a2a" }}>
          <h2 style={{ margin: 0, color: "#ededed", fontWeight: 600 }}>Dimitris Gynecologist - Admin</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ color: "#888" }}>{user?.email}</span>
            <Button icon={<LogoutOutlined />} onClick={handleLogout} style={{ background: "#2a2a2a", borderColor: "#3a3a3a", color: "#ededed" }}>
              Logout
            </Button>
          </div>
        </header>
        <div style={{ display: "flex", flex: 1 }}>
          <nav style={{ width: "250px", background: "#141414", padding: "24px 16px", borderRight: "1px solid #2a2a2a" }}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", marginBottom: "8px", borderRadius: "8px", textDecoration: "none", color: isActive(item.href) ? "#fff" : "#888", background: isActive(item.href) ? "#2a2a2a" : "transparent", transition: "all 0.2s ease", fontWeight: isActive(item.href) ? 600 : 400, cursor: "pointer" }}
                onMouseEnter={(e) => { if (!isActive(item.href)) { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.color = "#ededed"; } }}
                onMouseLeave={(e) => { if (!isActive(item.href)) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; } }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <main style={{ flex: 1, padding: "24px", background: "#0a0a0a", color: "#ededed", overflowY: "auto" }}>
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
