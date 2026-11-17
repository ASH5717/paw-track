// PAW TRACK — Scannable QR identity tag with full animal metadata & PNG export

import { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Check, QrCode, ShieldCheck, Heart, MapPin, User, FileText } from 'lucide-react';

export function AnimalQRCode({ animal, animalCode: propCode, size = 140 }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [qrMode, setQrMode] = useState('url'); // 'url' | 'vcard'

  // Support both animal object and simple animalCode string
  const code = animal?.animal_code || propCode || 'PT-UNKNOWN';
  const name = animal?.name || 'Community Animal';
  const breed = animal?.breed || 'Indian Pariah (Indie)';
  const age = animal?.estimated_age || 'Unknown Age';
  const gender = animal?.gender || 'Unknown';
  const vaxStatus = animal?.vaccination_status || 'Not Vaccinated';
  const healthStatus = animal?.health_status || 'Healthy';
  const location = animal?.location_name || 'Bengaluru';
  const handler = animal?.assigned_volunteer || 'PAW TRACK Welfare Board';
  const isSterilized = Boolean(animal?.sterilized);

  // 1. Digital web profile URL
  const profileUrl = `${window.location.origin}${window.location.pathname}#/animal/${code}`;

  // 2. Comprehensive offline digital collar tag payload
  const vcardPayload = [
    `🐾 PAW TRACK OFFICIAL DIGITAL COLLAR TAG`,
    `ID: ${code}`,
    `Name: ${name}`,
    `Breed: ${breed} (${gender}, ${age})`,
    `Health: ${healthStatus}`,
    `Rabies / Vaccination: ${vaxStatus}`,
    `Sterilized (ABC): ${isSterilized ? 'YES' : 'NO'}`,
    `Zone: ${location}`,
    `Caregiver / Handler: ${handler}`,
    `Verification Link: ${profileUrl}`
  ].join('\n');

  const activePayload = qrMode === 'url' ? profileUrl : vcardPayload;

  const handleCopy = () => {
    navigator.clipboard?.writeText(activePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const qrCanvas = canvasRef.current;
    if (!qrCanvas) return;

    // High-resolution Printable Collar Tag Badge (1024x1400)
    const out = document.createElement('canvas');
    const width = 1024;
    const height = 1380;
    out.width = width;
    out.height = height;

    const ctx = out.getContext('2d');
    if (!ctx) return;

    // Background Ivory
    ctx.fillStyle = '#FAF8F1';
    ctx.fillRect(0, 0, width, height);

    // Header bar (Forest Green)
    ctx.fillStyle = '#174D37';
    ctx.fillRect(0, 0, width, 180);

    // Header Title
    ctx.fillStyle = '#FAF8F1';
    ctx.font = 'bold 38px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PAW TRACK · ANIMAL WELFARE GRID', width / 2, 80);

    ctx.font = '600 24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#E8A64A';
    ctx.fillText('OFFICIAL DIGITAL COLLAR IDENTITY TAG', width / 2, 130);

    // Card white background container
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    ctx.beginPath();
    ctx.roundRect(80, 220, width - 160, height - 300, 36);
    ctx.fill();
    ctx.shadowColor = 'transparent'; // Reset shadow

    // Animal Name
    ctx.fillStyle = '#174D37';
    ctx.font = 'bold 58px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name.toUpperCase(), width / 2, 310);

    // Animal Code
    ctx.fillStyle = '#E8A64A';
    ctx.font = 'bold 36px ui-monospace, SFMono-Regular, monospace';
    ctx.fillText(code, width / 2, 370);

    // Breed & Age
    ctx.fillStyle = '#5C6B62';
    ctx.font = '500 26px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${breed} · ${gender} · ${age}`, width / 2, 420);

    // Draw QR Code centered (520x520)
    const qrSize = 500;
    const qrX = (width - qrSize) / 2;
    const qrY = 470;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // Verification Badges Container
    const badgeY = 1020;
    ctx.fillStyle = '#174D37';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 260, badgeY, 240, 56, 16);
    ctx.fill();

    ctx.fillStyle = '#FAF8F1';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`✓ ${vaxStatus}`, width / 2 - 140, badgeY + 36);

    ctx.fillStyle = isSterilized ? '#174D37' : '#9E896A';
    ctx.beginPath();
    ctx.roundRect(width / 2 + 20, badgeY, 240, 56, 16);
    ctx.fill();

    ctx.fillStyle = '#FAF8F1';
    ctx.fillText(isSterilized ? '✓ Sterilized (ABC)' : 'Dewormed', width / 2 + 140, badgeY + 36);

    // Location & Handler Info
    ctx.fillStyle = '#26332B';
    ctx.font = '600 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(`📍 ${location}`, width / 2, 1130);

    ctx.fillStyle = '#5C6B62';
    ctx.font = '500 22px system-ui, -apple-system, sans-serif';
    ctx.fillText(`Community Caregiver: ${handler}`, width / 2, 1175);

    // Footer
    ctx.fillStyle = '#A5B99A';
    ctx.font = 'italic 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('Scan with any smartphone camera for complete live medical & emergency records', width / 2, 1240);

    // Download trigger
    const link = document.createElement('a');
    link.href = out.toDataURL('image/png');
    link.download = `${code}-${name.replace(/\s+/g, '_')}-Collar-Tag.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-[#FAF8F1] rounded-2xl border border-[#A5B99A]/40 p-4 flex flex-col items-center text-center shadow-sm">
      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#A5B99A]/30 mb-3 text-xs">
        <button
          type="button"
          onClick={() => setQrMode('url')}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
            qrMode === 'url' ? 'bg-[#174D37] text-white shadow-sm' : 'text-[#5C6B62] hover:text-[#174D37]'
          }`}
        >
          Web Link
        </button>
        <button
          type="button"
          onClick={() => setQrMode('vcard')}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
            qrMode === 'vcard' ? 'bg-[#174D37] text-white shadow-sm' : 'text-[#5C6B62] hover:text-[#174D37]'
          }`}
        >
          Offline Info Tag
        </button>
      </div>

      {/* QR Code Canvas */}
      <div className="bg-white p-3 rounded-2xl border border-[#A5B99A]/40 shadow-sm flex items-center justify-center">
        <QRCodeCanvas
          ref={canvasRef}
          value={activePayload}
          size={size}
          level="M"
          marginSize={1}
          bgColor="#FFFFFF"
          fgColor="#174D37"
          title={`Digital identity QR for ${name} (${code})`}
        />
      </div>

      {/* Primary Identifiers */}
      <div className="mt-3">
        <span className="font-mono text-xs font-black text-[#174D37] tracking-wider block">
          {code}
        </span>
        <span className="text-xs font-bold text-[#26332B] block">
          {name} · {breed}
        </span>
      </div>

      {/* Information Pills */}
      <div className="w-full mt-3 pt-3 border-t border-[#A5B99A]/30 space-y-1.5 text-left text-[11px]">
        <div className="flex items-center justify-between text-[#26332B]">
          <span className="text-[#5C6B62] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#174D37]" /> Rabies Status:
          </span>
          <span className="font-bold text-[#174D37]">{vaxStatus}</span>
        </div>
        <div className="flex items-center justify-between text-[#26332B]">
          <span className="text-[#5C6B62] flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-amber-600" /> Health:
          </span>
          <span className="font-bold">{healthStatus}</span>
        </div>
        <div className="flex items-center justify-between text-[#26332B]">
          <span className="text-[#5C6B62] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#174D37]" /> Zone:
          </span>
          <span className="font-medium truncate max-w-[140px]">{location}</span>
        </div>
        <div className="flex items-center justify-between text-[#26332B]">
          <span className="text-[#5C6B62] flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#174D37]" /> Caregiver:
          </span>
          <span className="font-medium truncate max-w-[140px]">{handler}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full grid grid-cols-2 gap-2 mt-3.5">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#A5B99A]/60 bg-white text-[#174D37] text-[11px] font-bold hover:bg-[#FAF8F1] transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : qrMode === 'url' ? 'Copy URL' : 'Copy Info'}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#174D37] text-[#FAF8F1] text-[11px] font-bold hover:bg-[#123B2B] transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" /> Download Tag
        </button>
      </div>
    </div>
  );
}
