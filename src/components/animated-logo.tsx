"use client";

import { useState } from "react";

import { cn } from "~/lib/utils";

interface AnimatedLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number;
}

// Animation: hover from СР2 (compact) to full "СЕРДЦЕ РОСТОВА 2"

export function AnimatedLogo({ className, duration = 400, ...props }: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Paths in sr2-full-logo2.svg (indices 0-13, 14 paths total)
  // Path 0: 2
  // Path 1: А
  // Path 2: В
  // Path 3: О (in РОСТОВА)
  // Path 4: Т
  // Path 5: С (in РОСТОВА)
  // Path 6: О (in РОСТОВА)
  // Path 7: Р (in РОСТОВА)
  // Path 8: Е (between words)
  // Path 9: Ц
  // Path 10: Д
  // Path 11: Р (in СЕРДЦЕ)
  // Path 12: Е (in СЕРДЦЕ)
  // Path 13: С (first letter)

  // SVG paths from sr2-full-logo2.svg
  const paths = [
    "M452.7 31.3v-4.6l11.9-11.2c1-.9 1.6-1.6 2-2.3a6.5 6.5 0 0 0 1.2-3.4c0-1.2-.4-2.2-1.3-2.8-.8-.7-2-1-3.6-1-1.3 0-2.5.2-3.6.7a7 7 0 0 0-2.8 2.4l-5.2-3.4a13 13 0 0 1 5-4.2c2-1 4.5-1.5 7.2-1.5 2.3 0 4.3.4 6 1.1a9 9 0 0 1 4 3.2A8 8 0 0 1 475 9c0 1-.2 2-.4 3a15.4 15.4 0 0 1-4.8 6.7L460 28l-1.4-2.6H476v5.8h-23.3Z",
    "M404 31.3 417.7.5h7l13.8 30.8h-7.4L419.8 4.1h2.8l-11.3 27.2H404Zm6.9-6.6 1.9-5.4h15.8l2 5.4h-19.7Z",
    "M374.7 31.3V.5H389c3.6 0 6.4.7 8.4 2.1 2 1.4 3 3.3 3 5.9a7 7 0 0 1-2.8 5.9c-1.9 1.4-4.4 2-7.5 2l.8-1.8c3.5 0 6.2.7 8 2a7 7 0 0 1 3 6c0 2.8-1 4.9-3.1 6.4-2 1.6-5 2.3-9 2.3h-15.1Zm7-5.3h8c1.6 0 2.8-.3 3.7-1 .8-.6 1.2-1.6 1.2-3 0-1.2-.4-2.2-1.3-2.8a6 6 0 0 0-3.7-1h-7.8V26Zm0-12.7h6.7c1.6 0 2.8-.3 3.5-1 .8-.6 1.2-1.5 1.2-2.8 0-1.2-.4-2.1-1.2-2.7-.8-.7-2-1-3.5-1h-6.6v7.5Z",
    "M352.4 31.9a19 19 0 0 1-6.8-1.2 15.7 15.7 0 0 1-8.9-21 15.4 15.4 0 0 1 9-8.5c2-.8 4.2-1.2 6.7-1.2 2.4 0 4.6.4 6.6 1.2a15.8 15.8 0 0 1 0 29.5 18 18 0 0 1-6.6 1.2Zm0-6.1a11 11 0 0 0 3.7-.7 9 9 0 0 0 5.1-5.2c.5-1.2.8-2.5.8-4a10.4 10.4 0 0 0-2.8-7.1 8.6 8.6 0 0 0-3-2 9.9 9.9 0 0 0-3.8-.7 9.2 9.2 0 0 0-9 5.9 11 11 0 0 0-.7 4 9.9 9.9 0 0 0 2.7 7.1 9 9 0 0 0 3.1 2c1.2.4 2.5.7 3.9.7Z",
    "M316.7 31.3V4.7l1.6 1.6H307V.5h26.7v5.8h-11.4l1.6-1.6v26.6h-7Z",
    "M293 31.9a19 19 0 0 1-6.6-1.2 15.9 15.9 0 0 1-8.8-8.4c-.9-2-1.3-4-1.3-6.4a15.7 15.7 0 0 1 10-14.7 18 18 0 0 1 6.8-1.2 15.6 15.6 0 0 1 12.6 5.4l-4.6 4.3a10 10 0 0 0-3.5-2.7 10 10 0 0 0-8.2-.2 9 9 0 0 0-5.1 5.1 11 11 0 0 0-.8 4c0 1.5.3 2.8.8 4a9 9 0 0 0 5.2 5.1 10.8 10.8 0 0 0 8.1-.1 9.3 9.3 0 0 0 3.5-2.8l4.6 4.3a14.3 14.3 0 0 1-5.4 4A18 18 0 0 1 293 32Z",
    "M256.1 31.9c-2.4 0-4.6-.4-6.7-1.2a15.7 15.7 0 0 1-8.9-21 15.4 15.4 0 0 1 9-8.5c2-.8 4.2-1.2 6.6-1.2 2.4 0 4.7.4 6.7 1.2a15.8 15.8 0 0 1 0 29.5 18 18 0 0 1-6.7 1.2Zm0-6.1c1.4 0 2.6-.3 3.8-.7a9 9 0 0 0 5-5.2c.6-1.2.8-2.5.8-4a10.4 10.4 0 0 0-2.7-7.1 8.6 8.6 0 0 0-3-2c-1.2-.5-2.5-.7-3.9-.7s-2.7.2-3.8.7a9.2 9.2 0 0 0-5.1 5.1 11 11 0 0 0-.7 4 9.9 9.9 0 0 0 2.7 7.1 9 9 0 0 0 3 2c1.2.5 2.5.8 3.9.8Z",
    "M209 31.3V.5h13.3c2.8 0 5.2.5 7.2 1.4 2 .9 3.5 2.1 4.6 3.8 1 1.7 1.6 3.7 1.6 6s-.5 4.3-1.6 6c-1.1 1.6-2.6 3-4.6 3.8-2 .9-4.4 1.3-7.2 1.3H213l3.1-3.2v11.7H209Zm7.1-10.9L213 17h9c2.1 0 3.8-.4 4.9-1.4 1-1 1.6-2.2 1.6-3.9a5 5 0 0 0-1.6-4 7.8 7.8 0 0 0-5-1.4h-9l3.2-3.4v17.5Z",
    "M173.7 13h14.8v5.5h-14.8v-5.6Zm.5 12.6H191v5.7h-24V.5h23.3v5.7h-16.2v19.4Z",
    "M130.1 31.3V.5h7.1v25h13.7V.5h7.1v30.8h-27.9Zm25.8 6.5v-8.1l1.5 1.6h-6.5v-5.8h11.5v12.3H156Z",
    "M114 28.2V6.3h-10.6l-.1 4.5a95.5 95.5 0 0 1-1.1 10.1 14 14 0 0 1-1.3 3.5c-.5 1-1.1 1.7-1.9 2l-7.6-.9c1 0 2-.3 2.6-1a8 8 0 0 0 1.7-3.3 89.3 89.3 0 0 0 1.3-11l.3-9.7H121v27.7h-7Zm-23.6 9.5V25.5h35v12.2h-6.7v-6.4H97v6.4h-6.6Z",
    "M63.6 31.3V.5H77c2.7 0 5 .5 7 1.5a10.2 10.2 0 0 1 6.3 9.8c0 2.3-.6 4.3-1.7 6-1 1.6-2.6 3-4.6 3.8-2 .9-4.4 1.3-7.1 1.3h-9.4l3.2-3.2v11.7h-7.2Zm7.2-10.9L67.6 17h9c2.2 0 3.8-.4 5-1.4 1-1 1.5-2.2 1.5-3.9a5 5 0 0 0-1.6-4c-1-.9-2.7-1.4-5-1.4h-8.9L70.8 3v17.5Z",
    "M40.6 13h14.8v5.5H40.6v-5.6Zm.5 12.6H58v5.7H34V.5h23.3v5.7H41.1v19.4Z",
    "M16.7 31.9a19 19 0 0 1-6.7-1.2 15.9 15.9 0 0 1-8.8-8.4c-.8-2-1.2-4-1.2-6.4 0-2.3.4-4.4 1.2-6.4a15.7 15.7 0 0 1 8.9-8.3A18 18 0 0 1 16.7 0a16 16 0 0 1 12.7 5.4l-4.6 4.3A10 10 0 0 0 21.3 7a10 10 0 0 0-8.2-.2A9 9 0 0 0 8 11.9a11 11 0 0 0-.7 4c0 1.5.3 2.8.7 4a9 9 0 0 0 5.2 5.1 10.8 10.8 0 0 0 8.2-.1 9.3 9.3 0 0 0 3.5-2.8l4.6 4.3a14.3 14.3 0 0 1-5.5 4 18 18 0 0 1-7.2 1.5Z",
  ];

  // Extract X coordinates from paths (starting position of each letter)
  const pathXCoords = paths.map((path) => {
    const match = /M([\d.]+)/.exec(path);
    return match?.[1] ? parseFloat(match[1]) : 0;
  });

  // Initially visible letters (СР2)
  const initialVisibleLetters = [13, 7, 0];

  // Letter stages - which letters appear at each stage
  const letterStages = [
    [13, 7, 0], // Stage 0: СР2 (already visible)
    [12, 6], // Stage 1: add Е, О -> СЕ РО 2
    [11, 5], // Stage 2: add Р, С -> СЕР РОС 2
    [10, 4], // Stage 3: add Д, Т -> СЕРД РОСТ 2
    [9, 3], // Stage 4: add Ц, О -> СЕРДЦ РОСТО 2
    [8, 2], // Stage 5: add Е, В -> СЕРДЦЕ РОСТОВ 2
    [1], // Stage 6: add А -> СЕРДЦЕ РОСТОВА 2
  ];

  // Get stage index for a letter
  const getStageIndex = (letterIndex: number): number => {
    return letterStages.findIndex((stage) => stage.includes(letterIndex));
  };

  // Compact positions for СР2 (close together)
  const compactPositions: Record<number, number> = {
    13: 16.7, // С stays at original position
    7: 16.7 + 16, // Р very close to С
    0: 16.7 + 44, // 2 close to Р
  };

  // Get style for each letter
  const getLetterStyle = (index: number): React.CSSProperties => {
    const isInitiallyVisible = initialVisibleLetters.includes(index);
    const originalX = pathXCoords[index] ?? 0;
    const stageIndex = getStageIndex(index);

    // Calculate delay based on stage (staggered animation)
    const stageDelay = stageIndex > 0 ? (stageIndex * duration) / letterStages.length : 0;

    if (!isInitiallyVisible) {
      // Hidden letters: stay at original position, fade in on hover with delay
      return {
        opacity: isHovered ? 1 : 0,
        transition: `opacity ${duration * 0.3}ms ease-out ${isHovered ? stageDelay : 0}ms`,
      };
    }

    // Initially visible letters (СР2): translate from compact to original position
    const compactX = compactPositions[index] ?? originalX;
    const translateDistance = originalX - compactX;

    return {
      transform: isHovered ? `translateX(0)` : `translateX(${-translateDistance}px)`,
      opacity: 1,
      transition: `transform ${duration}ms ease-out`,
    };
  };

  return (
    <div
      className={cn("relative inline-block text-red-600 dark:text-red-400", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="476"
        height="38"
        fill="currentColor"
        viewBox="0 0 476 38"
        className="h-full w-full"
      >
        {paths.map((pathData, index) => (
          <path key={index} d={pathData} style={getLetterStyle(index)} />
        ))}
      </svg>
    </div>
  );
}
