import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const RouteProgressBar = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;

    const start = () => {
      setVisible(true);
      setProgress(18);
      timer = setInterval(() => {
        setProgress((current) => (current >= 92 ? current : current + 8));
      }, 180);
    };

    const done = () => {
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);

    return () => {
      clearInterval(timer);
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
    };
  }, [router.events]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[3px] bg-[#ED1C24] shadow-sm transition-[width] duration-200 ease-out pointer-events-none"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-hidden="true"
    />
  );
};

export default RouteProgressBar;
