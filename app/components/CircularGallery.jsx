"use client";

import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
} from "ogl";
import { useEffect, useRef } from "react";
import "./CircularGallery.css";

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function getFontSize(font) {
  const match = font.match(/(\d+)px/);
  return match ? Number.parseInt(match[1], 10) : 28;
}

function createTextTexture(gl, text, font, color) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return { texture: new Texture(gl), width: 1, height: 1 };
  }

  context.font = font;
  const metrics = context.measureText(text);
  const width = Math.ceil(metrics.width) + 32;
  const height = Math.ceil(getFontSize(font) * 1.45) + 20;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  context.scale(pixelRatio, pixelRatio);
  context.font = font;
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.clearRect(0, 0, width, height);
  context.fillText(text, width / 2, height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;

  return { texture, width, height };
}

class GalleryTitle {
  constructor({ gl, plane, text, textColor, font }) {
    const { texture, width, height } = createTextTexture(
      gl,
      text,
      font,
      textColor,
    );
    const geometry = new Plane(gl);
    const program = new Program(gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;

        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });

    this.mesh = new Mesh(gl, { geometry, program });
    const textHeight = plane.scale.y * 0.145;
    const textWidth = textHeight * (width / height);
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -plane.scale.y * 0.5 - textHeight * 0.62;
    this.mesh.setParent(plane);
  }
}

