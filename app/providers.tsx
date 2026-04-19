"use client";

import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { App as AntdApp, ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabase";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <RefineKbarProvider>
        <AntdApp>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#3b82f6",
                borderRadius: 8,
              },
            }}
          >
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider(supabaseClient)}
              liveProvider={liveProvider(supabaseClient)}
              resources={[
                {
                  name: "services",
                  list: "/admin/services",
                  create: "/admin/services/new",
                  edit: "/admin/services/:id",
                  meta: { label: "Services" },
                },
                {
                  name: "articles",
                  list: "/admin/articles",
                  create: "/admin/articles/new",
                  edit: "/admin/articles/:id",
                  meta: { label: "Articles" },
                },
                {
                  name: "clinic_images",
                  list: "/admin/clinic-images",
                  meta: { label: "Clinic Images" },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              <RefineKbar />
              {children}
            </Refine>
          </ConfigProvider>
        </AntdApp>
      </RefineKbarProvider>
    </QueryClientProvider>
  );
}
