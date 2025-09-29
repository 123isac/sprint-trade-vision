import { useState, useEffect } from 'react';
import { DerivToken, getTokens, getActiveToken, setActiveToken, clearTokens } from '@/lib/deriv-auth';

export const useDerivAuth = () => {
  const [tokens, setTokens] = useState<DerivToken[]>([]);
  const [activeToken, setActiveTokenState] = useState<DerivToken | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadedTokens = getTokens();
    const loadedActiveToken = getActiveToken();
    
    setTokens(loadedTokens);
    setActiveTokenState(loadedActiveToken);
    setIsAuthenticated(!!loadedActiveToken);
  }, []);

  const switchAccount = (token: DerivToken) => {
    setActiveToken(token);
    setActiveTokenState(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearTokens();
    setTokens([]);
    setActiveTokenState(null);
    setIsAuthenticated(false);
  };

  return {
    tokens,
    activeToken,
    isAuthenticated,
    switchAccount,
    logout
  };
};
