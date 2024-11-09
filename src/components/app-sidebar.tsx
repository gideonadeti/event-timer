"use client";

import { FolderClosed, FolderOpen } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu groups.
const groups = [
  {
    title: "All",
    url: "/groups/all",
  },
];

export function AppSidebar() {
  const { groupId } = useParams() as { groupId: string };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Default Group</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map((group) => {
                const isActive = groupId === group.title.toLowerCase();
                return (
                  <SidebarMenuItem key={group.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={group.url}>
                        {isActive ? <FolderOpen /> : <FolderClosed />}
                        <span>{group.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
