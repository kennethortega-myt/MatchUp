interface AgaraLogoProps {
  size?: number
  spinning?: boolean
  className?: string
}

export default function AgaraLogo({ size = 40, spinning = true, className = '' }: AgaraLogoProps) {
  const spinStyle: React.CSSProperties = spinning
    ? { transformOrigin: `${size / 2}px ${size / 2}px`, animation: 'agaraSpin 12s linear infinite' }
    : {}

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-label="Agara"
    >
      <style>{`
        @keyframes agaraSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Outer rotating dashed ring ── */}
      <circle
        cx="20" cy="20" r="18"
        stroke="#C9A84C"
        strokeWidth="1"
        strokeDasharray="4.5 2.5"
        strokeLinecap="round"
        style={spinStyle}
      />

      {/* ── Left crescent arc (opening right) ── */}
      <path
        d="M17 10 Q7 20 17 30"
        stroke="#C9A84C"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Right crescent arc (opening left) ── */}
      <path
        d="M23 10 Q33 20 23 30"
        stroke="#C9A84C"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Center diamond ── */}
      <path
        d="M20 15 L24 20 L20 25 L16 20 Z"
        stroke="#C9A84C"
        strokeWidth="1.25"
        strokeLinejoin="round"
        fill="rgba(201,168,76,0.12)"
      />

      {/* ── Center dot ── */}
      <circle cx="20" cy="20" r="1.5" fill="#C9A84C" />
    </svg>
  )
}
