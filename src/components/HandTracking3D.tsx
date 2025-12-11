import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Declare MediaPipe types
declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

interface HandTracking3DProps {
  className?: string;
}

export const HandTracking3D = ({ className = '' }: HandTracking3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number>(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });

  // Initialize Three.js scene
  const initThreeJS = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create holographic wireframe sphere (Data Crystal)
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xb69aff,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    // Inner sphere with different color
    const innerGeometry = new THREE.IcosahedronGeometry(1, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x2E59FF,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    mesh.add(innerMesh);

    // Outer ring
    const ringGeometry = new THREE.TorusGeometry(2.2, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF0099,
      transparent: true,
      opacity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    mesh.add(ring);

    // Second ring at different angle
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial.clone());
    ring2.rotation.x = Math.PI / 2;
    mesh.add(ring2);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Smooth interpolation toward target rotation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;

      if (meshRef.current) {
        // Apply hand-controlled rotation + automatic slow spin
        meshRef.current.rotation.x = currentRotationRef.current.x + Date.now() * 0.0001;
        meshRef.current.rotation.y = currentRotationRef.current.y + Date.now() * 0.0002;
      }

      renderer.render(scene, camera);
    };
    animate();

    setIsLoading(false);
  }, []);

  // Initialize MediaPipe Hand Tracking
  const initHandTracking = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCameraEnabled(true);

      // Load MediaPipe scripts dynamically
      const loadScript = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');

      // Initialize Hands
      const hands = new window.Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results: any) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          setHandDetected(true);
          const landmarks = results.multiHandLandmarks[0];
          
          // Get wrist position (landmark 0) for rotation control
          const wrist = landmarks[0];
          
          // Map hand X position (0-1) to Y rotation (-PI to PI)
          const rotY = (wrist.x - 0.5) * Math.PI * 2;
          // Map hand Y position (0-1) to X rotation (-PI/2 to PI/2)
          const rotX = (wrist.y - 0.5) * Math.PI;

          targetRotationRef.current = { x: rotX, y: rotY };
        } else {
          setHandDetected(false);
        }
      });

      // Start camera processing
      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 320,
        height: 240,
      });
      camera.start();

    } catch (err) {
      console.error('Hand tracking error:', err);
      setError('Camera access denied. Using mouse control.');
      setCameraEnabled(false);
    }
  }, []);

  // Mouse fallback control
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (cameraEnabled && handDetected) return; // Skip if hand is tracking

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    targetRotationRef.current = {
      x: (y - 0.5) * Math.PI,
      y: (x - 0.5) * Math.PI * 2,
    };
  }, [cameraEnabled, handDetected]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize
  useEffect(() => {
    initThreeJS();
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [initThreeJS]);

  const handleEnableCamera = () => {
    initHandTracking();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[300px] ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Hidden video element for camera feed */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
      />

      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-neon-purple" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-neon-purple" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-neon-purple" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-neon-purple" />

        {/* Status indicators */}
        <div className="absolute top-4 left-4 font-mono text-xs space-y-1">
          <div className="text-muted-foreground">
            [ HOLOGRAM_RENDER: <span className="text-neon-mint">ACTIVE</span> ]
          </div>
          {cameraEnabled && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={handDetected ? 'text-neon-mint' : 'text-neon-pink'}
            >
              [ HAND_TRACK: {handDetected ? 'DETECTED' : 'SEARCHING...'} ]
            </motion.div>
          )}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 right-4 font-mono text-xs text-center text-muted-foreground">
          {cameraEnabled ? (
            handDetected ? (
              <span className="text-neon-mint">손을 움직여 홀로그램을 회전시키세요</span>
            ) : (
              <span className="text-neon-pink">손을 카메라에 보여주세요</span>
            )
          ) : (
            <span>마우스를 움직여 홀로그램을 회전시키세요</span>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/50">
          <div className="font-mono text-sm text-neon-purple animate-pulse">
            INITIALIZING_HOLOGRAM...
          </div>
        </div>
      )}

      {/* Camera enable button */}
      {!cameraEnabled && !isLoading && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleEnableCamera}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto
                     px-4 py-2 bg-neon-purple/20 border border-neon-purple/50 
                     font-mono text-xs text-neon-purple hover:bg-neon-purple/30 
                     transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.3)]"
        >
          [ ENABLE_HAND_TRACKING ]
        </motion.button>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-4 right-4 font-mono text-xs text-neon-pink">
          {error}
        </div>
      )}

      {/* Camera preview (small thumbnail) */}
      {cameraEnabled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-4 right-4 w-24 h-18 border border-neon-purple/50 overflow-hidden"
        >
          <video
            ref={(el) => {
              if (el && videoRef.current) {
                el.srcObject = videoRef.current.srcObject;
                el.play();
              }
            }}
            className="w-full h-full object-cover opacity-50"
            playsInline
            muted
          />
          <div className="absolute inset-0 border border-neon-purple/30" />
        </motion.div>
      )}
    </div>
  );
};