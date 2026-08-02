"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useState,
} from "react";
import "./Folder.css";

type FolderProps = {
  color?: string;
  size?: number;
  items?: ReactNode[];
  className?: string;
  label?: string;
  itemLabels?: string[];
  activeIndex?: number | null;
  onItemActivate?: (index: number) => void;
  onOpenChange?: (open: boolean) => void;
  coverImage?: string;
  coverPosition?: string;
};

type FolderStyle = CSSProperties & Record<`--${string}`, string | number>;

type PaperOffset = {
  x: number;
  y: number;
};

const maximumItems = 3;
const restingOffsets = () =>
  Array.from({ length: maximumItems }, () => ({ x: 0, y: 0 }));

function darkenColor(hex: string, percent: number) {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;

  if (color.length === 3) {
    color = color
      .split("")
      .map((character) => character + character)
      .join("");
  }

  const number = Number.parseInt(color.slice(0, 6), 16);
  const red = Math.max(
    0,
    Math.min(255, Math.floor(((number >> 16) & 0xff) * (1 - percent))),
  );
  const green = Math.max(
    0,
    Math.min(255, Math.floor(((number >> 8) & 0xff) * (1 - percent))),
  );
  const blue = Math.max(
    0,
    Math.min(255, Math.floor((number & 0xff) * (1 - percent))),
  );

  return `#${((1 << 24) + (red << 16) + (green << 8) + blue)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

export function Folder({
  color = "#7f98a6",
  size = 1,
  items = [],
  className = "",
  label = "teaching portfolio folder",
  itemLabels = [],
  activeIndex = null,
  onItemActivate,
  onOpenChange,
  coverImage,
  coverPosition = "center",
}: FolderProps) {
  const papers = items.slice(0, maximumItems);

  while (papers.length < maximumItems) {
    papers.push(null);
  }

  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] =
    useState<PaperOffset[]>(restingOffsets);

  const handleToggle = () => {
    setOpen((currentlyOpen) => {
      const nextOpen = !currentlyOpen;

      if (currentlyOpen) {
        setPaperOffsets(restingOffsets());
      }

      onOpenChange?.(nextOpen);
      return nextOpen;
    });
  };

  const handlePaperActivate = (
    event: MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    event.stopPropagation();

    if (open && papers[index]) {
      if (onItemActivate) {
        onItemActivate(index);
      } else {
        handleToggle();
      }
    }
  };

  const handlePaperKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();

      if (open && papers[index]) {
        if (onItemActivate) {
          onItemActivate(index);
        } else {
          handleToggle();
        }
      }
    }
  };

  const handlePaperPointerMove = (
    event: PointerEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (!open || event.pointerType === "touch") {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - (rect.left + rect.width / 2)) * 0.12;
    const offsetY = (event.clientY - (rect.top + rect.height / 2)) * 0.12;

    setPaperOffsets((currentOffsets) =>
      currentOffsets.map((offset, offsetIndex) =>
        offsetIndex === index ? { x: offsetX, y: offsetY } : offset,
      ),
    );
  };

  const resetPaper = (index: number) => {
    setPaperOffsets((currentOffsets) =>
      currentOffsets.map((offset, offsetIndex) =>
        offsetIndex === index ? { x: 0, y: 0 } : offset,
      ),
    );
  };

  const folderStyle = {
    "--folder-color": color,
    "--folder-back-color": darkenColor(color, 0.1),
    "--paper-1": "#e9e5dc",
    "--paper-2": "#f1eee7",
    "--paper-3": "#fbf8f0",
    "--folder-scale": size,
    "--folder-cover-image": coverImage ? `url("${coverImage}")` : "none",
    "--folder-cover-position": coverPosition,
  } as FolderStyle;

  return (
    <div
      className={`rb-folder-scale ${className}`.trim()}
      style={folderStyle}
    >
      <div
        className={`rb-folder ${open ? "folder--open" : ""}`.trim()}
      >
        <div className="rb-folder-back">
          {papers.map((item, index) => (
            <div
              className={[
                "rb-folder-paper",
                `paper-${index + 1}`,
                item ? "is-interactive" : "",
                activeIndex === index ? "is-active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={(event) => handlePaperActivate(event, index)}
              onKeyDown={(event) => handlePaperKeyDown(event, index)}
              onPointerMove={(event) =>
                handlePaperPointerMove(event, index)
              }
              onPointerLeave={() => resetPaper(index)}
              role={item ? "button" : undefined}
              tabIndex={open && item ? 0 : -1}
              aria-label={
                item
                  ? onItemActivate
                    ? itemLabels[index] ?? `Open ${label} item ${index + 1}`
                    : `Close ${label}`
                  : undefined
              }
              aria-pressed={
                onItemActivate && item
                  ? activeIndex === index
                  : undefined
              }
              style={
                {
                  "--magnet-x": `${paperOffsets[index]?.x ?? 0}px`,
                  "--magnet-y": `${paperOffsets[index]?.y ?? 0}px`,
                } as FolderStyle
              }
              key={index}
            >
              {item}
            </div>
          ))}
          <button
            type="button"
            className="rb-folder-toggle"
            onClick={handleToggle}
            aria-expanded={open}
            aria-label={open ? `Close ${label}` : `Open ${label}`}
          >
            <span className="rb-folder-front folder-front-left" />
            <span className="rb-folder-front folder-front-right" />
          </button>
        </div>
      </div>
    </div>
  );
}
