"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Event } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateEvent from "../create-event";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export default function RowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [openUpdate, setOpenUpdate] = useState(false);
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
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>

      <CreateEvent
        open={openUpdate}
        onOpenChange={setOpenUpdate}
        event={event}
      />
    </DropdownMenu>
  );
}
