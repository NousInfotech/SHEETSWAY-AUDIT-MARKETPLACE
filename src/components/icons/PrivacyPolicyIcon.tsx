'use client';

import { Player } from '@lordicon/react';
// Import the 'ComponentRef' type from React
import { useRef, useEffect, ComponentRef } from 'react';

import iconData from 'public/assets/icons/privacy-policy-icon.json';

// This is the correct type for the Player component's ref
type PlayerRef = ComponentRef<typeof Player>;

const PrivacyPolicyIcon = () => {
  // Use the defined type for the ref
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    const playAnimation = () => {
      playerRef.current?.playFromBeginning();
    };

    const interval = setInterval(playAnimation, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <Player ref={playerRef} icon={iconData} size={96} />;
};

export default PrivacyPolicyIcon;
