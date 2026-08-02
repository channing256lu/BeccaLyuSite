"use client";

import { useEffect, useRef } from "react";
import "./ScrollVideo.css";

export function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const syncPlayback = () => {
      if (document.hidden || reduceMotion.matches) {
        video.pause();
        return;
      }

      video.playbackRate = 1.08;
      void video.play().catch(() => {
        // Muted autoplay may still be deferred by a device's media policy.
      });
    };

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    reduceMotion.addEventListener("change", syncPlayback);

    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      reduceMotion.removeEventListener("change", syncPlayback);
    };
  }, []);

  return (
    <div className="scroll-video-background" aria-hidden="true">
      <video
        ref={videoRef}
        className="scroll-video-element"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/og.png"
        disablePictureInPicture
        tabIndex={-1}
      >
        <source
          src="/media/background-scroll-optimized.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}
