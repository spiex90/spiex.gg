"use client";

export default function AnimatedBackground() {
  return (
    <>
      {/* Gradient mesh orbs */}
      <div className="bg-mesh" aria-hidden="true" />
      <div className="bg-orb-3" aria-hidden="true" />

      {/* Subtle grid overlay */}
      <div className="bg-grid" aria-hidden="true" />

      {/* Noise texture */}
      <div className="bg-noise" aria-hidden="true" />
    </>
  );
}
