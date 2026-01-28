"use client";

import { Phone, Copy, Check } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { cn } from "~/lib/utils";

/**
 * Normalize phone number to +7XXXXXXXXXX format
 */
function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("8") && digits.length === 11) {
    return "+7" + digits.slice(1);
  }
  if (digits.startsWith("7") && digits.length === 11) {
    return "+" + digits;
  }
  return "+" + digits;
}

/**
 * Format phone number for display: +7 XXX XXX-XX-XX
 */
function formatPhoneNumber(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  const digits = normalized.replace(/\D/g, "");

  if (digits.length === 11) {
    return `+${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }

  return phone;
}

interface PhoneNumberProps {
  phone: string;
  className?: string;
  showIcon?: boolean;
  showCopyButton?: boolean;
}

/**
 * PhoneNumber component
 * - Mobile: clickable tel: link
 * - Desktop: copyable with button
 */
export function PhoneNumber({
  phone,
  className,
  showIcon = true,
  showCopyButton = true,
}: PhoneNumberProps) {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const normalizedPhone = normalizePhoneNumber(phone);
  const formattedPhone = formatPhoneNumber(phone);

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(normalizedPhone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = normalizedPhone;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [normalizedPhone]);

  const baseClasses = cn(
    "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5",
    "bg-muted/50 text-foreground font-medium text-sm",
    "transition-colors duration-150",
    className
  );

  if (isMobile) {
    return (
      <a
        href={`tel:${normalizedPhone}`}
        className={cn(
          baseClasses,
          "hover:bg-primary/10 hover:text-primary active:bg-primary/20"
        )}
      >
        {showIcon && <Phone className="h-3.5 w-3.5 shrink-0" />}
        <span className="font-mono">{formattedPhone}</span>
      </a>
    );
  }

  return (
    <span
      className={cn(
        baseClasses,
        "cursor-pointer select-none",
        "hover:bg-muted"
      )}
      onClick={handleCopy}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCopy();
        }
      }}
      role="button"
      tabIndex={0}
      title="Нажмите для копирования"
    >
      {showIcon && <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
      <span className="font-mono">{formattedPhone}</span>
      {showCopyButton && (
        <span
          className={cn(
            "ml-1 p-0.5 rounded transition-colors",
            copied
              ? "text-green-600 dark:text-green-400"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={copied ? "Скопировано" : "Копировать"}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </span>
      )}
    </span>
  );
}

/**
 * Auto-detect and render phone numbers in text
 * Replaces phone numbers with PhoneNumber components
 */
interface PhoneNumberTextProps {
  text: string;
  className?: string;
}

const PHONE_REGEX =
  /(?:\+7|8)[\s-]?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{2}[\s-]?\d{2}/g;

export function PhoneNumberText({ text, className }: PhoneNumberTextProps) {
  const parts: (string | { phone: string; key: number })[] = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  PHONE_REGEX.lastIndex = 0;

  while ((match = PHONE_REGEX.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add phone number
    parts.push({ phone: match[0], key: keyCounter++ });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <span className={className}>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          part
        ) : (
          <PhoneNumber key={part.key} phone={part.phone} />
        )
      )}
    </span>
  );
}

export default PhoneNumber;
