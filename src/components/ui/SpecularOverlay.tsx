'use client'
import React, { useRef, useEffect, useState } from 'react'

interface SpecularOverlayProps {
  borderRadius?: string; // Optional if not fully rounded
}

export default function SpecularOverlay({ 
  borderRadius = '9999px'
}: SpecularOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const [opacity, setOpacity] = useState(0);
  
  const currentAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const targetOpacityRef = useRef(0.2); // Idle opacity
  const isIdleRef = useRef(true);
  const idleAngleRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    // Disable on mobile/touch if prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOpacity(0.1);
      return;
    }

    const proximity = 250;
    
    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < proximity) {
        isIdleRef.current = false;
        // Calculate angle. atan2 returns -PI to PI
        // Add 90 so 0 deg is top.
        let target = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        targetAngleRef.current = target;
        
        // Intensity fades by proximity (0.2 idle up to 1.0 close)
        const intensity = 0.2 + (0.8 * (1 - (dist / proximity)));
        targetOpacityRef.current = intensity;
      } else {
        isIdleRef.current = true;
        targetOpacityRef.current = 0.2; // subtle idle opacity
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    
    let lastTime = performance.now();
    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (isIdleRef.current) {
        // Idle sweep: speed ~0.3 turns per sec -> ~108 deg/sec
        idleAngleRef.current = (idleAngleRef.current + 108 * dt) % 360;
        targetAngleRef.current = idleAngleRef.current;
      } else {
        // Sync idle angle to active angle so it doesn't jump when leaving
        idleAngleRef.current = targetAngleRef.current;
      }

      // Smooth interpolation (lerp)
      let da = targetAngleRef.current - currentAngleRef.current;
      da = ((da + 540) % 360) - 180;
      currentAngleRef.current += da * 8 * dt; // Lerp speed 8

      // Opacity lerp
      setOpacity(prev => {
        return prev + (targetOpacityRef.current - prev) * 5 * dt;
      });

      setAngle(currentAngleRef.current);

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ borderRadius, zIndex: 10 }}
    >
      <div 
        className="absolute inset-[0px]"
        style={{
          borderRadius,
          background: `conic-gradient(from ${angle}deg at 50% 50%, transparent 0%, rgba(200, 210, 220, 0.05) 35%, rgba(255, 255, 255, 0.95) 50%, rgba(200, 210, 220, 0.05) 65%, transparent 100%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
          opacity: opacity,
        }}
      />
    </div>
  );
}
