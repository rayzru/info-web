"use client";

import { useState } from "react";

import { Check, MessageSquarePlus, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface ArticleFeedbackProps {
  articleId: string;
  articleTitle: string;
  articleSlug: string;
  helpfulCount: number;
  notHelpfulCount: number;
}

export function ArticleFeedback({
  articleId,
  articleTitle,
  articleSlug,
  helpfulCount,
  notHelpfulCount,
}: ArticleFeedbackProps) {
  const feedbackUrl = `/feedback?type=suggestion&title=${encodeURIComponent(`Предложение по статье: ${articleTitle}`)}&context=${encodeURIComponent(`/howtos/${articleSlug}`)}&focus=content`;
  const [voted, setVoted] = useState<"helpful" | "not_helpful" | null>(null);
  const [counts, setCounts] = useState({
    helpful: helpfulCount,
    notHelpful: notHelpfulCount,
  });

  const rateMutation = api.knowledge.rate.useMutation({
    onSuccess: (_, { helpful }) => {
      setVoted(helpful ? "helpful" : "not_helpful");
      setCounts((prev) => ({
        helpful: helpful ? prev.helpful + 1 : prev.helpful,
        notHelpful: !helpful ? prev.notHelpful + 1 : prev.notHelpful,
      }));
    },
  });

  const handleVote = (helpful: boolean) => {
    if (voted) return;
    rateMutation.mutate({ articleId, helpful });
  };

  return (
    <div className="flex flex-col items-center py-4">
      <p className="text-muted-foreground mb-3 text-sm">Была ли эта статья полезной?</p>
      <div className="flex items-center gap-3">
        <Button
          variant={voted === "helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote(true)}
          disabled={voted !== null || rateMutation.isPending}
          className="gap-2"
        >
          {voted === "helpful" ? <Check className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
          Да
          {counts.helpful > 0 && <span className="text-xs opacity-70">({counts.helpful})</span>}
        </Button>
        <Button
          variant={voted === "not_helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote(false)}
          disabled={voted !== null || rateMutation.isPending}
          className="gap-2"
        >
          {voted === "not_helpful" ? (
            <Check className="h-4 w-4" />
          ) : (
            <ThumbsDown className="h-4 w-4" />
          )}
          Нет
          {counts.notHelpful > 0 && (
            <span className="text-xs opacity-70">({counts.notHelpful})</span>
          )}
        </Button>
      </div>
      {voted && <p className="text-muted-foreground mt-3 text-sm">Спасибо за отзыв!</p>}

      {/* Кнопка предложения изменений */}
      <div className="border-border/50 mt-4 border-t pt-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground gap-2"
        >
          <Link href={feedbackUrl}>
            <MessageSquarePlus className="h-4 w-4" />
            Предложить изменения
          </Link>
        </Button>
      </div>
    </div>
  );
}
