import { Play } from 'lucide-react';

type StartButtonProps = {
  text?: string;
  onClick: () => void;
};

export const StartButton = ({
  text = 'Get Started',
  onClick
}: StartButtonProps) => {
  return (
    <button
      onClick={onClick}
      className='group // The Gradient Background // The Hover Effect: Gradient shifts // The Shadow Effect // The Lift Up on Hover Effect // The Press Down on Click Effect // The Subtle Pulse Animation animate-pulse-slow relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-xl font-bold text-white shadow-lg shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-l hover:shadow-xl hover:shadow-purple-500/40 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none active:scale-95'
    >
      {/* The Icon */}
      <Play className='h-6 w-6 transition-transform duration-500 group-hover:rotate-180' />

      {/* The Text */}
      <span>{text}</span>
    </button>
  );
};
