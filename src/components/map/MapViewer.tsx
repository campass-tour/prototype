import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Plus, Minus, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import mapImage from '@/assets/map.png';

interface MapViewerProps {
  /**
   * Optional class name to control the wrapper's dimensions and styling.
   * The map will automatically scale and fit within this container.
   */
  className?: string;
  /**
   * The initial zoom scale level. Defaults to 1 (fits the container).
   */
  initialScale?: number;
}

export function MapViewer({ className, initialScale = 1.2 }: MapViewerProps) {
  return (
    <div className={cn("relative w-full bg-[var(--color-surface)] overflow-hidden", className)}>
      <TransformWrapper
        initialScale={initialScale}
        minScale={1}
        maxScale={5}
        centerOnInit={true}
        limitToBounds={true}
        pinch={{ step: 5 }}
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Floating Navigation Controls */}
            <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-2 bg-[var(--color-surface)] p-2 rounded-xl shadow-[var(--shadow-card)] border border-[var(--color-state-disabled)]">
              <button 
                onClick={() => zoomIn()} 
                className="p-2 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-text-main)] transition-colors focus:outline-none"
                aria-label="Zoom in"
              >
                <Plus size={22} strokeWidth={2.5} />
              </button>
              <div className="w-full h-px bg-[var(--color-state-disabled)]" />
              <button 
                onClick={() => zoomOut()} 
                className="p-2 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-text-main)] transition-colors focus:outline-none"
                aria-label="Zoom out"
              >
                <Minus size={22} strokeWidth={2.5} />
              </button>
              <div className="w-full h-px bg-[var(--color-state-disabled)]" />
              <button 
                onClick={() => resetTransform()} 
                className="p-2 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-text-main)] transition-colors focus:outline-none"
                aria-label="Reset zoom"
              >
                <Maximize size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            {/* Interactive Map Area */}
            <TransformComponent 
              wrapperStyle={{ width: "100%", height: "100%" }} 
              contentStyle={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              {/* object-cover ensures the image maintains its aspect ratio while filling the view as best as possible bounding to limits */}
              <img 
                src={mapImage} 
                alt="Interactive Campus Map" 
                className="w-full h-full object-cover md:object-contain pointer-events-none select-none max-w-none"
                draggable={false}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
