// PAW TRACK — Camera QR scanner (works for every signed-in role)

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import jsQR from 'jsqr';
import { Camera, X, ScanLine, SwitchCamera } from 'lucide-react';

export function QRScannerModal({ onClose, onScan }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const lockedRef = useRef(false);
  const onScanRef = useRef(onScan);

  const [status, setStatus] = useState('starting'); // starting | scanning | error
  const [error, setError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // back camera by default

  // Keep the latest handler without restarting the camera stream.
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let cancelled = false;
    lockedRef.current = false;
    setStatus('starting');
    setError('');

    const tick = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || cancelled || lockedRef.current) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const result = jsQR(image.data, image.width, image.height, {
          inversionAttempts: 'dontInvert'
        });
        if (result && result.data) {
          lockedRef.current = true;
          onScanRef.current(result.data);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('This browser does not support camera access.');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } },
          audio: false
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.setAttribute('playsinline', 'true');
          await video.play();
        }
        setStatus('scanning');
        rafRef.current = requestAnimationFrame(tick);
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setError(
          err?.name === 'NotAllowedError'
            ? 'Camera permission denied. Allow camera access and try again.'
            : err?.message || 'Unable to start the camera.'
        );
      }
    };

    start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [facingMode]);

  const handleManual = (e) => {
    e.preventDefault();
    const value = e.target.elements.code.value.trim();
    if (value) onScan(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF8F1] rounded-3xl max-w-md w-full shadow-2xl border border-[#A5B99A]/50 overflow-hidden"
      >
        <div className="bg-white p-5 border-b border-[#A5B99A]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-[#174D37]" />
            <h3 className="text-sm font-extrabold text-[#26332B]">Scan Animal QR Tag</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5C6B62] hover:bg-[#FAF8F1]"
            title="Close scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-square border border-[#A5B99A]/40">
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
            {status === 'scanning' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3/5 h-3/5 border-4 border-[#E8A64A] rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
              </div>
            )}
            {status === 'starting' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/90 gap-2">
                <Camera className="w-8 h-8" />
                <p className="text-xs font-semibold">Starting camera…</p>
              </div>
            )}
            {status === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/90 text-center p-6 gap-2">
                <Camera className="w-8 h-8" />
                <p className="text-xs font-semibold">{error}</p>
              </div>
            )}
            {status === 'scanning' && (
              <button
                type="button"
                onClick={() =>
                  setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))
                }
                className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/55 text-white hover:bg-black/75 backdrop-blur transition-colors"
                title={facingMode === 'environment' ? 'Switch to front camera' : 'Switch to back camera'}
              >
                <SwitchCamera className="w-5 h-5" />
              </button>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          <p className="text-xs text-[#5C6B62] text-center">
            Point the camera at a dog's QR tag. The profile opens automatically once matched.
          </p>

          <form onSubmit={handleManual} className="flex items-center gap-2">
            <input
              name="code"
              placeholder="Or type Animal ID (e.g. PT-2026-0001)"
              className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-[#A5B99A]/50 text-sm focus:outline-none focus:border-[#174D37]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#174D37] text-white text-xs font-bold hover:bg-[#226B4D]"
            >
              Find
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
