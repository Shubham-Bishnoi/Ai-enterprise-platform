import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ARCS, HUBS } from './globalNetworkData';
import type { Arc, Hub } from './globalNetworkData';
import './GlobalNetwork3D.css';

export type GlobalNetwork3DProps = {
  className?: string;
  bare?: boolean;
};

function getArcGradientStops(arc: Arc): Array<{ offset: string; color: string; opacity: number }> {
  if (arc.type === 'future') {
    if (arc.id === 'london-usa') {
      return [
        { offset: '0%', color: '#8B5CF6', opacity: 0.5 },
        { offset: '100%', color: '#F59E0B', opacity: 0.55 },
      ];
    }
    if (arc.id === 'india-middle-east') {
      return [
        { offset: '0%', color: '#FF2D45', opacity: 0.45 },
        { offset: '100%', color: '#EC4899', opacity: 0.5 },
      ];
    }
    return [
      { offset: '0%', color: '#178BFF', opacity: 0.45 },
      { offset: '100%', color: '#06B6D4', opacity: 0.5 },
    ];
  }

  if (arc.id === 'london-india') {
    return [
      { offset: '0%', color: '#8B5CF6', opacity: 0.95 },
      { offset: '55%', color: '#FF2D45', opacity: 0.75 },
      { offset: '100%', color: '#FF2D45', opacity: 0.95 },
    ];
  }
  if (arc.id === 'india-singapore') {
    return [
      { offset: '0%', color: '#FF2D45', opacity: 0.95 },
      { offset: '55%', color: '#A855F7', opacity: 0.7 },
      { offset: '100%', color: '#178BFF', opacity: 0.95 },
    ];
  }
  return [
    { offset: '0%', color: '#178BFF', opacity: 0.95 },
    { offset: '55%', color: '#8B5CF6', opacity: 0.75 },
    { offset: '100%', color: '#8B5CF6', opacity: 0.95 },
  ];
}

function getLabelWidth(label: string) {
  return Math.max(58, Math.round(label.length * 7.2 + 18));
}

