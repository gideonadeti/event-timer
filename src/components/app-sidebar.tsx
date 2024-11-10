"use client";

import Link from "next/link";
import { FolderClosed, FolderOpen, Plus, MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { Group } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import CreateGroup from "@/app/components/create-group";
import DeleteGroup from "@/app/components/delete-group";
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
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const { groupId } = useParams() as { groupId: string };
  const { data: groups } = useQuery<Group[]>({ queryKey: ["groups"] });
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  const [updateGroupId, setUpdateGroupId] = useState("");
  const [openDeleteGroup, setOpenDeleteGroup] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState("");
  const personalGroups = groups?.filter((group) => group.name !== "All") || [];

  function handleUpdate(name: string, id: string) {
    setUpdateGroupId(id);
    setDefaultValue(name);
    setOpenCreateGroup(true);
  }

  function handleDelete(id: string) {
    setDeleteGroupId(id);
    setOpenDeleteGroup(true);
  }

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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleUpdate(group.name, group.id)}
                      >
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(group.id)}>
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
        <CreateGroup
          open={openCreateGroup}
          onOpenChange={setOpenCreateGroup}
          defaultValue={defaultValue}
          updateGroupId={updateGroupId}
        />
        <DeleteGroup
          open={openDeleteGroup}
          onOpenChange={setOpenDeleteGroup}
          deleteGroupId={deleteGroupId}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
