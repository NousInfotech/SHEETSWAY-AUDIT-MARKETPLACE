'use client';

import React, { 
  createContext, 
  useState, 
  useContext, 
  ReactNode, 
  useEffect 
} from 'react';

// Define the shape of the context data
interface ConnectionContextType {
  connectionId: string | null;
  setConnectionId: (id: string | null) => void;
  isLoading: boolean;
}

// Create the context with an undefined initial value
const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

// Define the Provider component
export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to run only once on the client to check localStorage initially
  useEffect(() => {
    try {
      const storedId = localStorage.getItem('saltedge_connection_id');
      if (storedId) {
        setConnectionId(storedId);
      }
    } catch (error) {
      console.error("Could not access localStorage on initial load", error);
    }
    setIsLoading(false); // Finished initial check
  }, []);

  // Effect to listen for changes in localStorage from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Check if the change is for our specific key
      if (event.key === 'saltedge_connection_id') {
        // Update the state with the new value from the other tab
        setConnectionId(event.newValue);
      }
    };

    // Add the event listener
    window.addEventListener('storage', handleStorageChange);

    // IMPORTANT: Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // A handler function to update both state and localStorage
  const handleSetConnectionId = (id: string | null) => {
    setConnectionId(id);
    if (id) {
      localStorage.setItem('saltedge_connection_id', id);
    } else {
      // If the ID is set to null, remove it from storage (e.g., for a "Disconnect" button)
      localStorage.removeItem('saltedge_connection_id');
    }
  };

  // The value that will be provided to all consuming components
  const contextValue: ConnectionContextType = {
    connectionId,
    setConnectionId: handleSetConnectionId,
    isLoading,
  };

  return (
    <ConnectionContext.Provider value={contextValue}>
      {children}
    </ConnectionContext.Provider>
  );
};

// Custom hook for consuming the context easily and safely
export const useConnection = (): ConnectionContextType => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    // This error is helpful for developers, ensuring the hook is used correctly
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};