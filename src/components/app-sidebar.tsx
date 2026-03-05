"use client"

import * as React from "react"
import {
  Package,
  LayoutDashboard,
  Receipt,
  Users,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher, type Empresa } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  slug: string
  companyName: string
  empresas: Empresa[]
  userName: string
  userEmail: string
  currentPath: string
}

export function AppSidebar({
  slug,
  companyName,
  empresas,
  userName,
  userEmail,
  currentPath,
  ...props
}: AppSidebarProps) {
  const navMain = [
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
  ]

  const user = {
    name: userName,
    email: userEmail,
    avatar: "",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher empresas={empresas} currentSlug={slug} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} currentPath={currentPath} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
