"use client";

import Link from "next/link";
import { FolderClosed, FolderOpen, Plus, MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { Group, Event } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import CreateGroup from "@/app/components/create-group";
import DeleteGroup from "@/app/components/delete-group";
import CreateEvent from "@/app/components/create-event";
import { ThemeToggler } from "./theme-toggler";
import { Button } from "./ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const { groupId } = useParams() as { groupId: string };
  const { status, data: groups } = useQuery<Group[]>({ queryKey: ["groups"] });
  const { data: events } = useQuery<Event[]>({ queryKey: ["events"] });
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  const [updateGroupId, setUpdateGroupId] = useState("");
  const [openDeleteGroup, setOpenDeleteGroup] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState("");
  const [openCreateEvent, setOpenCreateEvent] = useState(false);

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

  function getNumOfEvents(groupId: string) {
    if (!events) return 0;

    if (groupId === "all") {
      const allGroupId = groups?.find((group) => group.name === "All")?.id;

      return events.filter((event) => event.groupId === allGroupId).length;
    } else {
      return events.filter((event) => event.groupId === groupId).length;
    }
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
                {getNumOfEvents("all") > 0 && (
                  <SidebarMenuBadge>{getNumOfEvents("all")}</SidebarMenuBadge>
                )}
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
              {status === "pending" ? (
                <SidebarMenuItem>
                  <Skeleton className="h-8 w-full rounded-md" />
                </SidebarMenuItem>
              ) : (
                personalGroups.map((group) => (
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

                    {getNumOfEvents(group.id) > 0 && (
                      <SidebarMenuBadge className="me-4">
                        {getNumOfEvents(group.id)}
                      </SidebarMenuBadge>
                    )}

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
                        <DropdownMenuItem
                          onClick={() => handleDelete(group.id)}
                        >
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup className="flex flex-row items-center justify-between space-x-4">
          <ThemeToggler />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setOpenCreateEvent(true)}
          >
            Create Event
          </Button>
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
        <CreateEvent open={openCreateEvent} onOpenChange={setOpenCreateEvent} />
      </SidebarFooter>
    </Sidebar>
  );
}
