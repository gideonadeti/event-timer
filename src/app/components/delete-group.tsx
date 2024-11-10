import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "@/hooks/use-toast";
import { deleteGroup } from "@/app/query-functions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteGroup({
  open,
  onOpenChange,
  deleteGroupId,
}: {
  deleteGroupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, status } = useMutation<string, AxiosError>({
    mutationFn: () => deleteGroup(deleteGroupId),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      toast({
        description: message,
      });

      setTimeout(() => {
        onOpenChange(false);
      }, 750);
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

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => isOpen && onOpenChange(isOpen)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this group?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone, and all events in this group will be
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={status === "pending"}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600"
            disabled={status === "pending"}
            onClick={() => mutate()}
          >
            {status === "pending" ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
