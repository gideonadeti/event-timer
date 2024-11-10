"use client";

import Link from "next/link";
import { FolderClosed, FolderOpen, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { Group } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import CreateGroup from "@/app/components/create-group";
import { ThemeToggler } from "./theme-toggler";
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
  SidebarFooter,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { groupId } = useParams() as { groupId: string };
  const { data: groups } = useQuery<Group[]>({ queryKey: ["groups"] });
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const personalGroups = groups?.filter((group) => group.name !== "All") || [];

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
          <SidebarGroupAction
            title="Add Group"
            onClick={() => setOpenCreateGroup(true)}
          >
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {personalGroups.map((group) => (
                <SidebarMenuItem key={group.id}>
                  <SidebarMenuButton asChild isActive={groupId === group.id}>
                    <Link href={`/groups/${group.id}`}>
                      {groupId === group.id ? <FolderOpen /> : <FolderClosed />}
                      <span>{group.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <ThemeToggler />
        </SidebarGroup>
        <CreateGroup open={openCreateGroup} onOpenChange={setOpenCreateGroup} />
      </SidebarFooter>
    </Sidebar>
  );
}