class GalleryMedia {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius,
    font,
    requestRender,
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.requestRender = requestRender;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (
            sin(p.x * 4.0 + uTime) * 1.5 +
            cos(p.y * 2.0 + uTime) * 1.5
          ) * (0.1 + abs(uSpeed) * 0.42);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) +
            min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min(
              (uPlaneSizes.x / uPlaneSizes.y) /
              (uImageSizes.x / uImageSizes.y),
              1.0
            ),
            min(
              (uPlaneSizes.y / uPlaneSizes.x) /
              (uImageSizes.y / uImageSizes.x),
              1.0
            )
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(
            vUv - 0.5,
            vec2(0.5 - uBorderRadius),
            uBorderRadius
          );
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [1, 1] },
        uImageSizes: { value: [1, 1] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    const image = new Image();
    image.decoding = "async";
    image.src = this.image;
    image.onload = () => {
      texture.image = image;
      this.program.uniforms.uImageSizes.value = [
        image.naturalWidth,
        image.naturalHeight,
      ];
      this.requestRender();
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new GalleryTitle({
      gl: this.gl,
      plane: this.plane,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(scroll, direction, reducedMotion) {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const halfWidth = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const bend = Math.abs(this.bend);
      const radius = (halfWidth * halfWidth + bend * bend) / (2 * bend);
      const effectiveX = Math.min(Math.abs(x), halfWidth);
      const arc =
        radius - Math.sqrt(Math.max(0, radius * radius - effectiveX * effectiveX));

      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z =
          -Math.sign(x) * Math.asin(effectiveX / radius);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z =
          Math.sign(x) * Math.asin(effectiveX / radius);
      }
    }

    const speed = scroll.current - scroll.last;
    this.program.uniforms.uSpeed.value = reducedMotion ? 0 : speed;

    if (!reducedMotion) {
      this.program.uniforms.uTime.value += 0.04;
    }

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    const isBefore =
      this.plane.position.x + planeOffset < -viewportOffset;
    const isAfter =
      this.plane.position.x - planeOffset > viewportOffset;

    if (direction === "right" && isBefore) {
      this.extra -= this.widthTotal;
    }

    if (direction === "left" && isAfter) {
      this.extra += this.widthTotal;
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    const scale = this.screen.height / 1500;
    this.plane.scale.y =
      (this.viewport.height * (900 * scale)) / this.screen.height;
    this.plane.scale.x =
      (this.viewport.width * (700 * scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class CircularGalleryApp {
  constructor(
    container,
    {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
    },
  ) {
    this.container = container;
    this.items = items;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.isActive = true;
    this.isVisible = true;
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    this.onResize = this.onResize.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.update = this.update.bind(this);
    this.requestRender = this.requestRender.bind(this);
    this.lastFrameTime = 0;
    this.isInViewport = true;
    this.raf = 0;

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias();
    this.addEventListeners();
    this.requestRender();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 1.35),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.canvas.setAttribute("aria-hidden", "true");
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, {
      heightSegments: 24,
      widthSegments: 48,
    });
  }

  createMedias() {
    const galleryItems = this.items.length
      ? this.items
      : [
          {
            image: "/media/storybook-learning.jpg",
            text: "Professional Knowledge",
          },
          {
            image: "/media/children-creating-together.jpg",
            text: "Professional Practice",
          },
          {
            image: "/media/children-exploring-together.jpg",
            text: "Professional Engagement",
          },
        ];
    const loopedItems = galleryItems.concat(galleryItems);

    this.medias = loopedItems.map(
      (item, index) =>
        new GalleryMedia({
          geometry: this.geometry,
          gl: this.gl,
          image: item.image,
          index,
          length: loopedItems.length,
          scene: this.scene,
          screen: this.screen,
          text: item.text,
          viewport: this.viewport,
          bend: this.bend,
          textColor: this.textColor,
          borderRadius: this.borderRadius,
          font: this.font,
          requestRender: this.requestRender,
        }),
    );
  }

  onResize() {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.screen = { width, height };
    this.renderer?.setSize(width, height);

    if (this.camera) {
      this.camera.perspective({ aspect: width / height });
      const fov = (this.camera.fov * Math.PI) / 180;
      const viewportHeight =
        2 * Math.tan(fov / 2) * this.camera.position.z;
      this.viewport = {
        width: viewportHeight * this.camera.aspect,
        height: viewportHeight,
      };
    }

    this.medias?.forEach((media) =>
      media.onResize({ screen: this.screen, viewport: this.viewport }),
    );
    this.requestRender();
  }

  onPointerDown(event) {
    this.isDown = true;
    this.pointerStart = event.clientX;
    this.scrollStart = this.scroll.current;
    this.container.setPointerCapture?.(event.pointerId);
    this.requestRender();
  }

  onPointerMove(event) {
    if (!this.isDown) return;
    const distance =
      (this.pointerStart - event.clientX) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scrollStart + distance;
    this.requestRender();
  }

  onPointerUp(event) {
    this.isDown = false;
    this.container.releasePointerCapture?.(event.pointerId);
    this.snapToNearest();
    this.requestRender();
  }

  onWheel(event) {
    this.scroll.target +=
      (event.deltaY > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    window.clearTimeout(this.snapTimer);
    this.snapTimer = window.setTimeout(() => this.snapToNearest(), 160);
    this.requestRender();
  }

  onKeyDown(event) {
    if (!["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
    event.preventDefault();

    if (event.key === "Home") {
      this.scroll.target = 0;
    } else {
      this.scroll.target +=
        event.key === "ArrowRight"
          ? this.scrollSpeed * 5
          : -this.scrollSpeed * 5;
    }

    this.snapToNearest();
    this.requestRender();
  }

  snapToNearest() {
    const width = this.medias?.[0]?.width;
    if (!width) return;
    this.scroll.target =
      Math.round(this.scroll.target / width) * width;
  }

  focusItem(index) {
    const width = this.medias?.[0]?.width;
    if (!width) return;

    const safeIndex = Math.max(
      0,
      Math.min(Number(index) || 0, Math.max(this.items.length - 1, 0)),
    );
    this.scroll.target = safeIndex * width;

    if (this.reducedMotion) {
      this.scroll.current = this.scroll.target;
    }

    this.requestRender();
  }

  requestRender() {
    if (
      !this.isActive ||
      !this.isVisible ||
      this.raf ||
      !this.renderer ||
      !this.scene ||
      !this.camera
    ) return;

    this.raf = window.requestAnimationFrame(this.update);
  }

  update(time = 0) {
    this.raf = 0;

    if (!this.isActive || !this.isVisible) {
      return;
    }

    if (
      time &&
      this.lastFrameTime &&
      time - this.lastFrameTime < 1000 / 45
    ) {
      this.requestRender();
      return;
    }

    this.lastFrameTime = time;
    this.scroll.current = this.reducedMotion
      ? this.scroll.target
      : lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction =
      this.scroll.current > this.scroll.last ? "right" : "left";
    this.medias?.forEach((media) =>
      media.update(this.scroll, direction, this.reducedMotion),
    );
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;

    const isSettling =
      Math.abs(this.scroll.target - this.scroll.current) > 0.002;

    if (!this.reducedMotion && (this.isDown || isSettling)) {
      this.requestRender();
    }
  }

  setVisible(isVisible) {
    this.isVisible = isVisible;

    if (isVisible && !this.raf) {
      this.requestRender();
    } else if (!isVisible && this.raf) {
      window.cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  onVisibilityChange() {
    this.setVisible(this.isInViewport && !document.hidden);
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize, { passive: true });
    this.container.addEventListener("wheel", this.onWheel, { passive: true });
    this.container.addEventListener("pointerdown", this.onPointerDown);
    this.container.addEventListener("pointermove", this.onPointerMove);
    this.container.addEventListener("pointerup", this.onPointerUp);
    this.container.addEventListener("pointercancel", this.onPointerUp);
    this.container.addEventListener("keydown", this.onKeyDown);
    document.addEventListener(
      "visibilitychange",
      this.onVisibilityChange,
    );

    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.isInViewport = entry.isIntersecting;
        this.setVisible(entry.isIntersecting && !document.hidden);
      },
      { rootMargin: "160px 0px" },
    );
    this.observer.observe(this.container);
  }

  destroy() {
    this.isActive = false;
    window.clearTimeout(this.snapTimer);
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    this.container.removeEventListener("wheel", this.onWheel);
    this.container.removeEventListener("pointerdown", this.onPointerDown);
    this.container.removeEventListener("pointermove", this.onPointerMove);
    this.container.removeEventListener("pointerup", this.onPointerUp);
    this.container.removeEventListener("pointercancel", this.onPointerUp);
    this.container.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener(
      "visibilitychange",
      this.onVisibilityChange,
    );
    this.observer?.disconnect();
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
    this.gl?.canvas?.remove();
  }
}

export default function CircularGallery({
  items = [],
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = '500 28px "Iowan Old Style"',
  scrollSpeed = 2,
  scrollEase = 0.05,
  focusIndex = 0,
}) {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    let gallery;

    try {
      gallery = new CircularGalleryApp(containerRef.current, {
        items,
        bend,
        textColor,
        borderRadius,
        font,
        scrollSpeed,
        scrollEase,
      });
      galleryRef.current = gallery;
    } catch {
      containerRef.current.classList.add("is-unavailable");
    }

    return () => {
      galleryRef.current = null;
      gallery?.destroy();
    };
  }, [
    items,
    bend,
    textColor,
    borderRadius,
    font,
    scrollSpeed,
    scrollEase,
  ]);

  useEffect(() => {
    galleryRef.current?.focusItem(focusIndex);
  }, [focusIndex]);

  return (
    <div
      className="circular-gallery"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="APST evidence gallery. Drag, scroll, or use the left and right arrow keys to navigate."
    />
  );
}
