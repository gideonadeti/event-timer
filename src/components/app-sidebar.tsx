"use client";

import { FolderClosed, FolderOpen, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { Group } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
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
  SidebarGroupAction,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { groupId } = useParams() as { groupId: string };
  const { data: groups } = useQuery<Group[]>({ queryKey: ["groups"] });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Default Group</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={groupId === "all"}>
                  <Link href="/groups/all">
                    {groupId === "all" ? <FolderOpen /> : <FolderClosed />}
                    <span>All</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Personal Groups</SidebarGroupLabel>
          <SidebarGroupAction title="Add Group">
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {groups
                ?.filter((group) => group.name !== "All")
                .map((group) => (
                  <SidebarMenuItem key={group.id}>
                    <SidebarMenuButton asChild isActive={groupId === group.id}>
                      <Link href={`/groups/${group.id}`}>
                        {groupId === group.id ? (
                          <FolderOpen />
                        ) : (
                          <FolderClosed />
                        )}
                        <span>{group.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
