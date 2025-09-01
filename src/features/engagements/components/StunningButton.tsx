import * as React from 'react';
import { cn } from '@/lib/utils'; 

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const StunningButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full p-4 text-center text-lg font-bold tracking-wide text-white shadow-lg transition-all duration-300 ease-in-out',
          'bg-gradient-to-r from-purple-600 via-pink-500 to-red-500', // Gradient background
          'hover:from-purple-700 hover:via-pink-600 hover:to-red-600', // Darker gradient on hover
          'hover:scale-105 transform', // Slight scale up on hover
          'focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-75', // Focus ring
          'active:scale-95', // Slightly shrink on click
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {/* Optional: Add a subtle animation or overlay for extra flair */}
        <span
          className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300 ease-in-out"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
          }}
        />
      </button>
    );
  }
);
StunningButton.displayName = 'StunningButton';

export { StunningButton };