
import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create 5 golden entities
    const entities = Array.from({ length: 7}, (_, index) => ({
      id: index,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      targetX: Math.random() * canvas.width,
      targetY: Math.random() * canvas.height,
      speed: 0.5 + Math.random() * 1.5,
      trail: [] as Array<{ x: number; y: number; opacity: number; size: number }>,
      trailLength:25 + Math.random() * 20,
      size: 5 + Math.random() * 6,
      pulsePhase: Math.random() * Math.PI * 20,
      nextTargetTime: Date.now() + 2000 + Math.random() * 3000,
      mass: 1 + Math.random() * 90
    }));

    // Particles that break off - now blend with background
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    }> = [];

    // Environment pulse zones
    const pulseZones: Array<{
      x: number;
      y: number;
      radius: number;
      intensity: number;
      phase: number;
    }> = [];

    let animationId: number;
    let time = 0;

    // Collision detection and response
    const handleCollisions = () => {
      for (let i = 0; i < entities.length; i++) {
        for (let j = i + 1; j < entities.length; j++) {
          const entity1 = entities[i];
          const entity2 = entities[j];
          
          const dx = entity2.x - entity1.x;
          const dy = entity2.y - entity1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = entity1.size + entity2.size;
          
          if (distance < minDistance) {
            // Calculate collision response
            const overlap = minDistance - distance;
            const separationX = (dx / distance) * (overlap * 0.5);
            const separationY = (dy / distance) * (overlap * 0.5);
            
            // Separate entities
            entity1.x -= separationX;
            entity1.y -= separationY;
            entity2.x += separationX;
            entity2.y += separationY;
            
            // Calculate new velocities using elastic collision
            const normalX = dx / distance;
            const normalY = dy / distance;
            
            const relativeVelocityX = entity2.vx - entity1.vx;
            const relativeVelocityY = entity2.vy - entity1.vy;
            
            const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;
            
            if (velocityAlongNormal > 0) continue;
            
            const restitution = 0.8;
            const impulse = 2 * velocityAlongNormal / (entity1.mass + entity2.mass);
            
            entity1.vx += impulse * entity2.mass * normalX * restitution;
            entity1.vy += impulse * entity2.mass * normalY * restitution;
            entity2.vx -= impulse * entity1.mass * normalX * restitution;
            entity2.vy -= impulse * entity1.mass * normalY * restitution;
            
            // Create collision particles
            for (let k = 0; k < 3; k++) {
              particles.push({
                x: (entity1.x + entity2.x) / 2,
                y: (entity1.y + entity2.y) / 2,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 30 + Math.random() * 20,
                maxLife: 30 + Math.random() * 20,
                size: 1 + Math.random() * 2
              });
            }
          }
        }
      }
    };

    const animate = () => {
      time += 0.016;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'; // Very subtle dark overlay
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update each entity
      entities.forEach(entity => {
        const now = Date.now();
        if (now > entity.nextTargetTime) {
          entity.targetX = Math.random() * canvas.width;
          entity.targetY = Math.random() * canvas.height;
          entity.speed = 0.3 + Math.random() * 2;
          entity.nextTargetTime = now + 1500 + Math.random() * 4000;
        }

        // Smooth movement towards target with organic curves
        const dx = entity.targetX - entity.x;
        const dy = entity.targetY - entity.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          entity.vx += (dx / distance) * entity.speed * 0.02;
          entity.vy += (dy / distance) * entity.speed * 0.02;
        }

        // Add some randomness and organic feel
        entity.vx += (Math.random() - 0.5) * 0.1;
        entity.vy += (Math.random() - 0.5) * 0.1;

        // Apply drag
        entity.vx *= 0.98;
        entity.vy *= 0.98;

        entity.x += entity.vx;
        entity.y += entity.vy;

        // Boundary collision with soft bouncing
        if (entity.x < entity.size || entity.x > canvas.width - entity.size) {
          entity.vx *= -0.8;
          entity.x = Math.max(entity.size, Math.min(canvas.width - entity.size, entity.x));
        }
        if (entity.y < entity.size || entity.y > canvas.height - entity.size) {
          entity.vy *= -0.8;
          entity.y = Math.max(entity.size, Math.min(canvas.height - entity.size, entity.y));
        }

        // Update trail
        entity.trail.unshift({
          x: entity.x,
          y: entity.y,
          opacity: 1,
          size: entity.size
        });

        if (entity.trail.length > entity.trailLength) {
          entity.trail.pop();
        }

        // Update trail opacity and size
        entity.trail.forEach((point, index) => {
          point.opacity = (1 - index / entity.trailLength) * 0.8;
          point.size = entity.size * (1 - index / entity.trailLength * 0.5);
        });

        // Create particles occasionally
        if (Math.random() < 0.03) {
          particles.push({
            x: entity.x + (Math.random() - 0.5) * 20,
            y: entity.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 60 + Math.random() * 40,
            maxLife: 60 + Math.random() * 40,
            size: 2 + Math.random() * 4
          });
        }
      });

      // Handle collisions between entities
      handleCollisions();

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.life--;

        if (particle.life <= 0) {
          particles.splice(i, 1);
        }
      }

      // Update pulse zones around entities
      entities.forEach(entity => {
        if (Math.random() < 0.01) {
          pulseZones.push({
            x: entity.x,
            y: entity.y,
            radius: 0,
            intensity: 0.2 + Math.random() * 0.15,
            phase: 0
          });
        }
      });

      // Update pulse zones
      for (let i = pulseZones.length - 1; i >= 0; i--) {
        const zone = pulseZones[i];
        zone.radius += 2;
        zone.intensity *= 0.98;
        zone.phase += 0.1;

        if (zone.intensity < 0.01 || zone.radius > 150) {
          pulseZones.splice(i, 1);
        }
      }

      // Draw pulse zones (environmental reaction)
      pulseZones.forEach(zone => {
        const gradient = ctx.createRadialGradient(
          zone.x, zone.y, 0,
          zone.x, zone.y, zone.radius
        );
        gradient.addColorStop(0, `rgba(255, 215, 0, ${zone.intensity * 0.1})`);
        gradient.addColorStop(0.7, `rgba(255, 215, 0, ${zone.intensity * 0.05})`);
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw trails for each entity
      entities.forEach(entity => {
        entity.trail.forEach((point, index) => {
          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, point.size
          );
          gradient.addColorStop(0, `rgba(255, 215, 0, ${point.opacity * 0.8})`);
          gradient.addColorStop(0.5, `rgba(255, 193, 7, ${point.opacity * 0.4})`);
          gradient.addColorStop(1, `rgba(255, 215, 0, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // Draw main entities with pulsing glow
      entities.forEach(entity => {
        entity.pulsePhase += 0.05;
        const pulseSize = entity.size + Math.sin(entity.pulsePhase) * 2;
        
        const entityGradient = ctx.createRadialGradient(
          entity.x, entity.y, 0,
          entity.x, entity.y, pulseSize * 1.5
        );
        entityGradient.addColorStop(0, 'rgba(255, 215, 0, 1)');
        entityGradient.addColorStop(0.3, 'rgba(255, 193, 7, 0.8)');
        entityGradient.addColorStop(0.6, 'rgba(255, 215, 0, 0.4)');
        entityGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

        ctx.fillStyle = entityGradient;
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, pulseSize * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        ctx.fillStyle = 'rgba(106, 71, 165, 0.9)';
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, pulseSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw particles with background-blended colors
      particles.forEach(particle => {
        const lifeRatio = particle.life / particle.maxLife;
        const alpha = lifeRatio * 0.3; // Reduced opacity to blend with background
        
        // Use darker, more muted colors that blend with the background
        ctx.fillStyle = `rgba(100, 120, 150, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * lifeRatio, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        mixBlendMode: 'screen',
        opacity: 0.7
      }}
    />
  );
};

export default AnimatedBackground;
