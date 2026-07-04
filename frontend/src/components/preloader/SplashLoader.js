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
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#fcfbf9] text-[#0b1d3d] transition-opacity duration-500 ease-in-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center max-w-md px-4 text-center">
        {/* Animated Kure Pharma Logo Container */}
        <div className="relative w-48 h-32 flex items-center justify-center mb-4">
          {/* Logo Background Glow */}
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-[#ED1C24]/10 via-[#c9a066]/10 to-[#0b1d3d]/5 blur-2xl animate-pulse-glow" />

          {/* Actual Kure Pharma Logo */}
          <img
            src="/kure-logo.png"
            alt="Kure Pharma"
            className="w-40 h-auto object-contain relative z-10 animate-kure-logo-pulse"
          />
        </div>

        {/* Brand Text with Typing & Tracking Animations */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-[0.2em] text-[#0b1d3d] uppercase mb-2 animate-tracking-in">
          KURE <span className="text-[#ED1C24]">PHARMA</span>
        </h1>
        
        {/* Slogan */}
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-gray-550/90 animate-fade-in-slogan">
          Specialty Medicine & Healthcare
        </p>

        {/* Sub-loading indicator */}
        <div className="w-32 h-[3px] bg-gray-200/60 rounded-full mt-8 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#ED1C24] to-[#B8860B] rounded-full animate-progress-bar" />
        </div>
      </div>

      {/* Styled Animations */}
      <style jsx global>{`
        @keyframes kureLogoPulse {
          0%, 100% {
            transform: scale(0.96);
            filter: drop-shadow(0 4px 10px rgba(11, 29, 61, 0.08));
          }
          50% {
            transform: scale(1.04);
            filter: drop-shadow(0 10px 25px rgba(11, 29, 61, 0.15));
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

        .animate-kure-logo-pulse {
          animation: kureLogoPulse 2s infinite ease-in-out;
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
