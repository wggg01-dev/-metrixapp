import { motion } from "framer-motion";

const CHART_H = 40;
const BAR_W = 7;
const GAP = 3;
const NUM_BARS = 5;
const CHART_W = NUM_BARS * BAR_W + (NUM_BARS - 1) * GAP;

const BARS = [
  { frac: 1.0  },
  { frac: 0.62 },
  { frac: 0.35 },
  { frac: 0.62 },
  { frac: 1.0  },
];

const barX = (i: number) => i * (BAR_W + GAP);
const barTopY = (frac: number) => CHART_H - frac * CHART_H;

const linePath = BARS.map((bar, i) => {
  const x = barX(i) + BAR_W / 2;
  const y = barTopY(bar.frac);
  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
}).join(" ");

interface MetrixLogoProps {
  dark?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CONFIG = {
  sm: { chart: 0.7, text: "text-lg",  gap: "gap-2" },
  md: { chart: 1.0, text: "text-xl",  gap: "gap-2.5" },
  lg: { chart: 1.3, text: "text-2xl", gap: "gap-3" },
};

export function MetrixAnimatedLogo({ dark = true, size = "md", className = "" }: MetrixLogoProps) {
  const cfg = SIZE_CONFIG[size];
  const scale = cfg.chart;
  const svgW = CHART_W * scale;
  const svgH = CHART_H * scale;

  const barColor     = dark ? "hsl(213,72%,65%)"  : "hsl(213,48%,48%)";
  const barColorLight= dark ? "hsl(213,60%,78%)"  : "hsl(213,55%,68%)";
  const lineStroke   = dark ? "rgba(147,210,255,0.75)" : "rgba(60,120,220,0.6)";
  const dotFill      = dark ? "#e0f0ff"             : "#fff";
  const dotStroke    = dark ? barColor               : barColor;
  const textColor    = dark ? "hsl(215,25%,92%)"    : "hsl(218,32%,20%)";

  return (
    <div className={`flex items-center ${cfg.gap} ${className}`}>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        aria-label="Metrix chart logo"
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={barColorLight} />
            <stop offset="100%" stopColor={barColor} />
          </linearGradient>
        </defs>

        {BARS.map((bar, i) => {
          const barH = bar.frac * CHART_H;
          const x = barX(i);
          return (
            <motion.rect
              key={i}
              x={x}
              width={BAR_W}
              rx={1.5}
              ry={1.5}
              fill="url(#barGrad)"
              initial={{ y: CHART_H, height: 0, opacity: 0 }}
              animate={{ y: CHART_H - barH, height: barH, opacity: 1 }}
              transition={{
                y:       { delay: i * 0.09, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                height:  { delay: i * 0.09, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                opacity: { delay: i * 0.09, duration: 0.25 },
              }}
            />
          );
        })}

        <motion.path
          d={linePath}
          fill="none"
          stroke={lineStroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5, ease: "easeInOut" }}
        />

        {BARS.map((bar, i) => (
          <motion.circle
            key={i}
            cx={barX(i) + BAR_W / 2}
            cy={barTopY(bar.frac)}
            r={2.2}
            fill={dotFill}
            stroke={dotStroke}
            strokeWidth={1}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.75 + i * 0.06, duration: 0.25, ease: "backOut" }}
          />
        ))}
      </svg>

      <div className="flex items-baseline leading-none">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.01 }}
          className={`${cfg.text} font-bold tracking-tight select-none`}
          style={{ color: textColor }}
        >
          etrix
        </motion.span>
      </div>
    </div>
  );
}
