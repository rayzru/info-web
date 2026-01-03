"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface UnblockUserDialogProps {
  userId: string;
  userName: string | null;
  onUnblocked?: () => void;
  asMenuItem?: boolean;
}

export function UnblockUserDialog({
  userId,
  userName,
  onUnblocked,
  asMenuItem = false,
}: UnblockUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const utils = api.useUtils();
  const unblockUser = api.admin.users.unblock.useMutation({
    onSuccess: () => {
      toast({
        title: "Блокировка снята",
        description: `${userName ?? "Пользователь"} разблокирован`,
      });
      setOpen(false);
      setReason("");
      utils.admin.users.list.invalidate();
      onUnblocked?.();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!reason.trim()) return;

    unblockUser.mutate({
      userId,
      reason: reason.trim(),
    });
  };

  const dialogContent = (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Снятие блокировки</DialogTitle>
        <DialogDescription>
          Разблокировать {userName ?? "пользователя"}? После снятия блокировки
          пользователь сможет снова войти в систему.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Причина снятия блокировки</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Укажите причину снятия блокировки..."
            rows={3}
          />
          {!reason.trim() && (
            <p className="text-xs text-destructive">
              Укажите причину снятия блокировки
            </p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!reason.trim() || unblockUser.isPending}
        >
          {unblockUser.isPending ? "Снятие..." : "Разблокировать"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  if (asMenuItem) {
    return (
      <>
        <DropdownMenuItem
          className="text-green-600 focus:text-green-600 focus:bg-green-600/10"
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <ShieldCheck className="size-4" />
          Разблокировать
        </DropdownMenuItem>
        <Dialog open={open} onOpenChange={setOpen}>
          {dialogContent}
        </Dialog>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-green-600 hover:text-green-600 hover:bg-green-600/10"
        >
          <ShieldCheck className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
