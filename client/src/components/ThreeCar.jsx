import { useState } from 'react';

export default function ThreeCar() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handlePointerMove(event) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    setTilt({
      x: (0.5 - y) * 9,
      y: (x - 0.5) * 16,
    });
  }

  function resetTilt() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div
      className="cjir-service-car-scene"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <img
        className="cjir-service-car-image"
        src="/images/red-honda-civic.webp"
        alt="A red 2022 Honda Civic four-door sedan"
        style={{
          '--car-tilt-x': `${tilt.x.toFixed(2)}deg`,
          '--car-tilt-y': `${tilt.y.toFixed(2)}deg`,
        }}
      />
    </div>
  );
}
