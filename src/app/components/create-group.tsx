import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGroup, updateGroup } from "@/app/query-functions";
import { useToast } from "@/hooks/use-toast";
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

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export default function CreateGroup({
  open,
  onOpenChange,
  defaultValue,
  updateGroupId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValue: string;
  updateGroupId: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {updateGroupId ? "Update Group" : "Create Group"}
          </DialogTitle>
        </DialogHeader>
        <CreateGroupForm
          defaultValue={defaultValue}
          updateGroupId={updateGroupId}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}

function CreateGroupForm({
  defaultValue,
  updateGroupId,
  onOpenChange,
}: {
  defaultValue: string;
  updateGroupId: string;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: defaultValue || "" },
  });
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { toast } = useToast();
  const { mutate, status } = useMutation<string, AxiosError>({
    mutationFn: () => {
      if (updateGroupId) {
        return updateGroup(updateGroupId, user!.id, form.getValues("name"));
      } else {
        return createGroup(user!.id, form.getValues("name"));
      }
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
      form.reset({ name: "" });

      toast({
        description: message,
      });

      if (updateGroupId) {
        setTimeout(() => {
          onOpenChange(false);
        }, 750);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
