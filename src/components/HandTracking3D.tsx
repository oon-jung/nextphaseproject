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

type TrackingStatus = 'idle' | 'searching' | 'detected' | 'mouse';

export const HandTracking3D = ({ className = '' }: HandTracking3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number>(0);
  const lastHandDetectedRef = useRef<number>(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>('idle');
  const [isExploded, setIsExploded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const targetScaleRef = useRef(1);
  const currentScaleRef = useRef(1);

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
      
      // Smooth scale interpolation for explode effect
      currentScaleRef.current += (targetScaleRef.current - currentScaleRef.current) * 0.15;

      if (meshRef.current) {
        // Apply hand-controlled rotation + automatic slow spin
        meshRef.current.rotation.x = currentRotationRef.current.x + Date.now() * 0.0001;
        meshRef.current.rotation.y = currentRotationRef.current.y + Date.now() * 0.0002;
        meshRef.current.scale.setScalar(currentScaleRef.current);
      }

      renderer.render(scene, camera);
    };
    animate();

    setIsLoading(false);
  }, []);

  // Detect open palm gesture
  const detectOpenPalm = useCallback((landmarks: any[]): boolean => {
    // Check if all fingers are extended by comparing fingertip Y to PIP joint Y
    const fingerTips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky tips
    const fingerPIPs = [6, 10, 14, 18]; // Corresponding PIP joints
    
    let extendedFingers = 0;
    for (let i = 0; i < fingerTips.length; i++) {
      if (landmarks[fingerTips[i]].y < landmarks[fingerPIPs[i]].y) {
        extendedFingers++;
      }
    }
    
    // Thumb check (different axis)
    if (landmarks[4].x > landmarks[3].x) {
      extendedFingers++;
    }
    
    return extendedFingers >= 4;
  }, []);

  // Trigger explode effect
  const triggerExplode = useCallback(() => {
    if (isExploded) return;
    setIsExploded(true);
    targetScaleRef.current = 1.5;
    
    setTimeout(() => {
      targetScaleRef.current = 1;
      setIsExploded(false);
    }, 500);
  }, [isExploded]);

  // Initialize MediaPipe Hand Tracking
  const initHandTracking = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      setTrackingStatus('searching');
      
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
          lastHandDetectedRef.current = Date.now();
          setTrackingStatus('detected');
          const landmarks = results.multiHandLandmarks[0];
          
          // Get wrist position (landmark 0) for rotation control
          const wrist = landmarks[0];
          
          // Map hand X position (0-1) to Y rotation (-PI to PI)
          const rotY = (wrist.x - 0.5) * Math.PI * 2;
          // Map hand Y position (0-1) to X rotation (-PI/2 to PI/2)
          const rotX = (wrist.y - 0.5) * Math.PI;

          targetRotationRef.current = { x: rotX, y: rotY };
          
          // Check for open palm gesture
          if (detectOpenPalm(landmarks)) {
            triggerExplode();
          }
        } else {
          // If no hand detected for 1 second, switch to mouse mode
          if (Date.now() - lastHandDetectedRef.current > 1000) {
            setTrackingStatus('mouse');
          } else {
            setTrackingStatus('searching');
          }
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
      setError('카메라 접근 불가 - 마우스 모드로 전환됨');
      setCameraEnabled(false);
      setTrackingStatus('mouse');
    }
  }, [detectOpenPalm, triggerExplode]);

  // Mouse fallback control - always active when no hand detected
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only use mouse when hand is not actively tracking
    if (trackingStatus === 'detected') return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    targetRotationRef.current = {
      x: (y - 0.5) * Math.PI,
      y: (x - 0.5) * Math.PI * 2,
    };
    
    if (trackingStatus === 'idle') {
      setTrackingStatus('mouse');
    }
  }, [trackingStatus]);

  // Mouse click for explode effect
  const handleMouseDown = useCallback(() => {
    if (trackingStatus !== 'detected') {
      triggerExplode();
    }
  }, [trackingStatus, triggerExplode]);

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

  // Get status indicator color
  const getStatusColor = () => {
    switch (trackingStatus) {
      case 'detected': return 'bg-neon-mint';
      case 'searching': return 'bg-neon-pink animate-pulse';
      case 'mouse': return 'bg-neon-blue';
      default: return 'bg-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (trackingStatus) {
      case 'detected': return 'HAND_DETECTED';
      case 'searching': return 'SEARCHING...';
      case 'mouse': return 'MOUSE_MODE';
      default: return 'STANDBY';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[300px] ${className}`}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
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
        className="absolute inset-0 w-full h-full cursor-pointer"
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-neon-purple" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-neon-purple" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-neon-purple" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-neon-purple" />

        {/* Status indicator dot - top right corner */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          <span className="font-mono text-xs text-muted-foreground">
            [ {getStatusText()} ]
          </span>
        </div>

        {/* Status indicators - top left */}
        <div className="absolute top-4 left-4 font-mono text-xs space-y-1">
          <div className="text-muted-foreground">
            [ HOLOGRAM: <span className="text-neon-mint">ACTIVE</span> ]
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 right-4 font-mono text-xs text-center text-muted-foreground">
          {trackingStatus === 'detected' ? (
            <span className="text-neon-mint">손을 움직여 회전 / 손바닥을 펴서 확대</span>
          ) : trackingStatus === 'searching' ? (
            <span className="text-neon-pink">손을 카메라에 보여주세요 (또는 마우스 사용)</span>
          ) : (
            <span>마우스로 회전 / 클릭으로 확대 효과</span>
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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-12 right-4 font-mono text-xs text-neon-pink bg-background/80 px-2 py-1 rounded"
        >
          {error}
        </motion.div>
      )}

      {/* Camera preview (small thumbnail) */}
      {cameraEnabled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-12 right-4 w-20 h-15 border border-neon-purple/50 overflow-hidden rounded"
        >
          <video
            ref={(el) => {
              if (el && videoRef.current) {
                el.srcObject = videoRef.current.srcObject;
                el.play();
              }
            }}
            className="w-full h-full object-cover opacity-60"
            playsInline
            muted
          />
          <div className="absolute inset-0 border border-neon-purple/30" />
          <div className="absolute bottom-0 left-0 right-0 bg-background/60 text-center">
            <span className="font-mono text-[8px] text-muted-foreground">CAM</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
