"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { Group, Event } from "@prisma/client";
import { useParams } from "next/navigation";
import { compareAsc } from "date-fns";

import { readGroups, readEvents } from "@/app/query-functions";
import DataTable from "@/app/components/data-table/data-table";
import { columns } from "@/app/components/data-table/columns";

interface ExtendedGroup extends Group {
  events: Event[];
}

export default function Page() {
  const { user } = useUser();
  const { toast } = useToast();
  const { groupId } = useParams();
  const {
    error: groupsError,
    status: groupsStatus,
    data: groups,
  } = useQuery<ExtendedGroup[], AxiosError>({
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

  const filteredEvents = useMemo(() => {
    if (!events?.length) return [];

    let result;
    
    switch (groupId) {
      case "all": {
        const allGroup = groups?.find((group) => group.name === "All");
        result = allGroup ? allGroup.events : [];
        break;
      }
      default:
        result = events.filter((event) => event.groupId === groupId);
        break;
    }

    return result.sort((a, b) => {
      if (!a.date || !b.date) return 0;

      const dateComparison = compareAsc(a.date, b.date);
      return dateComparison || 0;
    });
  }, [groupId, groups, events]);

  return (
    <div className="px-2 py-4 md:px-4 lg:px-8">
      {events && <DataTable columns={columns} data={filteredEvents} />}
    </div>
  );
}
