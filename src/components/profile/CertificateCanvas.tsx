"use client";

import { useRef, useEffect, useCallback } from "react";
import { Download } from "lucide-react";

interface CertificateProps {
  userName: string;
  wpm: number;
  accuracy: number;
  date: string;
}

export default function CertificateCanvas({ userName, wpm, accuracy, date }: CertificateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions: 800x600 (approx. A4 ratio but landscape for screen)
    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = "#0a0a0a"; // Dark background matching app
    ctx.fillRect(0, 0, width, height);

    // Decorative Border
    ctx.strokeStyle = "#C4431A"; // Accent orange
    ctx.lineWidth = 15;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    
    ctx.strokeStyle = "rgba(196, 67, 26, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(35, 35, width - 70, height - 70);

    // Corner Accents
    ctx.fillStyle = "#C4431A";
    const cornerSize = 60;
    // Top Left
    ctx.fillRect(20, 20, cornerSize, cornerSize);
    // Top Right
    ctx.fillRect(width - cornerSize - 20, 20, cornerSize, cornerSize);
    // Bottom Left
    ctx.fillRect(20, height - cornerSize - 20, cornerSize, cornerSize);
    // Bottom Right
    ctx.fillRect(width - cornerSize - 20, height - cornerSize - 20, cornerSize, cornerSize);

    // Logo/Header
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TATENO PERFORMANCE", width / 2, 100);
    
    ctx.fillStyle = "#C4431A";
    ctx.font = "bold 14px JetBrains Mono, monospace";
    ctx.fillText("OFFICIAL TYPING CERTIFICATION", width / 2, 130);

    // Main Content
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "italic 20px Inter, sans-serif";
    ctx.fillText("This is to certify that", width / 2, 200);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px Inter, sans-serif";
    ctx.fillText(userName.toUpperCase(), width / 2, 260);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "italic 20px Inter, sans-serif";
    ctx.fillText("has achieved a performance milestone of", width / 2, 320);

    // Stats Section
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px JetBrains Mono, monospace";
    ctx.fillText(`${wpm} WPM`, width / 2, 400);
    
    ctx.fillStyle = "rgba(196, 67, 26, 0.8)";
    ctx.font = "bold 20px Inter, sans-serif";
    ctx.fillText(`WITH ${accuracy}% ACCURACY`, width / 2, 440);

    // Footer Info
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.fillText(`DATE: ${date}`, 70, height - 70);
    
    ctx.textAlign = "right";
    ctx.fillText("VERIFIED BY TATENO ENGINE V2.0", width - 70, height - 70);

    // Decorative Seal (Simple circle)
    ctx.beginPath();
    ctx.arc(width / 2, height - 100, 40, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(196, 67, 26, 0.2)";
    ctx.fill();
    ctx.strokeStyle = "#C4431A";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#C4431A";
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VALID", width / 2, height - 105);
    ctx.fillText("2026", width / 2, height - 90);
  }, [userName, wpm, accuracy, date]);

  useEffect(() => {
    drawCertificate();
  }, [drawCertificate]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `tateno_certificate_${userName.toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative group">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="rounded-xl border border-border shadow-2xl max-w-full h-auto bg-surface"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-[2px]">
           <span className="text-white font-bold text-sm bg-accent px-4 py-2 rounded-full shadow-lg">Preview Mode</span>
        </div>
      </div>
      
      <button 
        onClick={handleDownload}
        className="flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-bold text-sm shadow-xl shadow-accent/20 hover:scale-105 transition-all"
      >
        <Download size={20} />
        Download Official Certificate (PNG)
      </button>
    </div>
  );
}
