"use client";

import Image from "next/image";
import { type MouseEvent, type PointerEvent, type WheelEvent, useEffect, useMemo, useRef, useState } from "react";
import type { ProjectGalleryMedia } from "@/data/projects";

type ProjectGalleryProps = {
  media: ProjectGalleryMedia[];
};

type ZoomOffset = {
  x: number;
  y: number;
};

type PanState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

const minZoomScale = 1;
const maxZoomScale = 5;
const zoomStep = 0.2;
const defaultZoomOffset: ZoomOffset = { x: 0, y: 0 };

function getMediaLabel(index: number) {
  return String(index + 1).padStart(2, "0");
}

function clampZoomScale(scale: number) {
  return Math.min(maxZoomScale, Math.max(minZoomScale, Number(scale.toFixed(2))));
}

function clampZoomOffset(
  offset: ZoomOffset,
  scale: number,
  viewport: HTMLDivElement | null,
  media: HTMLVideoElement | HTMLImageElement | null,
) {
  if (!viewport || !media || scale <= minZoomScale) {
    return defaultZoomOffset;
  }

  const maxOffsetX = Math.max(0, (media.clientWidth * scale - viewport.clientWidth) / 2);
  const maxOffsetY = Math.max(0, (media.clientHeight * scale - viewport.clientHeight) / 2);

  return {
    x: Math.min(maxOffsetX, Math.max(-maxOffsetX, offset.x)),
    y: Math.min(maxOffsetY, Math.max(-maxOffsetY, offset.y)),
  };
}

