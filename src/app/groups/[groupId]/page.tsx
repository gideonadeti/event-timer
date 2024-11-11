"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Group, Event } from "@prisma/client";

import { readGroups, readEvents } from "@/app/query-functions";
import DataTable from "@/app/components/data-table/data-table";
import { columns } from "@/app/components/data-table/columns";

export default function Page() {
  const { user } = useUser();
  const { toast } = useToast();
  const { error: groupsError, status: groupsStatus } = useQuery<
    Group[],
    AxiosError
  >({
    queryKey: ["groups"],
    queryFn: () => readGroups(user!.id),
  });
  const {
    error: eventsError,
    status: eventsStatus,
    data: events,
  } = useQuery<Event[], AxiosError>({
    queryKey: ["events"],
    queryFn: () => readEvents(user!.id),
  });

  useEffect(() => {
    if (groupsStatus === "error" || eventsStatus === "error") {
      const description =
        (groupsError?.response?.data as { error: string })?.error ||
        (eventsError?.response?.data as { error: string })?.error ||
        "Something went wrong";

      toast({
        description,
        variant: "destructive",
      });
    }
  }, [groupsStatus, eventsStatus, groupsError, eventsError, toast]);

  return (
    <div className="px-2 py-4 md:px-4 lg:px-8">
      {events && <DataTable columns={columns} data={events} />}
    </div>
  );
}
