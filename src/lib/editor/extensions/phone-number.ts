import { Mark, mergeAttributes } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

/**
 * Phone number formats supported:
 * - +7 XXX XXX-XX-XX (standard Russian)
 * - +7 (XXX) XXX-XX-XX
 * - 8 XXX XXX-XX-XX
 * - 8 (XXX) XXX-XX-XX
 * - +7XXXXXXXXXX (no spaces)
 * - 8XXXXXXXXXX
 */
const PHONE_REGEX = /(?:\+7|8)[\s-]?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{2}[\s-]?\d{2}/g;

/**
 * Normalize phone number to +7XXXXXXXXXX format for tel: links
 */
export function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Convert 8 to +7 for Russian numbers
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
export function formatPhoneNumber(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  const digits = normalized.replace(/\D/g, "");

  if (digits.length === 11) {
    return `+${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }

  return phone; // Return original if can't format
}

/**
 * Check if device is mobile (for render strategy)
 */
function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export interface PhoneNumberOptions {
  HTMLAttributes: Record<string, unknown>;
  /**
   * Whether to auto-detect phone numbers in content
   */
  autoDetect: boolean;
  /**
   * Custom class for the phone number wrapper
   */
  className: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    phoneNumber: {
      /**
       * Set a phone number mark
       */
      setPhoneNumber: (attributes?: { phone: string }) => ReturnType;
      /**
       * Toggle a phone number mark
       */
      togglePhoneNumber: (attributes?: { phone: string }) => ReturnType;
      /**
       * Unset a phone number mark
       */
      unsetPhoneNumber: () => ReturnType;
    };
  }
}

/**
 * PhoneNumber extension for TipTap
 * Renders phone numbers as clickable/copyable links with formatting
 */
export const PhoneNumber = Mark.create<PhoneNumberOptions>({
  name: "phoneNumber",

  addOptions() {
    return {
      HTMLAttributes: {},
      autoDetect: true,
      className: "phone-number",
    };
  },

  addAttributes() {
    return {
      phone: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-phone") || element.textContent,
        renderHTML: (attributes) => {
          if (!attributes.phone) return {};
          return {
            "data-phone": attributes.phone as string,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "a[data-phone-number]",
      },
      {
        tag: "span[data-phone-number]",
      },
    ];
  },

  renderHTML({ HTMLAttributes, mark }) {
    const phone = (mark.attrs.phone as string) || "";
    const normalizedPhone = normalizePhoneNumber(phone);
    const formattedPhone = formatPhoneNumber(phone);
    const isMobile = isMobileDevice();

    // Base attributes
    const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      "data-phone-number": "",
      "data-phone": normalizedPhone,
      class: this.options.className,
    });

    if (isMobile) {
      // Mobile: render as tel: link
      return [
        "a",
        {
          ...attrs,
          href: `tel:${normalizedPhone}`,
          class: `${attrs.class} phone-number-mobile`,
        },
        // Phone icon SVG inline
        ["span", { class: "phone-number-icon", "aria-hidden": "true" }],
        ["span", { class: "phone-number-text" }, formattedPhone],
      ];
    } else {
      // Desktop: render as copyable span with button
      return [
        "span",
        {
          ...attrs,
          class: `${attrs.class} phone-number-desktop`,
          role: "button",
          tabindex: "0",
          title: "Нажмите для копирования",
        },
        ["span", { class: "phone-number-icon", "aria-hidden": "true" }],
        ["span", { class: "phone-number-text" }, formattedPhone],
        [
          "button",
          {
            class: "phone-number-copy",
            type: "button",
            "aria-label": "Копировать номер",
            "data-copy": normalizedPhone,
          },
        ],
      ];
    }
  },

  addCommands() {
    return {
      setPhoneNumber:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      togglePhoneNumber:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes);
        },
      unsetPhoneNumber:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  addProseMirrorPlugins() {
    if (!this.options.autoDetect) {
      return [];
    }

    const pluginKey = new PluginKey("phoneNumberAutoDetect");

    return [
      new Plugin({
        key: pluginKey,
        state: {
          init: (_, state) => {
            return findPhoneNumbers(state.doc);
          },
          apply: (tr, oldState) => {
            if (tr.docChanged) {
              return findPhoneNumbers(tr.doc);
            }
            return oldState;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

/**
 * Find all phone numbers in the document and create decorations
 */
function findPhoneNumbers(doc: ProseMirrorNode): DecorationSet {
  const decorations: Decoration[] = [];

  doc.descendants((node: ProseMirrorNode, pos: number) => {
    if (!node.isText || !node.text) return;

    const text = node.text;
    let match;

    // Reset regex lastIndex
    PHONE_REGEX.lastIndex = 0;

    while ((match = PHONE_REGEX.exec(text)) !== null) {
      const start = pos + match.index;
      const end = start + match[0].length;
      const phone = match[0];
      const normalizedPhone = normalizePhoneNumber(phone);
      const formattedPhone = formatPhoneNumber(phone);

      decorations.push(
        Decoration.inline(start, end, {
          class: "phone-number phone-number-detected",
          "data-phone": normalizedPhone,
          "data-formatted": formattedPhone,
          nodeName: "span",
        })
      );
    }
  });

  return DecorationSet.create(doc, decorations);
}

export default PhoneNumber;
