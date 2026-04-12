import { BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = [
  "Verifying credentials",
  "Establishing secure session",
  "Loading workspace",
  "Authenticating Admin",
];

export function AuthLoading() {
  const [stepIndex, setStepIndex] = useState(0);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 480);
    const dotsTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 380);
    return () => {
      clearInterval(stepTimer);
      clearInterval(dotsTimer);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: "hsl(222, 28%, 9%)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(213,48%,58% / 0.08), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated shield icon */}
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "hsl(218,32%,18%)", border: "1px solid hsl(220,22%,24%)" }}
          >
            <BarChart2
              className="w-8 h-8"
              style={{ color: "hsl(213,48%,58%)" }}
            />
          </div>
          {/* Pulse ring */}
          <span
            className="absolute inset-0 rounded-2xl animate-ping"
            style={{
              border: "1px solid hsl(213,48%,58% / 0.35)",
              animationDuration: "1.6s",
            }}
          />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: "hsl(213,48%,58%)" }}>
            Metrix
          </p>
          {/* Main message */}
          <p className="text-xl font-semibold tracking-tight" style={{ color: "hsl(215,20%,88%)" }}>
            Authenticating Admin{dots}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex flex-col items-start gap-2 min-w-[220px]">
          {STEPS.map((step, i) => {
            const isDone = i < stepIndex;
            const isActive = i === stepIndex;
            return (
              <div
                key={step}
                className="flex items-center gap-2.5 text-xs transition-all duration-300"
                style={{
                  color: isDone
                    ? "hsl(172,55%,50%)"
                    : isActive
                    ? "hsl(215,20%,80%)"
                    : "hsl(215,14%,38%)",
                }}
              >
                {isDone ? (
                  <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(172,55%,50% / 0.15)", border: "1px solid hsl(172,55%,50%)" }}>
                    <svg viewBox="0 0 12 12" className="w-2 h-2" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="hsl(172,55%,50%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : isActive ? (
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 animate-pulse"
                    style={{ background: "hsl(213,48%,58% / 0.25)", border: "1px solid hsl(213,48%,58%)" }}
                  />
                ) : (
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{ background: "hsl(220,22%,17%)", border: "1px solid hsl(220,22%,22%)" }}
                  />
                )}
                {step}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-56 h-0.5 rounded-full overflow-hidden"
          style={{ background: "hsl(220,22%,17%)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((stepIndex + 1) / STEPS.length) * 100}%`,
              background: "hsl(213,48%,58%)",
              transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
