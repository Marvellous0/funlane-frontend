'use client';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  area?: boolean;
  className?: string;
}

export function Sparkline({ data, width = 88, height = 28, stroke = '#1670B5', area = true, className = '' }: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2; // keep the stroke off the edges
  const stepX = width / (data.length - 1);
  const toY = (v: number) => pad + (1 - (v - min) / range) * (height - pad * 2);

  const points = data.map((v, i) => [i * stepX, toY(v)] as const);
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const fill = `${line} L${width},${height} L0,${height} Z`;
  const gradId = `spark-${Math.round(min)}-${Math.round(max)}-${data.length}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      {area && (
        <>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fill} fill={`url(#${gradId})`} />
        </>
      )}
      <path d={line} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
