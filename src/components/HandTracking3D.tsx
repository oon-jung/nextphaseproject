import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

export const HandTracking3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const lastHandDetectedRef = useRef(Date.now());
  
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<'searching' | 'detected' | 'mouse'>('mouse');
  const [error, setError] = useState<string | null>(null);

  const detectOpenPalm = useCallback((landmarks: any[]) => {
    if (!landmarks || landmarks.length < 21) return false;
    const fingerTips = [8, 12, 16, 20];
    const fingerBases = [5, 9, 13, 17];
    let extendedFingers = 0;
    
    for (let i = 0; i < fingerTips.length; i++) {
      if (landmarks[fingerTips[i]].y < landmarks[fingerBases[i]].y) {
        extendedFingers++;
      }
    }
    return extendedFingers >= 4;
  }, []);

  const triggerExplode = useCallback(() => {
    // Explosion effect placeholder
    console.log('Open palm detected - explosion triggered');
  }, []);

  const initHandTracking = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      setTrackingStatus('searching');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCameraEnabled(true);

      if (!window.Hands) {
        throw new Error("MediaPipe Hands not loaded yet. Refresh the page.");
      }

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
          
          const wrist = landmarks[0];
          const rotY = (wrist.x - 0.5) * Math.PI * 2;
          const rotX = (wrist.y - 0.5) * Math.PI;

          targetRotationRef.current = { x: rotX, y: rotY };
          
          if (detectOpenPalm(landmarks)) {
            triggerExplode();
          }
        } else {
          if (Date.now() - lastHandDetectedRef.current > 1000) {
            setTrackingStatus('mouse');
          } else {
            setTrackingStatus('searching');
          }
        }
      });

      if (window.Camera) {
        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && hands) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: 320,
          height: 240,
        });
        camera.start();
      } else {
        const detectLoop = async () => {
          if (videoRef.current && hands) {
            await hands.send({ image: videoRef.current });
          }
          requestAnimationFrame(detectLoop);
        };
        detectLoop();
      }

    } catch (err) {
      console.error('Hand tracking error:', err);
      setError('카메라/모델 로드 실패 - 마우스 모드로 전환');
      setCameraEnabled(false);
      setTrackingStatus('mouse');
    }
  }, [detectOpenPalm, triggerExplode]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create wireframe sphere
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xb69aff,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (sphereRef.current) {
        sphereRef.current.rotation.x += (targetRotationRef.current.x - sphereRef.current.rotation.x) * 0.05;
        sphereRef.current.rotation.y += (targetRotationRef.current.y - sphereRef.current.rotation.y) * 0.05;
        sphereRef.current.rotation.z += 0.002;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Mouse fallback
    const handleMouseMove = (e: MouseEvent) => {
      if (trackingStatus === 'mouse' && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        targetRotationRef.current = { x: y * 0.5, y: x * 0.5 };
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [trackingStatus]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <video ref={videoRef} className="hidden" playsInline muted />
      
      {error && (
        <div className="absolute bottom-4 left-4 text-xs text-destructive font-mono">
          {error}
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground">
        {trackingStatus === 'detected' && <span className="text-neon-mint">● HAND DETECTED</span>}
        {trackingStatus === 'searching' && <span className="text-yellow-500">○ SEARCHING...</span>}
        {trackingStatus === 'mouse' && <span className="text-muted-foreground">◇ MOUSE MODE</span>}
      </div>
      
      {!cameraEnabled && (
        <button
          onClick={initHandTracking}
          className="absolute top-4 right-4 px-3 py-1 text-xs font-mono border border-neon-purple text-neon-purple hover:bg-neon-purple/10 transition-colors"
        >
          ENABLE HAND TRACKING
        </button>
      )}
    </div>
  );
};
