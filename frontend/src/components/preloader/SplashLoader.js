import React, { useEffect, useState } from "react";

const SplashLoader = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2200);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 2700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0b1d3d] text-white transition-opacity duration-500 ease-in-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center max-w-md px-4 text-center">
        {/* Animated ECG Pulse and Cross Container */}
        <div className="relative w-48 h-32 flex items-center justify-center mb-6">
          {/* Medical Cross Background Glow */}
          <div className="absolute w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ED1C24]/10 to-[#ED1C24]/30 blur-xl animate-pulse-glow" />

          {/* Medical Cross SVG */}
          <svg
            className="absolute w-12 h-12 text-[#ED1C24] animate-med-cross"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
          </svg>

          {/* Heartbeat ECG Line Drawing SVG */}
          <svg
            className="absolute inset-0 w-full h-full text-white/40"
            viewBox="0 0 200 100"
            fill="none"
          >
            <path
              className="animate-heartbeat-line"
              d="M 10 50 L 50 50 L 65 50 L 73 30 L 81 75 L 89 15 L 97 60 L 105 50 L 120 50 L 190 50"
              stroke="#ED1C24"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Brand Text with Typing & Tracking Animations */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-[0.2em] text-white uppercase mb-2 animate-tracking-in">
          KURE <span className="text-[#ED1C24]">PHARMA</span>
        </h1>
        
        {/* Slogan */}
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-gray-400/90 animate-fade-in-slogan">
          Specialty Medicine & Healthcare
        </p>

        {/* Sub-loading indicator */}
        <div className="w-32 h-[3px] bg-white/10 rounded-full mt-8 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#ED1C24] to-[#B8860B] rounded-full animate-progress-bar" />
        </div>
      </div>

      {/* Styled Animations */}
      <style jsx global>{`
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
            filter: drop-shadow(0 0 12px rgba(237, 28, 36, 0.8));
          }
        }
        @keyframes drawLine {
          0% {
            stroke-dashoffset: 400;
          }
          70% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.3;
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(0.9);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
        @keyframes trackingIn {
          0% {
            letter-spacing: -0.1em;
            opacity: 0;
            filter: blur(4px);
          }
          40% {
            opacity: 0.6;
          }
          100% {
            letter-spacing: 0.2em;
            opacity: 1;
            filter: blur(0);
          }
        }
        @keyframes fadeInSlogan {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes progressBar {
          0% {
            width: 0%;
            transform: translateX(-100%);
          }
          50% {
            width: 50%;
            transform: translateX(0%);
          }
          100% {
            width: 100%;
            transform: translateX(100%);
          }
        }

        .animate-med-cross {
          animation: heartbeat 1.5s infinite ease-in-out;
        }
        .animate-heartbeat-line {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: drawLine 2.2s infinite ease-in-out;
        }
        .animate-pulse-glow {
          animation: pulseGlow 1.5s infinite ease-in-out;
        }
        .animate-tracking-in {
          animation: trackingIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        .animate-fade-in-slogan {
          animation: fadeInSlogan 1.2s ease-out 0.6s both;
        }
        .animate-progress-bar {
          animation: progressBar 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default SplashLoader;
