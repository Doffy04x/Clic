'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '@/lib/products';
import { useCartStore } from '@/lib/store';
import type { Product, ProductColor } from '@/lib/types';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    FaceMesh: new (config: {
      locateFile: (file: string) => string;
    }) => {
      setOptions: (options: Record<string, unknown>) => void;
      onResults: (callback: (results: FaceMeshResults) => void) => void;
      send: (inputs: { image: HTMLVideoElement }) => Promise<void>;
      close: () => void;
    };
    Camera: new (
      videoElement: HTMLVideoElement,
      config: {
        onFrame: () => Promise<void>;
        width: number;
        height: number;
      }
    ) => { start: () => void; stop: () => void };
  }
}

interface FaceLandmark {
  x: number;
  y: number;
  z: number;
}

interface FaceMeshResults {
  multiFaceLandmarks?: FaceLandmark[][];
}

// ─── Glasses SVG Overlays ─────────────────────────────────────────────────────
// Each glasses style is rendered as SVG on the canvas

const GLASSES_STYLES: Record<string, { viewBox: string; path: string }> = {
  wayfarers: {
    viewBox: '0 0 400 120',
    path: `
      M10,40 L170,40 L170,90 Q170,110 150,110 L30,110 Q10,110 10,90 Z
      M230,40 L390,40 L390,90 Q390,110 370,110 L250,110 Q230,110 230,90 Z
      M170,60 L230,60
      M5,40 L0,20 M395,40 L400,20
    `,
  },
  round: {
    viewBox: '0 0 400 120',
    path: `
      M10,60 A80,60 0 1,0 170,60 A80,60 0 1,0 10,60
      M230,60 A80,60 0 1,0 390,60 A80,60 0 1,0 230,60
      M170,65 L230,65
      M5,45 L0,20 M395,45 L400,20
    `,
  },
  aviator: {
    viewBox: '0 0 400 140',
    path: `
      M15,30 L165,30 L185,120 Q180,135 155,135 L30,135 Q5,135 15,120 Z
      M235,30 L385,30 L385,120 Q385,135 360,135 L215,135 Q190,135 215,120 Z
      M165,50 L235,50
      M10,30 L0,10 M390,30 L400,10
    `,
  },
  catEye: {
    viewBox: '0 0 400 120',
    path: `
      M10,70 L140,20 L175,40 L175,100 Q175,115 150,115 L35,115 Q10,115 10,95 Z
      M225,40 L260,20 L390,70 L390,95 Q390,115 365,115 L250,115 Q225,115 225,100 Z
      M175,70 L225,70
      M8,72 L0,20 M392,72 L400,20
    `,
  },
  square: {
    viewBox: '0 0 400 120',
    path: `
      M10,30 L175,30 L175,105 L10,105 Z
      M225,30 L390,30 L390,105 L225,105 Z
      M175,65 L225,65
      M5,35 L0,10 M395,35 L400,10
    `,
  },
  // Octagonal / geometric — matches Wooby-style frames
  geometric: {
    viewBox: '0 0 400 120',
    path: `
      M30,30 L155,30 L175,45 L175,95 L155,110 L30,110 L10,95 L10,45 Z
      M245,30 L370,30 L390,45 L390,95 L370,110 L245,110 L225,95 L225,45 Z
      M175,65 L225,65
      M5,50 L0,20 M395,50 L400,20
    `,
  },
};

// ─── Image Cache (preloaded try-on PNGs) ─────────────────────────────────────

const imageCache: Record<string, HTMLImageElement> = {};

function loadTryOnImage(src: string): HTMLImageElement | null {
  if (imageCache[src]) return imageCache[src];
  if (typeof window === 'undefined') return null;
  const img = new Image();
  img.src = src;
  img.onload = () => { imageCache[src] = img; };
  return null; // not ready yet — will be ready on next frame
}

// ─── Canvas Drawing ───────────────────────────────────────────────────────────

