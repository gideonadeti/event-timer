"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Event } from "@prisma/client";
import { useState } from "react";

import CreateEvent from "../create-event";
import DeleteEvent from "../delete-event";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export default function RowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const event = row.original as Event;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
          Update
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpenDelete(true)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <CreateEvent
        open={openUpdate}
        onOpenChange={setOpenUpdate}
        event={event}
      />

      <DeleteEvent
        open={openDelete}
        onOpenChange={setOpenDelete}
        eventId={event.id}
      />
    </DropdownMenu>
  );
}
