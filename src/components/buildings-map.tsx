"use client";
import Image from "next/image";
import React from "react";
import { Badge } from "./ui/badge";

interface Building {
  x: number;
  y: number;
  title: string;
  description?: string;
  isActive?: boolean;
  order: number;
}

const buildings: Building[] = [
  {
    x: 80,
    y: 13,
    title: "Строение 7",
    order: 2,
  },
  {
    x: 60,
    y: 20,
    title: "Строение 6",
    order: 2,
  },
  {
    x: 72,
    y: 61,
    title: "Строение 1",
    order: 1,
  },
  {
    x: 39,
    y: 40,
    title: "Литер 8",
    order: 2,
  },

  {
    x: 21,
    y: 37,
    title: "Литер 1",
    order: 2,
  },
  {
    x: 40,
    y: 78,
    title: "Строение 2",
    order: 2,
  },
  {
    x: 12,
    y: 73,
    title: "Литер 9",
    order: 2,
  },
];

export function BuildingsMap() {
  const imageRef = React.useRef<HTMLImageElement>(null);
  const svgRef = React.useRef<SVGElement>(null);
  const [imageSize, setImageSize] = React.useState({ width: 0, height: 0 });
  const [svgSize, setSvgSize] = React.useState({ width: 0, height: 0 });
  const [composition, setComposition] = React.useState<React.ReactNode[]>([]);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const hasSizes = imageSize.width > 0 && imageSize.height > 0 && svgSize.width > 0 && svgSize.height > 0;

  React.useEffect(() => {
    const handleResize = () => {
      const imageRect = imageRef.current?.getBoundingClientRect();
      const svgRect = svgRef.current?.getBoundingClientRect();
      setImageSize({
        width: imageRect?.width ?? 0,
        height: imageRect?.height ?? 0,
      });
      setSvgSize({
        width: svgRect?.width ?? 0,
        height: svgRect?.height ?? 0,
      });
    };

    requestAnimationFrame(handleResize);
    window.addEventListener("resize", handleResize, false);

    return () => {
      window.removeEventListener("resize", handleResize, false);
    };
  }, []);

  React.useEffect(() => {

    if (!hasSizes) return;

      imageRef?.current?.addEventListener("click", (e) => {
        const target = e.currentTarget;
        if (!(target instanceof HTMLImageElement)) return;

        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPos = (x / rect.width) * 100;
        const yPos = (y / rect.height) * 100;
        setMousePos({ x: xPos, y: yPos });

        const newPath = createBezierPath(
          {
            ...convertCoords(
              svgSize.width,
              svgSize.height,
              imageSize.width,
              imageSize.height,
              xPos,
              yPos
            ),
            order: 0,
            title: "",
          },
          0
        );
        setComposition([...composition, newPath]);
      });
  }, [hasSizes]);


  return (
    <div
      className="w-full min-h-[250px]
      relative
      bg-radial from-gray-200 dark:from-gray-800 to-white dark:to-black
      mx-auto py-8 mt-8"
    >
      <Image
        ref={imageRef}
        width={800}
        height={600}
        src="/sr2-map.png"
        alt="Cхема"
        className="max-h-[650px] mx-auto my-8 z-10"
      />
      <div className="absolute top-[40px] flex flex-col gap-[8px] left-0 h-ful pointer-events-none w-[120px]">
        { buildings.map((b: Building, index: number) =>createBuildingLabel(b, index)) }
      </div>
      <svg
        ref={svgRef as unknown as React.RefObject<SVGSVGElement>}
        xmlns="http://www.w3.org/2000/svg"
        width={svgSize.width}
        height={svgSize.height}
        preserveAspectRatio={"none"}
        fill="none"
        className="absolute bottom-0 right-0 w-full h-full pointer-events-none text-red-600 dark:text-red-400"
      >
        <g stroke="currentColor" strokeWidth="2">
          { hasSizes && buildings.map((b: Building) => ({
          ...b,
          ...convertCoords(
            svgSize.width,
            svgSize.height,
            imageSize.width,
            imageSize.height,
            b.x,
            b.y
          ),
        }))
        .map(createBezierPath)}
        </g>
      </svg>
    </div>
  );
}

function convertCoords(
  divWidth: number,
  divHeight: number,
  imgWidth: number,
  imgHeight: number,
  xPercent: number,
  yPercent: number
) {
  const offsetX = (divWidth - imgWidth) / 2;
  const offsetY = (divHeight - imgHeight) / 2;
  const imgX = (xPercent / 100) * imgWidth;
  const imgY = (yPercent / 100) * imgHeight;
  const divX = offsetX + imgX;
  const divY = offsetY + imgY;
  return { x: Math.round(divX), y: Math.round(divY) };
}

function createBuildingLabel(building: Building, index: number) {
  return (<div className="flex flex-row"><Badge variant="default" className="ml-auto">{building.title}</Badge></div>);
}


function createBezierPath(
    building: Building,
    index: number
  ): React.ReactElement<SVGElement[]> {

    const yDelta = index * 30 + 50;
    return (
      <>

        <path d={
          `
          M ${building.x} ${building.y}
          C ${building.x/2} ${building.y/2},
          180 ${yDelta},
          130 ${yDelta}
          `}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray="0 4"
          strokeDashoffset={index * 10}
        />
        <circle cx={building.x} cy={building.y} r="3" fill="#800" stroke="#000" strokeWidth="2" />
        <circle cx={130} cy={index * 30 + 50} r="1" fill="#800" stroke="currentColor" strokeWidth="2" />
      </>
    );
  }
