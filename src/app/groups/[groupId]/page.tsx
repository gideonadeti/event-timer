"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Group, Event } from "@prisma/client";

import { readGroups, readEvents } from "@/app/query-functions";

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
  const { error: eventsError, status: eventsStatus } = useQuery<
    Event[],
    AxiosError
  >({
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

  return <div></div>;
}
