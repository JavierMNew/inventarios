"use client"

import * as React from "react"
import {
  Package,
  LayoutDashboard,
  Receipt,
  Users,
  Settings2,
  Building2,
  ArrowLeft,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  slug: string
  companyName: string
}

export function AppSidebar({ slug, companyName, ...props }: AppSidebarProps) {
  const data = {
    user: {
      name: "Usuario",
      email: "usuario@ejemplo.com",
      avatar: "",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Inicio",
        url: `/app/${slug}`,
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Inventario",
        url: `/app/${slug}/inventory`,
        icon: Package,
      },
      {
        title: "Gastos",
        url: `/app/${slug}/expenses`,
        icon: Receipt,
      },
      {
        title: "Miembros",
        url: `/app/${slug}/members`,
        icon: Users,
      },
      {
        title: "Configuración",
        url: `/app/${slug}/settings`,
        icon: Settings2,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href={`/app/${slug}`}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{companyName}</span>
                  <span className="truncate text-xs">Empresa</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/dashboard">
                <ArrowLeft />
                <span>Cambiar empresa</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
