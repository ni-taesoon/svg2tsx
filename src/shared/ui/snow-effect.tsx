import { useMemo } from 'react';

const SNOWFLAKE_CHARS = ['❄', '❅', '❆'];
const SNOWFLAKE_COUNT = 10;
const END_DATE = new Date('2026-01-30T23:59:59');

interface Snowflake {
  id: number;
  char: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
  fontSize: string;
  opacity: number;
}

function generateSnowflakes(): Snowflake[] {
  return Array.from({ length: SNOWFLAKE_COUNT }, (_, i) => ({
    id: i,
    char: SNOWFLAKE_CHARS[Math.floor(Math.random() * SNOWFLAKE_CHARS.length)],
    left: `${5 + Math.random() * 90}%`,
    animationDelay: `${Math.random() * 8}s`,
    animationDuration: `${6 + Math.random() * 6}s`, // 6-12초 (느리게)
    fontSize: `${8 + Math.random() * 6}px`, // 8-14px
    opacity: 0.4 + Math.random() * 0.4, // 0.4-0.8 (은은하게)
  }));
}

function isSnowSeason(): boolean {
  return new Date() <= END_DATE;
}

export function SnowEffect() {
  const snowflakes = useMemo(() => generateSnowflakes(), []);

  if (!isSnowSeason()) {
    return null;
  }

  return (
    <div className="snow-container" aria-hidden="true">
      {snowflakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            animationDelay: flake.animationDelay,
            animationDuration: flake.animationDuration,
            fontSize: flake.fontSize,
            opacity: flake.opacity,
          }}
        >
          {flake.char}
        </span>
      ))}
    </div>
  );
}
