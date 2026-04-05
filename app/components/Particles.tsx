"use client";

export default function Particles() {
  // Generate 30 particles with random positions and timing
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${15 + Math.random() * 25}s`,
    delay: `${-Math.random() * 30}s`,
    drift: `${-30 + Math.random() * 60}px`,
  }));

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            // @ts-expect-error CSS custom property
            "--drift": p.drift,
          }}
        />
      ))}
    </div>
  );
}