export function ProjectGallery({ media }: ProjectGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(minZoomScale);
  const [zoomOffset, setZoomOffset] = useState<ZoomOffset>(defaultZoomOffset);
  const [isPanning, setIsPanning] = useState(false);
  const inlineVideoRef = useRef<HTMLVideoElement | null>(null);
  const zoomedVideoRef = useRef<HTMLVideoElement | null>(null);
  const zoomedMediaRef = useRef<HTMLVideoElement | HTMLImageElement | null>(null);
  const zoomViewportRef = useRef<HTMLDivElement | null>(null);
  const panStateRef = useRef<PanState | null>(null);

  if (media.length === 0) {
    return null;
  }

  const currentMedia = media[currentIndex];
  const currentLabel = getMediaLabel(currentIndex);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < media.length - 1;

  const currentAlt = useMemo(() => {
    return currentMedia.type === "video" ? `Project video ${currentLabel}` : `Project image ${currentLabel}`;
  }, [currentLabel, currentMedia.type]);

  const goPrevious = () => {
    if (!canGoPrevious) return;
    setCurrentIndex((index) => index - 1);
  };

  const goNext = () => {
    if (!canGoNext) return;
    setCurrentIndex((index) => index + 1);
  };

  const handleZoomedPrevious = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    goPrevious();
  };

  const handleZoomedNext = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    goNext();
  };

  useEffect(() => {
    setZoomScale(minZoomScale);
    setZoomOffset(defaultZoomOffset);
    setIsPanning(false);
    panStateRef.current = null;
  }, [currentIndex, isZoomed]);

  useEffect(() => {
    if (currentMedia.type === "video") {
      inlineVideoRef.current?.play().catch(() => undefined);
    }
  }, [currentMedia]);

  useEffect(() => {
    if (isZoomed && currentMedia.type === "video") {
      zoomedVideoRef.current?.play().catch(() => undefined);
    }
  }, [currentMedia, isZoomed]);

  useEffect(() => {
    if (!isZoomed) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "<" || event.key === ",") {
        if (!canGoPrevious) {
          return;
        }

        event.preventDefault();
        goPrevious();
      }

      if (event.key === ">" || event.key === ".") {
        if (!canGoNext) {
          return;
        }

        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canGoNext, canGoPrevious, goNext, goPrevious, isZoomed]);

  const handleWheelZoom = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    const viewport = zoomViewportRef.current;

    if (!viewport) {
      return;
    }

    const viewportRect = viewport.getBoundingClientRect();
    const pointerX = event.clientX - viewportRect.left - viewportRect.width / 2;
    const pointerY = event.clientY - viewportRect.top - viewportRect.height / 2;

    setZoomScale((scale) => {
      const nextScale = clampZoomScale(scale + (event.deltaY < 0 ? zoomStep : -zoomStep));

      if (nextScale === scale) {
        return scale;
      }

      setZoomOffset((offset) => {
        if (nextScale === minZoomScale) {
          return defaultZoomOffset;
        }

        const scaleRatio = nextScale / scale;
        const nextOffset = {
          x: pointerX - (pointerX - offset.x) * scaleRatio,
          y: pointerY - (pointerY - offset.y) * scaleRatio,
        };

        return clampZoomOffset(nextOffset, nextScale, viewport, zoomedMediaRef.current);
      });

      return nextScale;
    });
  };

  const handlePanStart = (event: PointerEvent<HTMLDivElement>) => {
    if (zoomScale <= minZoomScale) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    panStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: zoomOffset.x,
      originY: zoomOffset.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPanning(true);
  };

  const handlePanMove = (event: PointerEvent<HTMLDivElement>) => {
    const panState = panStateRef.current;

    if (!panState || panState.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();

    const nextOffset = {
      x: panState.originX + event.clientX - panState.startX,
      y: panState.originY + event.clientY - panState.startY,
    };

    setZoomOffset(clampZoomOffset(nextOffset, zoomScale, zoomViewportRef.current, zoomedMediaRef.current));
  };

  const handlePanEnd = (event: PointerEvent<HTMLDivElement>) => {
    const panState = panStateRef.current;

    if (!panState || panState.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    panStateRef.current = null;
    setIsPanning(false);
  };

  const zoomedMediaTransform = `translate3d(${zoomOffset.x}px, ${zoomOffset.y}px, 0) scale(${zoomScale})`;
  const zoomViewportCursorClassName = isPanning ? "cursor-grabbing" : zoomScale > minZoomScale ? "cursor-grab" : "cursor-default";

  return (
    <section className="space-y-6 border-t border-black/10 pt-12">
      <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-[#f1ede6] p-4 md:p-6">
        <button
          type="button"
          aria-label="放大预览"
          onClick={() => setIsZoomed(true)}
          className="block w-full cursor-zoom-in transition-transform duration-700 hover:scale-[1.01]"
        >
          <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[22px] bg-[#ece7de] transition-all duration-700 ease-out">
            {currentMedia.type === "video" ? (
              <video
                key={currentMedia.src}
                ref={inlineVideoRef}
                src={currentMedia.src}
                className="h-auto w-full object-contain"
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            ) : (
              <Image
                src={currentMedia.src}
                alt={currentAlt}
                width={1600}
                height={1200}
                className="h-auto w-full object-contain"
                priority
                unoptimized
              />
            )}
          </div>
        </button>

        <div className="mt-5 flex flex-col items-center gap-4">
          <p className="text-xs uppercase tracking-[0.35em] text-black/45">{currentLabel}</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="上一项"
              onClick={goPrevious}
              disabled={!canGoPrevious}
              className="inline-flex min-w-20 items-center justify-center rounded-full border border-black/10 px-4 py-1 text-3xl leading-none text-black/60 transition-all duration-500 hover:border-black/30 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
            >
              {"<"}
            </button>

            <button
              type="button"
              aria-label="下一项"
              onClick={goNext}
              disabled={!canGoNext}
              className="inline-flex min-w-20 items-center justify-center rounded-full border border-black/10 px-4 py-1 text-3xl leading-none text-black/60 transition-all duration-500 hover:border-black/30 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      {isZoomed ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/78"
          onClick={() => setIsZoomed(false)}
        >
          <button
            type="button"
            aria-label="关闭预览"
            onClick={() => setIsZoomed(false)}
            className="absolute right-6 top-6 z-20 text-3xl text-white/80 transition-opacity hover:opacity-60"
          >
            ×
          </button>

          <button
            type="button"
            aria-label="预览上一项"
            onClick={handleZoomedPrevious}
            disabled={!canGoPrevious}
            className="absolute left-6 top-1/2 z-20 inline-flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-5xl leading-none text-white/75 transition-colors hover:bg-black/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
          >
            {"<"}
          </button>

          <button
            type="button"
            aria-label="预览下一项"
            onClick={handleZoomedNext}
            disabled={!canGoNext}
            className="absolute right-6 top-1/2 z-20 inline-flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-5xl leading-none text-white/75 transition-colors hover:bg-black/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
          >
            {">"}
          </button>

          <div
            ref={zoomViewportRef}
            className={`flex h-full w-full items-center justify-center overflow-hidden p-6 ${zoomViewportCursorClassName}`}
            onClick={(event) => event.stopPropagation()}
            onWheel={handleWheelZoom}
            onPointerDown={handlePanStart}
            onPointerMove={handlePanMove}
            onPointerUp={handlePanEnd}
            onPointerCancel={handlePanEnd}
          >
            {currentMedia.type === "video" ? (
              <video
                key={`${currentMedia.src}-zoomed`}
                ref={(node) => {
                  zoomedVideoRef.current = node;
                  zoomedMediaRef.current = node;
                }}
                src={currentMedia.src}
                className="h-auto w-auto max-w-none select-none object-contain transition-transform duration-150"
                style={{ transform: zoomedMediaTransform, transformOrigin: "center center" }}
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            ) : (
              <img
                ref={(node) => {
                  zoomedMediaRef.current = node;
                }}
                src={currentMedia.src}
                alt={`Zoomed ${currentAlt}`}
                className="h-auto w-auto max-w-none select-none object-contain transition-transform duration-150"
                style={{ transform: zoomedMediaTransform, transformOrigin: "center center" }}
                draggable={false}
              />
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