export function GlobalNetwork3D({ className, bare = false }: GlobalNetwork3DProps) {
  const hubsById = useMemo(() => {
    const map = new Map<string, Hub>();
    HUBS.forEach((h) => map.set(h.id, h));
    return map;
  }, []);

  return (
    <div
      className={cn(
        'relative h-full w-full min-h-[360px] sm:min-h-[420px] lg:min-h-[520px] overflow-hidden',
        bare ? '' : 'rounded-[28px] border border-white/[0.08] bg-[#08090D]',
        className
      )}
    >
      {!bare && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 52% 48%, rgba(23,139,255,0.08) 0%, transparent 70%), radial-gradient(ellipse 45% 40% at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%), radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(3,3,5,0.7) 100%)',
          }}
        />
      )}

      <svg viewBox="0 0 1000 620" className="absolute inset-0 h-full w-full" role="img" aria-label="GFF AI global operations network map">
        <title>GFF AI global operations network map</title>
        <defs>
          <filter id="gff-soft-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="gff-tight-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="gff-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </pattern>

          {ARCS.map((arc) => {
            const from = hubsById.get(arc.from);
            const to = hubsById.get(arc.to);
            if (!from || !to) return null;
            const stops = getArcGradientStops(arc);
            return (
              <linearGradient
                key={`grad-${arc.id}`}
                id={`gff-arc-${arc.id}`}
                gradientUnits="userSpaceOnUse"
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
              >
                {stops.map((s) => (
                  <stop key={`${arc.id}-${s.offset}`} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
                ))}
              </linearGradient>
            );
          })}
        </defs>

        <rect x="0" y="0" width="1000" height="620" fill="url(#gff-grid)" opacity="0.06" />

        <g opacity="0.22" className="gff-map-scan">
          <circle cx="500" cy="310" r="240" fill="none" stroke="rgba(23,139,255,0.22)" strokeWidth="0.8" />
          <circle cx="500" cy="310" r="200" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" strokeDasharray="3 10" />
          <circle cx="500" cy="310" r="160" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
        </g>

        <g opacity="1">
          <g opacity="0.95">
            <path
              d="M 140 195 C 160 145, 235 120, 305 140 C 345 152, 360 185, 342 215 C 320 255, 330 275, 310 300 C 282 335, 230 338, 205 312 C 180 287, 165 276, 152 248 C 142 225, 132 215, 140 195 Z"
              fill="rgba(23, 139, 255, 0.06)"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1.2"
            />
            <path
              d="M 265 325 C 290 305, 320 305, 345 330 C 365 350, 360 382, 338 402 C 315 422, 285 424, 265 404 C 245 382, 246 345, 265 325 Z"
              fill="rgba(23, 139, 255, 0.05)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            <path
              d="M 410 190 C 440 165, 490 155, 528 170 C 560 183, 575 210, 562 235 C 548 260, 520 275, 495 280 C 470 285, 455 300, 435 294 C 410 286, 390 260, 392 232 C 394 212, 395 202, 410 190 Z"
              fill="rgba(23, 139, 255, 0.06)"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1.2"
            />
            <path
              d="M 470 290 C 505 285, 540 290, 565 305 C 590 320, 600 345, 585 370 C 568 398, 535 418, 500 418 C 468 418, 445 402, 440 372 C 434 336, 438 296, 470 290 Z"
              fill="rgba(23, 139, 255, 0.05)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            <path
              d="M 560 235 C 600 210, 650 208, 705 230 C 750 248, 772 280, 770 312 C 768 340, 745 352, 720 350 C 690 346, 670 355, 650 375 C 632 393, 610 402, 590 392 C 572 382, 565 362, 572 338 C 580 310, 575 290, 560 272 C 545 253, 540 248, 560 235 Z"
              fill="rgba(23, 139, 255, 0.06)"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1.2"
            />
            <path
              d="M 745 445 C 780 430, 828 438, 852 470 C 872 498, 860 535, 822 545 C 792 553, 765 545, 748 525 C 730 503, 720 455, 745 445 Z"
              fill="rgba(23, 139, 255, 0.05)"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1"
            />
          </g>

          <g opacity="0.55" filter="url(#gff-soft-glow)">
            <path
              d="M 140 195 C 160 145, 235 120, 305 140 C 345 152, 360 185, 342 215 C 320 255, 330 275, 310 300 C 282 335, 230 338, 205 312 C 180 287, 165 276, 152 248 C 142 225, 132 215, 140 195 Z"
              fill="none"
              stroke="rgba(23,139,255,0.20)"
              strokeWidth="2"
            />
            <path
              d="M 410 190 C 440 165, 490 155, 528 170 C 560 183, 575 210, 562 235 C 548 260, 520 275, 495 280 C 470 285, 455 300, 435 294 C 410 286, 390 260, 392 232 C 394 212, 395 202, 410 190 Z"
              fill="none"
              stroke="rgba(23,139,255,0.20)"
              strokeWidth="2"
            />
            <path
              d="M 560 235 C 600 210, 650 208, 705 230 C 750 248, 772 280, 770 312 C 768 340, 745 352, 720 350 C 690 346, 670 355, 650 375 C 632 393, 610 402, 590 392 C 572 382, 565 362, 572 338 C 580 310, 575 290, 560 272 C 545 253, 540 248, 560 235 Z"
              fill="none"
              stroke="rgba(23,139,255,0.20)"
              strokeWidth="2"
            />
          </g>
        </g>

        <g opacity="0.48">
          {ARCS.filter((a) => a.type === 'future').map((arc) => (
            <g key={arc.id}>
              <path
                d={arc.path}
                fill="none"
                stroke={`url(#gff-arc-${arc.id})`}
                strokeWidth="1.4"
                opacity="0.55"
                className="gff-network-future"
                style={{ animationDuration: `${arc.duration}s` }}
              />
              <path
                d={arc.path}
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="0.8"
                opacity="0.12"
                strokeDasharray="3 16"
                className="gff-network-future"
                style={{ animationDuration: `${arc.duration * 0.9}s` }}
              />
            </g>
          ))}
        </g>

        <g>
          {ARCS.filter((a) => a.type === 'active').map((arc) => (
            <g key={arc.id}>
              <path
                d={arc.path}
                fill="none"
                stroke={`url(#gff-arc-${arc.id})`}
                strokeWidth="5"
                opacity="0.12"
                filter="url(#gff-soft-glow)"
              />
              <path
                d={arc.path}
                fill="none"
                stroke={`url(#gff-arc-${arc.id})`}
                strokeWidth="2.2"
                strokeLinecap="round"
                className="gff-network-active"
                style={{ animationDuration: `${arc.duration}s` }}
              />
              <path
                d={arc.path}
                fill="none"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="0.9"
                opacity="0.16"
                strokeLinecap="round"
                className="gff-network-active"
                style={{ animationDuration: `${arc.duration * 1.18}s`, animationDelay: '0.35s' }}
              />
            </g>
          ))}
        </g>

        <g>
          {HUBS.map((hub) => {
            const isActive = hub.type === 'active';
            const radius = isActive ? 6.5 : 5.2;
            const glowR = isActive ? 14 : 11;

            return (
              <g key={hub.id}>
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  fill="none"
                  stroke={hub.color}
                  strokeWidth={isActive ? 1.2 : 1}
                  opacity={isActive ? 0.22 : 0.14}
                  className="gff-hub-pulse"
                />

                {isActive && (
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    fill="none"
                    stroke={hub.color}
                    strokeWidth="0.9"
                    opacity="0.12"
                    className="gff-hub-pulse-slow"
                    style={{ animationDelay: '0.25s' }}
                  />
                )}

                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={glowR}
                  fill={hub.color}
                  opacity={isActive ? 0.10 : 0.06}
                  filter="url(#gff-tight-glow)"
                />

                {isActive ? (
                  <>
                    <circle cx={hub.x} cy={hub.y} r={radius} fill={hub.color} filter="url(#gff-tight-glow)" />
                    <circle cx={hub.x} cy={hub.y} r={radius * 0.42} fill="white" opacity="0.9" />
                  </>
                ) : (
                  <>
                    <polygon
                      points={`${hub.x},${hub.y - radius} ${hub.x + radius},${hub.y} ${hub.x},${hub.y + radius} ${hub.x - radius},${hub.y}`}
                      fill={hub.color}
                      opacity="0.85"
                      filter="url(#gff-tight-glow)"
                    />
                    <circle cx={hub.x} cy={hub.y} r="1.8" fill="white" opacity="0.78" />
                  </>
                )}
              </g>
            );
          })}
        </g>

        <g>
          {HUBS.map((hub) => {
            const pillW = getLabelWidth(hub.label);
            const pillH = 20;
            const labelX = hub.x + hub.labelDx;
            const labelY = hub.y + hub.labelDy;
            const pillX = hub.labelAlign === 'end' ? labelX - pillW : labelX;
            const pillY = labelY - Math.round(pillH / 2);
            const textX = hub.labelAlign === 'end' ? pillX + pillW - 10 : pillX + 10;
            const textAnchor = hub.labelAlign === 'end' ? 'end' : 'start';

            return (
              <g key={`label-${hub.id}`}>
                <rect
                  x={pillX}
                  y={pillY}
                  width={pillW}
                  height={pillH}
                  rx="10"
                  fill="rgba(11, 13, 18, 0.72)"
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="0.9"
                />
                <text
                  x={textX}
                  y={labelY + 3}
                  fill="rgba(248, 250, 252, 0.88)"
                  fontSize="9.6"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight="650"
                  letterSpacing="1.3"
                  textAnchor={textAnchor}
                >
                  {hub.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
