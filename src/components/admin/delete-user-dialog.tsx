"use client";

import { useState } from "react";

import { AlertTriangle, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface DeleteUserDialogProps {
  userId: string;
  userName: string | null;
  asMenuItem?: boolean;
}

export function DeleteUserDialog({ userId, userName, asMenuItem = false }: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const utils = api.useUtils();

  const createDeletionRequest = api.admin.deletionRequests.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Заявка создана",
        description: "Заявка на удаление пользователя создана и ожидает подтверждения",
      });
      setOpen(false);
      void utils.admin.users.list.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    createDeletionRequest.mutate({ userId });
  };

  const dialogContent = (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Удаление пользователя
        </AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="space-y-3">
            <p>
              Вы собираетесь создать заявку на удаление пользователя{" "}
              <span className="text-foreground font-medium">{userName ?? "Без имени"}</span>
            </p>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/50">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Важная информация:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                  <span>
                    Удаление является <strong>мягким</strong> (soft delete) — данные пользователя
                    будут помечены как удалённые, но сохранятся в базе данных
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                  <span>
                    Пользователь потеряет доступ к аккаунту немедленно после подтверждения заявки
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                  <span>При необходимости данные можно восстановить в течение 30 дней</span>
                </li>
              </ul>
            </div>

            <p className="text-muted-foreground text-sm">
              После создания заявка будет ожидать подтверждения от другого администратора.
            </p>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Отмена</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDelete}
          disabled={createDeletionRequest.isPending}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {createDeletionRequest.isPending ? "Создание..." : "Создать заявку"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );

  if (asMenuItem) {
    return (
      <>
        <DropdownMenuItem
          variant="destructive"
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Trash2 className="size-4" />
          Удалить
        </DropdownMenuItem>
        <AlertDialog open={open} onOpenChange={setOpen}>
          {dialogContent}
        </AlertDialog>
      </>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      {dialogContent}
    </AlertDialog>
  );
}
