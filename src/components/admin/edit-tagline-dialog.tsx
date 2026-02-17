"use client";

import { useEffect, useState } from "react";

import { Loader2, MessageSquareText } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface EditTaglineDialogProps {
  userId: string;
  userName: string | null;
  asMenuItem?: boolean;
}

export function EditTaglineDialog({
  userId,
  userName,
  asMenuItem = false,
}: EditTaglineDialogProps) {
  const [open, setOpen] = useState(false);
  const [tagline, setTagline] = useState("");
  const [setByAdmin, setSetByAdmin] = useState(true);
  const { toast } = useToast();
  const utils = api.useUtils();

  const { data: taglineData, isLoading: isLoadingTagline } = api.admin.users.getTagline.useQuery(
    { userId },
    { enabled: open }
  );

  // Update local state when data loads
  useEffect(() => {
    if (taglineData) {
      setTagline(taglineData.tagline ?? "");
      setSetByAdmin(taglineData.taglineSetByAdmin);
    }
  }, [taglineData]);

  const updateTagline = api.admin.users.updateTagline.useMutation({
    onSuccess: () => {
      toast({
        title: "Подпись обновлена",
        description: `Подпись пользователя ${userName ?? "пользователя"} успешно изменена`,
      });
      setOpen(false);
      void utils.admin.users.list.invalidate();
      void utils.admin.users.getTagline.invalidate({ userId });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTagline.mutate({
      userId,
      tagline: tagline.trim() || null,
      setByAdmin,
    });
  };

  const handleClear = () => {
    updateTagline.mutate({
      userId,
      tagline: null,
      setByAdmin: false,
    });
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Редактирование подписи</DialogTitle>
        <DialogDescription>
          Изменить подпись профиля для пользователя{" "}
          <span className="font-medium">{userName ?? "без имени"}</span>
        </DialogDescription>
      </DialogHeader>

      {isLoadingTagline ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tagline">Подпись профиля</Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Например: Представитель УК, Председатель дома"
              maxLength={100}
            />
            <p className="text-muted-foreground text-xs">
              Отображается рядом с именем пользователя в публикациях и комментариях
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="setByAdmin"
              checked={setByAdmin}
              onCheckedChange={(checked) => setSetByAdmin(checked === true)}
            />
            <Label htmlFor="setByAdmin" className="text-sm font-normal">
              Запретить пользователю изменять подпись
            </Label>
          </div>

          {taglineData?.taglineSetByAdmin && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Текущая подпись установлена администратором и не может быть изменена пользователем
            </p>
          )}

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {taglineData?.tagline && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                disabled={updateTagline.isPending}
                className="sm:mr-auto"
              >
                Сбросить
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={updateTagline.isPending}>
              {updateTagline.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      )}
    </DialogContent>
  );

  if (asMenuItem) {
    return (
      <>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <MessageSquareText className="h-4 w-4" />
          Подпись
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
        <Button variant="ghost" size="icon">
          <MessageSquareText className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
