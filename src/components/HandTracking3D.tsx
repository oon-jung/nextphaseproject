// initHandTracking 함수 전체를 이걸로 교체하세요
const initHandTracking = useCallback(async () => {
  if (!videoRef.current) return;

  try {
    setTrackingStatus('searching');
    
    // 1. 카메라 권한 요청
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 320, height: 240, facingMode: 'user' },
    });
    videoRef.current.srcObject = stream;
    await videoRef.current.play();
    setCameraEnabled(true);

    // [중요] loadScript 부분 삭제됨 (index.html에서 이미 로드함)

    // 2. 미디어파이프 Hands 초기화 (바로 window 객체 사용)
    // 방어 코드: 혹시 스크립트가 아직 로드 안 됐을 경우를 대비
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
      modelComplexity: 0, // 성능 최적화 (0: Lite, 1: Full)
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

    // 3. Camera Utils 초기화
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
       // window.Camera가 없을 경우 수동 루프 (백업)
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
