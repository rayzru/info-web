"use client";

import { type Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading2,
  Heading3,
  Highlighter,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Plus,
  Quote,
  Redo,
  Strikethrough,
  Table,
  Trash2,
  Underline,
  Undo,
  Video,
  Youtube,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { type EditorMode, isFeatureAvailable } from "~/lib/editor";
import { cn } from "~/lib/utils";

interface ToolbarProps {
  editor: Editor | null;
  mode: EditorMode;
  onImageUpload?: () => void;
  onYoutubeEmbed?: () => void;
  onVideoEmbed?: () => void;
  onLinkAdd?: () => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, isActive, disabled, tooltip, children }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={cn("h-8 w-8 p-0", isActive && "bg-muted text-foreground")}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export function Toolbar({
  editor,
  mode,
  onImageUpload,
  onYoutubeEmbed,
  onVideoEmbed,
  onLinkAdd,
}: ToolbarProps) {
  if (!editor) return null;

  const can = (feature: string) => isFeatureAvailable(feature, mode);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="bg-muted/30 flex flex-wrap items-center gap-0.5 border-b px-2 py-1">
        {/* History */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          tooltip="Отменить (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          tooltip="Повторить (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="Жирный (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="Курсив (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          tooltip="Подчёркнутый (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          tooltip="Зачёркнутый"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          tooltip="Код"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        {can("highlight") && (
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
            tooltip="Выделить"
          >
            <Highlighter className="h-4 w-4" />
          </ToolbarButton>
        )}

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Link */}
        <ToolbarButton
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else if (onLinkAdd) {
              onLinkAdd();
            } else {
              const url = window.prompt("URL:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }
          }}
          isActive={editor.isActive("link")}
          tooltip="Ссылка (Ctrl+K)"
        >
          <Link className="h-4 w-4" />
        </ToolbarButton>

        {/* Headings (standard/full mode) */}
        {can("heading") && (
          <>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive("heading", { level: 2 })}
              tooltip="Заголовок 2"
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive("heading", { level: 3 })}
              tooltip="Заголовок 3"
            >
              <Heading3 className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}

        {/* Lists (standard/full mode) */}
        {can("bulletList") && (
          <>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              tooltip="Маркированный список"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              tooltip="Нумерованный список"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}

        {/* Blockquote (standard/full mode) */}
        {can("blockquote") && (
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            tooltip="Цитата"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
        )}

        {/* Text Alignment (standard/full mode) */}
        {can("textAlign") && (
          <>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              tooltip="По левому краю"
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              isActive={editor.isActive({ textAlign: "center" })}
              tooltip="По центру"
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              tooltip="По правому краю"
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}

        {/* Media (standard/full mode) */}
        {can("image") && (
          <>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <ToolbarButton
              onClick={() => {
                if (onImageUpload) {
                  onImageUpload();
                } else {
                  const url = window.prompt("URL изображения:");
                  if (url) {
                    editor.chain().focus().setImage({ src: url }).run();
                  }
                }
              }}
              tooltip="Изображение"
            >
              <Image className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}

        {/* YouTube (full mode) */}
        {can("youtube") && (
          <ToolbarButton
            onClick={() => {
              if (onYoutubeEmbed) {
                onYoutubeEmbed();
              } else {
                const url = window.prompt("YouTube URL:");
                if (url) {
                  editor.chain().focus().setYoutubeVideo({ src: url }).run();
                }
              }
            }}
            tooltip="YouTube видео"
          >
            <Youtube className="h-4 w-4" />
          </ToolbarButton>
        )}

        {/* Video Embed (RuTube, VK, Dzen) - full mode */}
        {can("videoEmbed") && (
          <ToolbarButton
            onClick={() => {
              if (onVideoEmbed) {
                onVideoEmbed();
              } else {
                const url = window.prompt("URL видео (RuTube, VK, Дзен):");
                if (url) {
                  editor.chain().focus().setVideoEmbed({ src: url }).run();
                }
              }
            }}
            tooltip="Видео (RuTube, VK, Дзен)"
          >
            <Video className="h-4 w-4" />
          </ToolbarButton>
        )}

        {/* Tables (full mode) */}
        {can("table") && (
          <>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0",
                        editor.isActive("table") && "bg-muted text-foreground"
                      )}
                    >
                      <Table className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Таблица
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Вставить таблицу 3×3
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  disabled={!editor.can().addColumnAfter()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить столбец справа
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  disabled={!editor.can().addRowAfter()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить строку снизу
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  disabled={!editor.can().deleteColumn()}
                >
                  <Minus className="mr-2 h-4 w-4" />
                  Удалить столбец
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  disabled={!editor.can().deleteRow()}
                >
                  <Minus className="mr-2 h-4 w-4" />
                  Удалить строку
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  disabled={!editor.can().deleteTable()}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить таблицу
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
