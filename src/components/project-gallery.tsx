"use client";

import Image from "next/image";
import { type WheelEvent, useEffect, useMemo, useRef, useState } from "react";
import type { ProjectGalleryMedia } from "@/data/projects";

type ProjectGalleryProps = {
  media: ProjectGalleryMedia[];
};

function getMediaLabel(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function ProjectGallery({ media }: ProjectGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const inlineVideoRef = useRef<HTMLVideoElement | null>(null);
  const zoomedVideoRef = useRef<HTMLVideoElement | null>(null);

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

  useEffect(() => {
    setZoomScale(1);
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

  const handleWheelZoom = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setZoomScale((scale) => {
      const nextScale = event.deltaY < 0 ? scale + 0.2 : scale - 0.2;
      return Math.min(3, Math.max(1, Number(nextScale.toFixed(2))));
    });
  };

  return (
    <section className="space-y-6 border-t border-black/10 pt-12">
      <div className="grid gap-4 md:grid-cols-[0.75fr_1.3fr]">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-black/45">{currentLabel}</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-[#f1ede6] px-14 py-5 md:px-20 md:py-6">
        <button
          type="button"
          aria-label="上一张"
          onClick={goPrevious}
          disabled={!canGoPrevious}
          className="absolute left-0 top-1/2 z-10 inline-flex h-full w-14 -translate-y-1/2 items-center justify-center text-xl text-black/45 transition-all duration-700 hover:text-black disabled:cursor-not-allowed disabled:opacity-20 md:w-20"
        >
          ‹
        </button>

        <button
          type="button"
          aria-label="下一张"
          onClick={goNext}
          disabled={!canGoNext}
          className="absolute right-0 top-1/2 z-10 inline-flex h-full w-14 -translate-y-1/2 items-center justify-center text-xl text-black/45 transition-all duration-700 hover:text-black disabled:cursor-not-allowed disabled:opacity-20 md:w-20"
        >
          ›
        </button>

        <button
          type="button"
          aria-label="放大预览"
          onClick={() => setIsZoomed(true)}
          className="block w-full cursor-zoom-in transition-transform duration-700 hover:scale-[1.01]"
        >
          <div className="relative mx-auto w-full max-w-5xl transition-all duration-700 ease-out">
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
      </div>

      {isZoomed ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/78 p-6"
          onClick={() => setIsZoomed(false)}
        >
          <button
            type="button"
            aria-label="关闭预览"
            onClick={() => setIsZoomed(false)}
            className="absolute right-6 top-6 text-3xl text-white/80 transition-opacity hover:opacity-60"
          >
            ×
          </button>
          <div
            className="relative max-h-full max-w-6xl overflow-auto"
            onClick={(event) => event.stopPropagation()}
            onWheel={handleWheelZoom}
          >
            {currentMedia.type === "video" ? (
              <video
                key={`${currentMedia.src}-zoomed`}
                ref={zoomedVideoRef}
                src={currentMedia.src}
                className="max-h-[88vh] h-auto w-auto origin-center object-contain transition-transform duration-300"
                style={{ transform: `scale(${zoomScale})` }}
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            ) : (
              <Image
                src={currentMedia.src}
                alt={`Zoomed ${currentAlt}`}
                width={2200}
                height={1600}
                className="max-h-[88vh] h-auto w-auto origin-center object-contain transition-transform duration-300"
                style={{ transform: `scale(${zoomScale})` }}
                unoptimized
              />
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
