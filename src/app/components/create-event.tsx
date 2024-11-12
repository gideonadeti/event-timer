import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { format, isBefore, isAfter, addDays, subDays } from "date-fns";
import { AxiosError } from "axios";
import { Group, Event } from "@prisma/client";
import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { createEvent, updateEvent } from "@/app/query-functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string(),
  type: z.string(),
  date: z.date(),
  groupId: z.string(),
});

export default function CreateEvent({
  open,
  onOpenChange,
  event,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Update Event" : "Create Event"}</DialogTitle>
        </DialogHeader>
        <CreateEventForm event={event} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}

function CreateEventForm({
  event,
  onOpenChange,
}: {
  event?: Event;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: groups } = useQuery<Group[]>({ queryKey: ["groups"] });
  const { user } = useUser();
  const { toast } = useToast();

  const [eventType, setEventType] = useState("countdown");

  const queryClient = useQueryClient();

  const resetValues = {
    title: "",
    description: "",
    type: "countdown",
    date: addDays(new Date(), 1),
    groupId: groups?.find((group) => group.name === "All")?.id || "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      type: "countdown", // I tried using event?.type || "countdown" but it doesn't work
      date: addDays(new Date(), 1), // I tried using event?.date ?  new Date(event?.date) : new Date() but it doesn't work
      groupId:
        event?.groupId ||
        groups?.find((group) => group.name === "All")?.id ||
        "",
    },
  });

  const { mutate, status } = useMutation<string, AxiosError>({
    mutationFn: () => {
      if (event) {
        return updateEvent(
          event.id,
          form.getValues("title"),
          form.getValues("description"),
          form.getValues("type"),
          form.getValues("date"),
          form.getValues("groupId")
        );
      } else {
        return createEvent(
          form.getValues("title"),
          form.getValues("description"),
          form.getValues("type"),
          form.getValues("date"),
          form.getValues("groupId"),
          user!.id
        );
      }
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      form.reset(resetValues);

      toast({ description: message });

      if (event) {
        onOpenChange(false);
      }
    },
    onError: (error) => {
      const description =
        (error?.response?.data as { error: string })?.error ||
        "Something went wrong";

      toast({
        description,
        variant: "destructive",
      });
    },
  });

  function onSubmit() {
    mutate();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="resize-none" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.resetField("date", {
                    defaultValue:
                      value === "countdown"
                        ? addDays(new Date(), 1)
                        : subDays(new Date(), 1),
                  });
                  setEventType(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="countdown">Countdown</SelectItem>
                  <SelectItem value="countUp">Count Up</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="groupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {groups?.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      eventType === "countdown"
                        ? isBefore(date, new Date())
                        : isAfter(date, new Date())
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={status === "pending"}>
          {status === "pending" ? "Submitting" : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
