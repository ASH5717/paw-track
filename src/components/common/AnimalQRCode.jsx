// PAW TRACK — Scannable QR identity tag with PNG export

import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';

export function AnimalQRCode({ animalCode, size = 120 }) {
  const canvasRef = useRef(null);

  // Payload encodes the animal's digital record link
  const payload = `${window.location.origin}${window.location.pathname}#/animal/${animalCode}`;

  const handleDownload = () => {
    const qrCanvas = canvasRef.current;
    if (!qrCanvas) return;

    // Canvas bitmap is already scaled by devicePixelRatio; upscale it
    // without smoothing so the modules stay crisp.
    const padding = 40;
    const labelHeight = 70;
    const targetQr = 1024;

    const out = document.createElement('canvas');
    out.width = targetQr + padding * 2;
    out.height = targetQr + padding * 2 + labelHeight;

    const ctx = out.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, out.width, out.height);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qrCanvas, padding, padding, targetQr, targetQr);

    ctx.fillStyle = '#174D37';
    ctx.font = 'bold 30px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(animalCode, out.width / 2, padding + targetQr + labelHeight / 2);

    const link = document.createElement('a');
    link.href = out.toDataURL('image/png');
    link.download = `${animalCode}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="inline-flex flex-col items-center p-3 bg-white rounded-2xl border border-[#A5B99A]/40 shadow-sm">
      <QRCodeCanvas
        ref={canvasRef}
        value={payload}
        size={size}
        level="M"
        marginSize={1}
        bgColor="#FFFFFF"
        fgColor="#174D37"
        title={`Digital record QR for ${animalCode}`}
      />
      <span className="mt-2 font-mono text-[11px] font-bold text-[#174D37] tracking-wider">
        {animalCode}
      </span>
      <button
        type="button"
        onClick={handleDownload}
        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#174D37] text-[#FAF8F1] text-[11px] font-bold hover:bg-[#123B2B] transition-colors"
      >
        <Download className="w-3.5 h-3.5" /> Download QR
      </button>
    </div>
  );
}