function drawGlassesOnFace(
  ctx: CanvasRenderingContext2D,
  landmarks: FaceLandmark[],
  canvasWidth: number,
  canvasHeight: number,
  color: string,
  glassesStyle: string,
  tryOnImage?: string,
) {
  // Key landmark indices from MediaPipe FaceMesh
  const leftEyeOuter = landmarks[33];   // Left eye outer corner
  const rightEyeOuter = landmarks[263]; // Right eye outer corner
  const leftEyeInner = landmarks[133];  // Left eye inner corner
  const rightEyeInner = landmarks[362]; // Right eye inner corner
  const noseTip = landmarks[1];         // Nose tip
  const noseTop = landmarks[168];       // Nose bridge

  if (!leftEyeOuter || !rightEyeOuter) return;

  // Calculate positions in pixel space
  const lx = leftEyeOuter.x * canvasWidth;
  const ly = leftEyeOuter.y * canvasHeight;
  const rx = rightEyeOuter.x * canvasWidth;
  const ry = rightEyeOuter.y * canvasHeight;

  // Eye distance = glasses width reference
  const eyeDistance = Math.sqrt(Math.pow(rx - lx, 2) + Math.pow(ry - ly, 2));
  const glassesWidth = eyeDistance * 1.65;
  const glassesHeight = glassesWidth * 0.35;

  // Center of the glasses (between eyes)
  const centerX = (lx + rx) / 2;
  const centerY = (ly + ry) / 2;

  // Rotation angle
  const angle = Math.atan2(ry - ly, rx - lx);

  // ── PNG image overlay (real product try-on) ─────────────────────────────
  if (tryOnImage) {
    const img = loadTryOnImage(tryOnImage);
    if (img && img.complete && img.naturalWidth > 0) {
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const drawW = glassesWidth * 1.08;
      const drawH = drawW / imgAspect;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
      return;
    }
    loadTryOnImage(tryOnImage);
  }

  // Parse hex color to rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);

  // Scale factor based on style
  const styles = GLASSES_STYLES[glassesStyle] || GLASSES_STYLES.wayfarers;

  // Draw frame outline
  const scaleX = glassesWidth / 400;
  const scaleY = glassesHeight / (parseFloat(styles.viewBox.split(' ')[3]) || 120);

  ctx.scale(scaleX, scaleY);
  ctx.translate(-200, -60);

  // Create path from style
  const p = new Path2D(styles.path);

  // Frame fill (semi-transparent)
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.15)`;
  ctx.fill(p);

  // Frame stroke
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.9)`;
  ctx.lineWidth = 4 / scaleX;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke(p);

  // Gold hinges
  ctx.fillStyle = '#C9A84C';
  ctx.fillRect(168, 55, 8, 16);
  ctx.fillRect(224, 55, 8, 16);

  ctx.restore();
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VirtualTryOnPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceMeshRef = useRef<ReturnType<typeof window.FaceMesh> | null>(null);
  const cameraRef = useRef<ReturnType<typeof window.Camera> | null>(null);
  const animFrameRef = useRef<number>(0);

  const [status, setStatus] = useState<'idle' | 'loading' | 'active' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(PRODUCTS[0].colors[0]);
  const [faceDetected, setFaceDetected] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // Live refs so the drawing callbacks always read the latest selection
  // (avoids stale closure inside faceMesh.onResults / requestAnimationFrame)
  const selectedProductRef = useRef<Product>(PRODUCTS[0]);
  const selectedColorRef = useRef<ProductColor>(PRODUCTS[0].colors[0]);

  useEffect(() => {
    selectedProductRef.current = selectedProduct;
    // Preload PNG overlay so it's ready on first frame
    if (selectedProduct.tryOnImage) {
      const img = new Image();
      img.src = selectedProduct.tryOnImage;
      img.onload = () => { imageCache[selectedProduct.tryOnImage!] = img; };
    }
  }, [selectedProduct]);
  useEffect(() => { selectedColorRef.current = selectedColor; }, [selectedColor]);

  const { addItem } = useCartStore();

  // ── Load MediaPipe scripts ────────────────────────────────────────────────

  useEffect(() => {
    const loadScripts = async () => {
      const scripts = [
        'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js',
      ];

      let loaded = 0;
      for (const src of scripts) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = src;
          script.crossOrigin = 'anonymous';
          script.onload = () => { loaded++; resolve(); };
          script.onerror = () => resolve();
          document.head.appendChild(script);
        });
      }
      setScriptsLoaded(loaded > 0);
    };

    loadScripts();
  }, []);

  // ── Start Try-On ─────────────────────────────────────────────────────────

  const startTryOn = useCallback(async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      // Request camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise<void>((res) => {
          videoRef.current!.onloadeddata = () => res();
        });
        await videoRef.current.play();
      }

      if (canvasRef.current && videoRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth || 640;
        canvasRef.current.height = videoRef.current.videoHeight || 480;
      }

      // Use MediaPipe if available, otherwise use simple drawing
      if (scriptsLoaded && window.FaceMesh && window.Camera && videoRef.current) {
        const faceMesh = new window.FaceMesh({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results: FaceMeshResults) => {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          if (!canvas || !video) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Always read the LATEST product/color through refs — never stale
          const product = selectedProductRef.current;
          const color = selectedColorRef.current;

          if (results.multiFaceLandmarks?.length) {
            setFaceDetected(true);
            const glassesStyle =
              product.frameShape === 'round' ? 'round'
              : product.frameShape === 'aviator' ? 'aviator'
              : product.frameShape === 'cat-eye' ? 'catEye'
              : product.frameShape === 'square' ? 'square'
              : product.frameShape === 'oversized' ? 'wayfarers'
              : product.frameShape === 'browline' ? 'wayfarers'
              : product.frameShape === 'rectangle' ? 'square'
              : product.frameShape === 'geometric' ? 'geometric'
              : 'wayfarers';

            for (const landmarks of results.multiFaceLandmarks) {
              drawGlassesOnFace(
                ctx,
                landmarks,
                canvas.width,
                canvas.height,
                color.hex,
                glassesStyle,
                product.tryOnImage,
              );
            }
          } else {
            setFaceDetected(false);
          }
        });

        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && faceMeshRef.current) {
              await faceMeshRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        faceMeshRef.current = faceMesh;
        cameraRef.current = camera;
        camera.start();
      } else {
        // Fallback: simple glasses overlay without face detection
        const drawFallback = () => {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          if (!canvas || !video) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw placeholder glasses in center of frame
          const centerX = canvas.width / 2;
          const centerY = canvas.height * 0.42;
          const glassesWidth = canvas.width * 0.45;
          const glassesHeight = glassesWidth * 0.3;

          // Read latest color through ref — no stale closure
          const currentHex = selectedColorRef.current.hex;
          const r = parseInt(currentHex.slice(1, 3), 16);
          const g = parseInt(currentHex.slice(3, 5), 16);
          const b = parseInt(currentHex.slice(5, 7), 16);

          // Left lens
          ctx.beginPath();
          ctx.ellipse(centerX - glassesWidth * 0.27, centerY, glassesWidth * 0.2, glassesHeight * 0.5, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`;
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.fillStyle = `rgba(${r},${g},${b},0.1)`;
          ctx.fill();

          // Right lens
          ctx.beginPath();
          ctx.ellipse(centerX + glassesWidth * 0.27, centerY, glassesWidth * 0.2, glassesHeight * 0.5, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fill();

          // Bridge
          ctx.beginPath();
          ctx.moveTo(centerX - glassesWidth * 0.07, centerY);
          ctx.lineTo(centerX + glassesWidth * 0.07, centerY);
          ctx.stroke();

          // Arms
          ctx.beginPath();
          ctx.moveTo(centerX - glassesWidth * 0.47, centerY);
          ctx.lineTo(centerX - glassesWidth * 0.5, centerY - glassesHeight * 0.1);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(centerX + glassesWidth * 0.47, centerY);
          ctx.lineTo(centerX + glassesWidth * 0.5, centerY - glassesHeight * 0.1);
          ctx.stroke();

          animFrameRef.current = requestAnimationFrame(drawFallback);
        };

        setFaceDetected(true); // show as "positioned"
        drawFallback();
      }

      setStatus('active');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to access camera';
      setErrorMessage(
        msg.includes('Permission') || msg.includes('NotAllowed')
          ? 'Accès à la caméra refusé. Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.'
          : msg.includes('NotFound') || msg.includes('Requested device') || msg.includes('Could not start')
          ? 'Aucune caméra trouvée. Veuillez connecter une webcam et réessayer.'
          : `Erreur caméra : ${msg}`,
      );
      setStatus('error');
    }
  }, [scriptsLoaded]);

  // ── Stop Try-On ──────────────────────────────────────────────────────────

  const stopTryOn = useCallback(() => {
    cameraRef.current?.stop();
    faceMeshRef.current?.close();
    cameraRef.current = null;
    faceMeshRef.current = null;

    cancelAnimationFrame(animFrameRef.current);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    setStatus('idle');
    setFaceDetected(false);
    setScreenshot(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTryOn();
    };
  }, [stopTryOn]);

  // ── Take Screenshot ──────────────────────────────────────────────────────

  const takeScreenshot = useCallback(() => {
    const video = videoRef.current;
    const overlay = canvasRef.current;
    if (!video || !overlay) return;

    // Create composite canvas
    const composite = document.createElement('canvas');
    composite.width = overlay.width;
    composite.height = overlay.height;
    const ctx = composite.getContext('2d');
    if (!ctx) return;

    // Mirror video (selfie mode)
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -overlay.width, 0, overlay.width, overlay.height);
    ctx.restore();

    // Draw glasses overlay
    ctx.drawImage(overlay, 0, 0);

    // Add watermark
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(10, overlay.height - 35, 130, 25);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('Clic Optique – Try On', 18, overlay.height - 18);

    const dataUrl = composite.toDataURL('image/png', 0.95);
    setScreenshot(dataUrl);
  }, []);

  // ── Share to Instagram ───────────────────────────────────────────────────

  const shareScreenshot = useCallback(async () => {
    if (!screenshot) return;
    try {
      const blob = await fetch(screenshot).then((r) => r.blob());
      const file = new File([blob], 'clic-optique-try-on.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Mon essayage Clic Optique', text: 'Regardez mes nouvelles lunettes ! 👓 #ClicOptique' });
      } else {
        const a = document.createElement('a');
        a.href = screenshot;
        a.download = 'clic-optique-try-on.png';
        a.click();
      }
    } catch {
      toast.error('Impossible de partager l\'image');
    }
  }, [screenshot]);

  return (
    <div className="pt-20 min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 py-6">
        <div className="container-default">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl md:text-3xl">
                Essayage virtuel
                <span className="ml-3 text-xs font-normal bg-gold-500 text-black px-2 py-0.5 align-middle">
                  Propulsé par IA
                </span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Essayez n&apos;importe quelle monture en temps réel
              </p>
            </div>
            <Link href="/shop" className="btn-outline border-white text-white hover:bg-white hover:text-black text-sm px-4 py-2">
              ← Boutique
            </Link>
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* ── Camera Feed ────────────────────────────────────────────── */}
          <div className="xl:col-span-2">

            {/* Status Indicator */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full ${
                status === 'active'
                  ? 'bg-green-500/20 text-green-400'
                  : status === 'loading'
                  ? 'bg-gold-500/20 text-gold-400'
                  : status === 'error'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-white/10 text-gray-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  status === 'active' ? 'bg-green-400 animate-pulse'
                  : status === 'loading' ? 'bg-gold-400 animate-pulse'
                  : status === 'error' ? 'bg-red-400'
                  : 'bg-gray-500'
                }`} />
                {status === 'active' ? (faceDetected ? 'Visage détecté ✓' : 'Recherche d\'un visage…')
                  : status === 'loading' ? 'Démarrage de la caméra…'
                  : status === 'error' ? 'Erreur'
                  : 'Caméra éteinte'}
              </span>
            </div>

            {/* Video Container */}
            <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden border border-white/10">

              {/* Video (mirrored) */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
                playsInline
                muted
              />

              {/* Canvas overlay (glasses drawn here) */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ transform: 'scaleX(-1)' }}
              />

              {/* Idle Overlay */}
              {status === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/80">
                  <div className="w-24 h-24 border-2 border-white/30 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-xl mb-2">Lancer l&apos;essayage virtuel</p>
                    <p className="text-gray-400 text-sm max-w-xs">
                      Nous accéderons à votre caméra pour superposer des lunettes en temps réel.
                      Aucune donnée n&apos;est stockée ni envoyée vers un serveur.
                    </p>
                  </div>
                  <button
                    onClick={startTryOn}
                    className="btn-gold px-8 py-4 text-base"
                  >
                    Autoriser la caméra et démarrer
                  </button>
                  <p className="text-xs text-gray-600 text-center max-w-xs">
                    🔒 Votre flux vidéo est traité entièrement sur votre appareil. Aucune image n&apos;est téléchargée.
                  </p>
                </div>
              )}

              {/* Loading Overlay */}
              {status === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60">
                  <div className="w-12 h-12 border-3 border-gold-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-300">Initialisation de la détection IA…</p>
                </div>
              )}

              {/* Error Overlay */}
              {status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 p-6 text-center">
                  <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <p className="text-red-400 font-medium">{errorMessage}</p>
                  <button onClick={startTryOn} className="btn-gold text-sm px-6 py-2">
                    Réessayer
                  </button>
                </div>
              )}

              {/* Active: Screenshot preview */}
              {screenshot && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-4 w-32 h-24 border-2 border-gold-500 overflow-hidden shadow-gold cursor-pointer"
                  onClick={() => setScreenshot(null)}
                >
                  <img src={screenshot} alt="Screenshot" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-white text-center py-0.5">
                    Cliquer pour fermer
                  </div>
                </motion.div>
              )}

              {/* Guide frame overlay */}
              {status === 'active' && !screenshot && (
                <div className="absolute inset-8 border border-white/10 rounded-full pointer-events-none" />
              )}
            </div>

            {/* Controls Bar */}
            {status === 'active' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-4 mt-4"
              >
                <button
                  onClick={takeScreenshot}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors rounded-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                  Prendre une photo
                </button>

                {screenshot && (
                  <button
                    onClick={shareScreenshot}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-black text-sm font-semibold hover:bg-gold-400 transition-colors rounded-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                    Partager
                  </button>
                )}

                <button
                  onClick={stopTryOn}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors rounded-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                  </svg>
                  Arrêter
                </button>
              </motion.div>
            )}
          </div>

          {/* ── Glasses Selector Panel ──────────────────────────────────── */}
          <div className="space-y-6">

            {/* Current selection info */}
            {status === 'active' && (
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <div className="flex gap-3 items-center">
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-16 h-12 object-cover bg-white/10 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{selectedProduct.name}</p>
                    <p className="text-xs text-gray-400">{selectedProduct.brand}</p>
                    <p className="text-gold-400 font-semibold text-sm mt-0.5">
                      {selectedProduct.price}€
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    addItem(selectedProduct, selectedColor, selectedProduct.lensOptions[0]);
                    toast.success('Ajouté au panier !');
                  }}
                  className="btn-gold w-full mt-3 text-sm py-2.5"
                >
                  Ajouter au panier
                </button>
              </div>
            )}

            {/* Color selector */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Couleur de la monture
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor.name === color.name
                        ? 'border-gold-500 scale-110'
                        : 'border-transparent hover:border-white/40'
                    }`}
                    style={{ background: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Frame selector */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Choisir une monture
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scroll">
                {PRODUCTS.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedColor(product.colors[0]);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all border ${
                      selectedProduct.id === product.id
                        ? 'border-gold-500 bg-gold-500/10'
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-10 object-cover rounded bg-white/10 flex-shrink-0"
                    />
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-gray-400 capitalize">
                        {product.frameShape} · {product.price}€
                      </p>
                    </div>
                    {selectedProduct.id === product.id && (
                      <span className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                💡 Conseils pour de meilleurs résultats
              </h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-gold-400 mt-0.5">•</span>
                  Un bon éclairage face à vous donne les meilleurs résultats
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-400 mt-0.5">•</span>
                  Centrez votre visage dans le cadre
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-400 mt-0.5">•</span>
                  Retirez vos lunettes actuelles pour une meilleure détection
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-400 mt-0.5">•</span>
                  Regardez directement dans la caméra
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
