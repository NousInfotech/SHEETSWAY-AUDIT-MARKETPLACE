'use client';

import { useState, useRef, useLayoutEffect, type ReactNode } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface FitContentScrollAreaProps {
  children: ReactNode;
  // This is the key: We pass in the data that determines the height.
  // When this data changes, the component will automatically resize.
  dependency: any; 
  className?: string;
  minHeight?: string | number;
  minWidth?: string | number;
}

export function FitContentScrollArea({
  children,
  dependency,
  className,
  minHeight,
  minWidth,
}: FitContentScrollAreaProps) {
  
  // All the complex logic now lives here, once.
  const [height, setHeight] = useState<number | 'auto'>('auto');
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // We add a tiny delay to ensure the DOM has fully settled,
    // which can help with complex nested components.
    const timer = setTimeout(() => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        setHeight(contentHeight);
      }
    }, 0);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [dependency]); // The component now correctly re-sizes when its dependency changes.

  return (
    <div
      style={{ position: 'relative', height: height, minHeight: minHeight }}
      className={cn(className)}
    >
      <ScrollArea
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <div ref={contentRef} style={{ minWidth: minWidth }}>
          {children}
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </div>
  );
}