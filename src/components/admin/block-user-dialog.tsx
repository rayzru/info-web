"use client";

import { useState } from "react";
import { Ban } from "lucide-react";

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
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import {
  BLOCK_CATEGORIES,
  RULES_VIOLATIONS,
  type BlockCategory,
  type RuleViolation,
} from "~/lib/block-reasons";
import { api } from "~/trpc/react";

interface BlockUserDialogProps {
  userId: string;
  userName: string | null;
  onBlocked?: () => void;
  asMenuItem?: boolean;
}

export function BlockUserDialog({
  userId,
  userName,
  onBlocked,
  asMenuItem = false,
}: BlockUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<BlockCategory | "">("");
  const [selectedRules, setSelectedRules] = useState<RuleViolation[]>([]);
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const utils = api.useUtils();
  const blockUser = api.admin.users.block.useMutation({
    onSuccess: () => {
      toast({
        title: "Пользователь заблокирован",
        description: `${userName ?? "Пользователь"} заблокирован`,
      });
      setOpen(false);
      resetForm();
      utils.admin.users.list.invalidate();
      onBlocked?.();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setCategory("");
    setSelectedRules([]);
    setReason("");
  };

  const handleRuleToggle = (rule: RuleViolation) => {
    setSelectedRules((prev) =>
      prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule]
    );
  };

  const handleSubmit = () => {
    if (!category) return;

    blockUser.mutate({
      userId,
      category,
      violatedRules: category === "rules_violation" ? selectedRules : undefined,
      reason: reason.trim() || undefined,
    });
  };

  const isValid =
    category &&
    (category !== "rules_violation" || selectedRules.length > 0) &&
    (category !== "other" || reason.trim().length > 0);

  const dialogContent = (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Блокировка пользователя</DialogTitle>
        <DialogDescription>
          Заблокировать {userName ?? "пользователя"}? После блокировки
          пользователь не сможет войти в систему.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Category selection */}
        <div className="space-y-2">
          <Label>Категория блокировки</Label>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value as BlockCategory);
              if (value !== "rules_violation") {
                setSelectedRules([]);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(BLOCK_CATEGORIES).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {category && (
            <p className="text-xs text-muted-foreground">
              {BLOCK_CATEGORIES[category]?.description}
            </p>
          )}
        </div>

        {/* Rules selection (for rules_violation category) */}
        {category === "rules_violation" && (
          <div className="space-y-2">
            <Label>Нарушенные пункты правил</Label>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
              {Object.entries(RULES_VIOLATIONS).map(([key, value]) => (
                <div key={key} className="flex items-start space-x-2">
                  <Checkbox
                    id={`rule-${key}`}
                    checked={selectedRules.includes(key as RuleViolation)}
                    onCheckedChange={() =>
                      handleRuleToggle(key as RuleViolation)
                    }
                  />
                  <div className="grid gap-0.5 leading-none">
                    <label
                      htmlFor={`rule-${key}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {value.label}: {value.title}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {selectedRules.length === 0 && (
              <p className="text-xs text-destructive">
                Выберите хотя бы один пункт правил
              </p>
            )}
          </div>
        )}

        {/* Reason input */}
        <div className="space-y-2">
          <Label>
            {category === "other"
              ? "Причина блокировки (обязательно)"
              : "Дополнительный комментарий"}
          </Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={
              category === "other"
                ? "Опишите причину блокировки..."
                : "Дополнительная информация (необязательно)..."
            }
            rows={3}
          />
          {category === "other" && !reason.trim() && (
            <p className="text-xs text-destructive">
              Укажите причину блокировки
            </p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>
          Отмена
        </Button>
        <Button
          variant="destructive"
          onClick={handleSubmit}
          disabled={!isValid || blockUser.isPending}
        >
          {blockUser.isPending ? "Блокировка..." : "Заблокировать"}
        </Button>
      </DialogFooter>
    </DialogContent>
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
          <Ban className="size-4" />
          Заблокировать
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
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Ban className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
