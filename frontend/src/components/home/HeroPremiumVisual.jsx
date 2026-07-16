import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const SPRING = { stiffness: 55, damping: 24, mass: 0.9 };
const HOVER_SPRING = { stiffness: 180, damping: 26, mass: 0.6 };

const useLayerParallax = (springX, springY, factor) => {
  const x = useTransform(springX, [-0.5, 0.5], [-30 * factor, 30 * factor]);
  const y = useTransform(springY, [-0.5, 0.5], [-20 * factor, 20 * factor]);
  return { x, y };
};

const HeroPremiumVisual = ({ trackRef }) => {
  const [isActive, setIsActive] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING);
  const springY = useSpring(mouseY, SPRING);
  const hoverScale = useSpring(1, HOVER_SPRING);

  /* Ribbon — full parallax + rotation */
  const ribbonX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const ribbonY = useTransform(springY, [-0.5, 0.5], [-20, 20]);
  const ribbonRotX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const ribbonRotY = useTransform(springX, [-0.5, 0.5], [-5, 5]);
  const ribbonRotZ = useTransform(springX, [-0.5, 0.5], [-1.5, 1.5]);

  /* Layered depth parallax */
  const glassLayer = useLayerParallax(springX, springY, 0.3);
  const particleLayer = useLayerParallax(springX, springY, 0.5);
  const glowLayer = useLayerParallax(springX, springY, 0.1);

  useEffect(() => {
    const trackEl = trackRef?.current;
    if (!trackEl) return undefined;

    const handleMove = (e) => {
      const rect = trackEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleEnter = () => {
      setIsActive(true);
      hoverScale.set(1.03);
    };

    const handleLeave = () => {
      setIsActive(false);
      mouseX.set(0);
      mouseY.set(0);
      hoverScale.set(1);
    };

    trackEl.addEventListener("mousemove", handleMove, { passive: true });
    trackEl.addEventListener("mouseenter", handleEnter);
    trackEl.addEventListener("mouseleave", handleLeave);

    return () => {
      trackEl.removeEventListener("mousemove", handleMove);
      trackEl.removeEventListener("mouseenter", handleEnter);
      trackEl.removeEventListener("mouseleave", handleLeave);
    };
  }, [trackRef, mouseX, mouseY, hoverScale]);

  const particlePositions = [
    { left: "22%", top: "28%" },
    { left: "68%", top: "24%" },
    { left: "50%", top: "45%" },
    { left: "30%", top: "58%" },
    { left: "72%", top: "52%" },
    { left: "44%", top: "68%" },
  ];

  return (
    <div
      className={`khp-visual${isActive ? " khp-visual--active" : ""}`}
      aria-hidden
    >
      <div className="khp-visual__stage">
        <div className="khp-visual__blur" />

        <div className="khp-visual__grid" />

        {/* Ambient orbs — reduced size */}
        <motion.div
          className="khp-visual__orb khp-visual__orb--blue"
          style={{ x: glowLayer.x, y: glowLayer.y }}
          animate={{ opacity: [0.3, 0.45, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="khp-visual__orb khp-visual__orb--gold"
          style={{ x: glowLayer.x, y: glowLayer.y }}
          animate={{ opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="khp-visual__rays" />

        {/* Particles — 50% parallax */}
        {particlePositions.map((pos, i) => (
          <motion.span
            key={i}
            className="khp-visual__particle-wrap"
            style={{
              left: pos.left,
              top: pos.top,
              x: particleLayer.x,
              y: particleLayer.y,
            }}
          >
            <motion.span
              className="khp-visual__particle"
              animate={{
                y: [0, -6 - (i % 2) * 2, 0],
                opacity: [0.15, 0.4, 0.15],
              }}
              transition={{
                duration: 7 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.35,
              }}
            />
          </motion.span>
        ))}

        {/* Glass circles — 30% parallax */}
        <motion.div className="khp-visual__glass-wrap" style={{ x: glassLayer.x, y: glassLayer.y }}>
          <motion.div
            className="khp-visual__glass khp-visual__glass--1"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div
          className="khp-visual__glass-wrap khp-visual__glass-wrap--2"
          style={{ x: glassLayer.x, y: glassLayer.y }}
        >
          <motion.div
            className="khp-visual__glass khp-visual__glass--2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div
          className="khp-visual__glass-wrap khp-visual__glass-wrap--3"
          style={{ x: glassLayer.x, y: glassLayer.y }}
        >
          <motion.div
            className="khp-visual__glass khp-visual__glass--3"
            animate={{ opacity: [0.4, 0.65, 0.4] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* DNA + molecules — subtle glass-layer parallax */}
        <motion.svg
          className="khp-visual__dna"
          viewBox="0 0 60 120"
          fill="none"
          style={{ x: glassLayer.x, y: glassLayer.y }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i}>
              <circle cx={18 + (i % 2) * 24} cy={8 + i * 14} r="2.5" fill="#2356A8" opacity="0.35" />
              <line
                x1={18 + (i % 2) * 24}
                y1={8 + i * 14}
                x2={42 - (i % 2) * 24}
                y2={8 + i * 14}
                stroke="#C89A2D"
                strokeWidth="0.8"
                opacity="0.22"
              />
            </g>
          ))}
        </motion.svg>

        <motion.div
          className="khp-visual__molecule khp-visual__molecule--primary"
          style={{ x: particleLayer.x, y: particleLayer.y }}
        >
          <span /><span /><span /><span /><span />
        </motion.div>

        {/* Ribbon — premium 3D showcase */}
        <motion.div
          className="khp-visual__ribbon-wrap"
          style={{
            x: ribbonX,
            y: ribbonY,
            rotateX: ribbonRotX,
            rotateY: ribbonRotY,
            rotateZ: ribbonRotZ,
            scale: hoverScale,
            transformPerspective: 1400,
          }}
        >
          <motion.div
            className="khp-visual__ribbon-inner"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Multi-layer glow — 10% parallax */}
            <motion.div
              className="khp-visual__ribbon-glow khp-visual__ribbon-glow--core"
              style={{ x: glowLayer.x, y: glowLayer.y }}
            />
            <motion.div
              className="khp-visual__ribbon-glow khp-visual__ribbon-glow--blue"
              style={{ x: glowLayer.x, y: glowLayer.y }}
            />
            <motion.div
              className="khp-visual__ribbon-glow khp-visual__ribbon-glow--gold"
              style={{ x: glowLayer.x, y: glowLayer.y }}
            />

            <div className="khp-visual__ribbon-shadow" />
            <img
              src="/hero/heroribbon.png"
              alt=""
              className="khp-visual__ribbon"
              draggable={false}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroPremiumVisual;
