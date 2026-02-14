
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
// Import QrCode from lucide-react
import { Download, Link as LinkIcon, QrCode } from 'lucide-react';

export const QRGenerator: React.FC = () => {
  const [url, setUrl] = useState('');
  const [qrColor, setQrColor] = useState('#000000');

  const downloadQR = () => {
    const svg = document.getElementById('qr-svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="w-full max-w-xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <label className="block text-slate-700 font-bold mb-3 flex items-center gap-2">
          <LinkIcon size={18} /> 연결할 URL 입력
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://google.com"
            className="flex-grow p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
          />
        </div>
        
        <div className="mt-6 flex gap-4 items-center">
          <label className="text-sm font-medium text-slate-600">QR 코드 색상:</label>
          <input 
            type="color" 
            value={qrColor} 
            onChange={(e) => setQrColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border-none"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 p-10 bg-white rounded-3xl border border-slate-200 shadow-sm min-w-[320px]">
        {url ? (
          <>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <QRCodeSVG
                id="qr-svg"
                value={url}
                size={256}
                level="H"
                includeMargin={true}
                fgColor={qrColor}
              />
            </div>
            <button
              onClick={downloadQR}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-bold shadow-lg"
            >
              <Download size={20} /> 이미지 다운로드
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
               <QrCode size={40} />
            </div>
            <p>URL을 입력하면 QR 코드가 여기에 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};