import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Supported video platforms configuration
 */
interface VideoPlatform {
  name: string;
  // Regex patterns to match video URLs
  patterns: RegExp[];
  // Function to extract video ID from URL
  getVideoId: (url: string) => string | null;
  // Function to generate embed URL
  getEmbedUrl: (videoId: string) => string;
}

const VIDEO_PLATFORMS: VideoPlatform[] = [
  {
    name: "youtube",
    patterns: [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ],
    getVideoId: (url: string) => {
      for (const pattern of VIDEO_PLATFORMS[0]!.patterns) {
        const match = url.match(pattern);
        if (match?.[1]) return match[1];
      }
      return null;
    },
    getEmbedUrl: (videoId: string) =>
      `https://www.youtube.com/embed/${videoId}`,
  },
  {
    name: "rutube",
    patterns: [
      /rutube\.ru\/video\/([a-zA-Z0-9]+)/,
      /rutube\.ru\/play\/embed\/([a-zA-Z0-9]+)/,
    ],
    getVideoId: (url: string) => {
      for (const pattern of VIDEO_PLATFORMS[1]!.patterns) {
        const match = url.match(pattern);
        if (match?.[1]) return match[1];
      }
      return null;
    },
    getEmbedUrl: (videoId: string) =>
      `https://rutube.ru/play/embed/${videoId}`,
  },
  {
    name: "vk",
    patterns: [
      /vk\.com\/video(-?\d+)_(\d+)/,
      /vk\.com\/video_ext\.php\?oid=(-?\d+)&id=(\d+)/,
    ],
    getVideoId: (url: string) => {
      const match = url.match(/vk\.com\/video(-?\d+)_(\d+)/);
      if (match?.[1] && match?.[2]) return `${match[1]}_${match[2]}`;
      const extMatch = url.match(
        /vk\.com\/video_ext\.php\?oid=(-?\d+)&id=(\d+)/
      );
      if (extMatch?.[1] && extMatch?.[2])
        return `${extMatch[1]}_${extMatch[2]}`;
      return null;
    },
    getEmbedUrl: (videoId: string) => {
      const [oid, id] = videoId.split("_");
      return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2`;
    },
  },
  {
    name: "yandex",
    patterns: [
      /frontend\.vh\.yandex\.ru\/player\/([a-zA-Z0-9]+)/,
      /yandex\.ru\/video\/preview\/([a-zA-Z0-9]+)/,
      /dzen\.ru\/video\/watch\/([a-zA-Z0-9]+)/,
    ],
    getVideoId: (url: string) => {
      for (const pattern of VIDEO_PLATFORMS[3]!.patterns) {
        const match = url.match(pattern);
        if (match?.[1]) return match[1];
      }
      return null;
    },
    getEmbedUrl: (videoId: string) =>
      `https://frontend.vh.yandex.ru/player/${videoId}`,
  },
];

/**
 * Detect video platform from URL
 */
function detectPlatform(url: string): VideoPlatform | null {
  for (const platform of VIDEO_PLATFORMS) {
    for (const pattern of platform.patterns) {
      if (pattern.test(url)) {
        return platform;
      }
    }
  }
  return null;
}

/**
 * Parse video URL and return embed info
 */
export function parseVideoUrl(url: string): {
  platform: string;
  videoId: string;
  embedUrl: string;
} | null {
  const platform = detectPlatform(url);
  if (!platform) return null;

  const videoId = platform.getVideoId(url);
  if (!videoId) return null;

  return {
    platform: platform.name,
    videoId,
    embedUrl: platform.getEmbedUrl(videoId),
  };
}

export interface VideoEmbedOptions {
  HTMLAttributes: Record<string, unknown>;
  width: number;
  height: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoEmbed: {
      /**
       * Insert a video embed
       */
      setVideoEmbed: (options: { src: string }) => ReturnType;
    };
  }
}

/**
 * VideoEmbed extension for TipTap
 * Supports: YouTube, RuTube, VK Video, Yandex Video/Dzen
 */
export const VideoEmbed = Node.create<VideoEmbedOptions>({
  name: "videoEmbed",

  group: "block",

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "video-embed rounded-lg overflow-hidden my-4",
      },
      width: 640,
      height: 360,
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      platform: {
        default: null,
      },
      videoId: {
        default: null,
      },
      width: {
        default: this.options.width,
      },
      height: {
        default: this.options.height,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-video-embed]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, width, height } = HTMLAttributes as {
      src: string;
      width: number;
      height: number;
    };

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-video-embed": "",
        style: `position: relative; padding-bottom: ${(height / width) * 100}%; height: 0; overflow: hidden;`,
      }),
      [
        "iframe",
        {
          src,
          width: "100%",
          height: "100%",
          style:
            "position: absolute; top: 0; left: 0; width: 100%; height: 100%;",
          frameborder: "0",
          allowfullscreen: "true",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setVideoEmbed:
        (options) =>
        ({ commands }) => {
          const parsed = parseVideoUrl(options.src);
          if (!parsed) {
            // If URL is not recognized, try to use it as direct iframe src
            return commands.insertContent({
              type: this.name,
              attrs: {
                src: options.src,
                platform: "unknown",
                videoId: null,
              },
            });
          }

          return commands.insertContent({
            type: this.name,
            attrs: {
              src: parsed.embedUrl,
              platform: parsed.platform,
              videoId: parsed.videoId,
            },
          });
        },
    };
  },
});

export default VideoEmbed;
