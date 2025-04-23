
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCcw, Save, Square, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QuantumCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visualizationType, setVisualizationType] = useState<string>('particles');
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const animationRef = useRef<number | null>(null);
  const { toast } = useToast();

  const visualizationOptions = [
    { value: 'particles', label: 'Quantum Particles' },
    { value: 'waves', label: 'Wave Function' },
    { value: 'field', label: 'EMF Field' },
    { value: 'entanglement', label: 'Entanglement' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particles: Particle[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(canvas));
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !isAnimating) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(30, 30, 60, 1)');
      gradient.addColorStop(1, 'rgba(10, 10, 30, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw visualization based on selected type
      switch (visualizationType) {
        case 'particles':
          drawParticles(ctx, particles, canvas);
          break;
        case 'waves':
          drawWaves(ctx, canvas);
          break;
        case 'field':
          drawField(ctx, canvas);
          break;
        case 'entanglement':
          drawEntanglement(ctx, canvas);
          break;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visualizationType, isAnimating]);

  // Particle interface
  interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    opacity: number;
    phase: number;
  }

  // Create a particle
  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 1,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 - 0.5,
      color: getRandomColor(),
      opacity: Math.random() * 0.5 + 0.3,
      phase: Math.random() * Math.PI * 2
    };
  };

  // Get random color
  const getRandomColor = (): string => {
    const colors = ['#8A2BE2', '#9400D3', '#9370DB', '#7B68EE', '#6A5ACD', '#4169E1', '#0000FF', '#ADD8E6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Draw particles
  const drawParticles = (ctx: CanvasRenderingContext2D, particles: Particle[], canvas: HTMLCanvasElement) => {
    particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off walls
      if (particle.x > canvas.width || particle.x < 0) {
        particle.speedX = -particle.speedX;
      }
      
      if (particle.y > canvas.height || particle.y < 0) {
        particle.speedY = -particle.speedY;
      }
      
      // Pulsating effect
      particle.phase += 0.01;
      const pulseFactor = Math.sin(particle.phase) * 0.5 + 0.5;
      const size = particle.size * (0.8 + pulseFactor * 0.4);
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity * pulseFactor;
      ctx.fill();
      
      // Draw connection lines between close particles
      particles.forEach(other => {
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = particle.color;
          ctx.globalAlpha = (1 - distance / 100) * 0.2;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
      
      ctx.globalAlpha = 1;
    });
  };

  // Draw wave function
  const drawWaves = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const time = Date.now() * 0.001;
    
    // Draw multiple wave layers
    for (let i = 0; i < 3; i++) {
      const amplitude = 20 - i * 5;
      const frequency = 0.01 + i * 0.005;
      const speed = 0.5 + i * 0.2;
      const opacity = 0.3 - i * 0.05;
      const color = i === 0 ? '#9400D3' : i === 1 ? '#4169E1' : '#ADD8E6';
      
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + 
                 Math.sin(x * frequency + time * speed) * amplitude + 
                 Math.sin(x * frequency * 2 + time * speed * 1.5) * amplitude / 2;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      // Create a gradient for more appealing waves
      const gradient = ctx.createLinearGradient(0, canvas.height / 2 - amplitude, 0, canvas.height / 2 + amplitude);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = opacity;
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
  };

  // Draw EMF field
  const drawField = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const time = Date.now() * 0.0005;
    const gridSize = 20;
    
    // Draw field grid
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        const intensity = (
          Math.sin(x * 0.01 + time) * 
          Math.cos(y * 0.01 + time * 1.5) * 
          0.5 + 0.5
        );
        
        const radius = intensity * gridSize * 0.3;
        const hue = 260 + intensity * 60; // Purple to blue hue
        
        ctx.beginPath();
        ctx.arc(x + gridSize / 2, y + gridSize / 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${intensity * 0.8})`;
        ctx.fill();
        
        // Draw connecting lines based on field intensity
        if (x < canvas.width - gridSize && y < canvas.height - gridSize) {
          const nextIntensity = (
            Math.sin((x + gridSize) * 0.01 + time) * 
            Math.cos(y * 0.01 + time * 1.5) * 
            0.5 + 0.5
          );
          
          // Horizontal line
          ctx.beginPath();
          ctx.moveTo(x + gridSize / 2, y + gridSize / 2);
          ctx.lineTo(x + gridSize + gridSize / 2, y + gridSize / 2);
          ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${(intensity + nextIntensity) * 0.3})`;
          ctx.lineWidth = (intensity + nextIntensity) * 1.5;
          ctx.stroke();
          
          // Vertical line
          const vertIntensity = (
            Math.sin(x * 0.01 + time) * 
            Math.cos((y + gridSize) * 0.01 + time * 1.5) * 
            0.5 + 0.5
          );
          
          ctx.beginPath();
          ctx.moveTo(x + gridSize / 2, y + gridSize / 2);
          ctx.lineTo(x + gridSize / 2, y + gridSize + gridSize / 2);
          ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${(intensity + vertIntensity) * 0.3})`;
          ctx.lineWidth = (intensity + vertIntensity) * 1.5;
          ctx.stroke();
        }
      }
    }
  };

  // Draw quantum entanglement visualization
  const drawEntanglement = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const time = Date.now() * 0.001;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw quantum entangled particles
    const particlePairs = 8;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;
    
    for (let i = 0; i < particlePairs; i++) {
      const angle = (i / particlePairs) * Math.PI * 2;
      const pulseFactor = Math.sin(time * 2 + i) * 0.5 + 0.5;
      
      // Particle 1
      const x1 = centerX + Math.cos(angle + time * 0.5) * radius;
      const y1 = centerY + Math.sin(angle + time * 0.5) * radius;
      
      // Entangled particle (opposite position)
      const x2 = centerX - Math.cos(angle + time * 0.5) * radius;
      const y2 = centerY - Math.sin(angle + time * 0.5) * radius;
      
      // Draw connection line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(138, 43, 226, ${0.3 + pulseFactor * 0.3})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw particles
      const particleSize = 5 + pulseFactor * 3;
      
      // Particle 1
      ctx.beginPath();
      ctx.arc(x1, y1, particleSize, 0, Math.PI * 2);
      ctx.fillStyle = '#9400D3';
      ctx.globalAlpha = 0.5 + pulseFactor * 0.5;
      ctx.fill();
      
      // Particle 2
      ctx.beginPath();
      ctx.arc(x2, y2, particleSize, 0, Math.PI * 2);
      ctx.fillStyle = '#4169E1';
      ctx.fill();
      
      ctx.globalAlpha = 1;
      
      // Pulse effect
      if (pulseFactor > 0.8) {
        ctx.beginPath();
        ctx.arc(x1, y1, particleSize * 3 * (pulseFactor - 0.8) * 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#9400D3';
        ctx.lineWidth = 1;
        ctx.globalAlpha = (1 - (pulseFactor - 0.8) * 5) * 0.5;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x2, y2, particleSize * 3 * (pulseFactor - 0.8) * 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#4169E1';
        ctx.globalAlpha = (1 - (pulseFactor - 0.8) * 5) * 0.5;
        ctx.stroke();
        
        ctx.globalAlpha = 1;
      }
    }
    
    // Draw central quantum node
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, 10
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(138, 43, 226, 0.5)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw outer glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    const outerGlow = ctx.createRadialGradient(
      centerX, centerY, 10,
      centerX, centerY, 30
    );
    outerGlow.addColorStop(0, 'rgba(138, 43, 226, 0.3)');
    outerGlow.addColorStop(1, 'rgba(138, 43, 226, 0)');
    ctx.fillStyle = outerGlow;
    ctx.fill();
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `quantum-visualization-${visualizationType}-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    
    toast({
      title: "Download Complete",
      description: "Visualization saved as PNG image",
    });
  };

  return (
    <Card className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-900 text-white p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <RefreshCcw className={`h-5 w-5 text-blue-400 ${isAnimating ? 'animate-spin' : ''}`} />
          <h3 className="text-sm font-mono">Quantum Visualization</h3>
        </div>
        <div className="flex space-x-2">
          <Select value={visualizationType} onValueChange={setVisualizationType}>
            <SelectTrigger className="w-[140px] h-7 text-xs bg-gray-800 border-gray-700">
              <SelectValue placeholder="Visualization" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              {visualizationOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={toggleAnimation}
          >
            {isAnimating ? <Square className="h-4 w-4" /> : <RefreshCcw className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={downloadCanvas}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative bg-black" style={{ height: '300px' }}>
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />
        <div className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
          {visualizationType === 'particles' && 'Quantum Particles'}
          {visualizationType === 'waves' && 'Wave Function'}
          {visualizationType === 'field' && 'EMF Field'}
          {visualizationType === 'entanglement' && 'Quantum Entanglement'}
        </div>
      </div>
    </Card>
  );
};

export default QuantumCanvas;
