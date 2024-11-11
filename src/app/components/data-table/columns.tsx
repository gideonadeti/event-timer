"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Event } from "@prisma/client";

import ColumnHeader from "./column-header";
import RowActions from "./row-actions";
import DateDisplay from "./date-display";

// Define the columns for the table
export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <ColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => <ColumnHeader column={column} title="Type" />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "date",
    header: ({ column }) => <ColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const date = row.original.date;
      const type = row.original.type;

      return <DateDisplay date={date} type={type} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];

