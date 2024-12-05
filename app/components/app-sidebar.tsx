"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/app/components/nav-main"
import { NavProjects } from "@/app/components/nav-projects"
import { NavUser } from "@/app/components/nav-user"
import { TeamSwitcher } from "@/app/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "aloong",
    email: "aloong@gmail.com",
    avatar: "/avatars/lz.jpeg",
  },
  teams: [
    {
      name: "X",
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
      title: "Payments",
      url: "payments",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Payments",
          url: "/payments",
        },
        {
          title: "Blank",
          url: "/",
        },
        {
          title: "Test",
          url: "/payments/test"
        }
      ],
    },
    {
      title: "News",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Hacker News",
          url: "/news",
        },
      ],
    },
    {
      title: "Information",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Widgets",
          url: "/infos",
        },
      ],
    },
    {
      title: "LLM",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Chat",
          url: "/chat",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
