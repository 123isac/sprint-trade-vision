// Deriv OAuth and API utilities
const APP_ID = '104901';
const DERIV_OAUTH_URL = 'https://oauth.deriv.com/oauth2/authorize';
const WS_URL = `wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`;

export interface DerivToken {
  token: string;
  accountType: 'demo' | 'real';
  loginId: string;
  currency: string;
  balance: number;
}

// OAuth Login
export const initiateDerivLogin = () => {
  const redirectUri = `${window.location.origin}/auth-callback`;
  const authUrl = `${DERIV_OAUTH_URL}?app_id=${APP_ID}&l=EN&brand=deriv&redirect_uri=${encodeURIComponent(redirectUri)}`;
  console.log('Redirecting to Deriv OAuth:', authUrl);
  window.location.href = authUrl;
};

// Token Storage
export const saveTokens = (tokens: DerivToken[]) => {
  try {
    localStorage.setItem('deriv_tokens', JSON.stringify(tokens));
  } catch (error) {
    console.error('Failed to save tokens:', error);
  }
};

export const getTokens = (): DerivToken[] => {
  try {
    const stored = localStorage.getItem('deriv_tokens');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to retrieve tokens:', error);
    return [];
  }
};

export const clearTokens = () => {
  localStorage.removeItem('deriv_tokens');
  localStorage.removeItem('active_token');
};

export const getActiveToken = (): DerivToken | null => {
  try {
    const stored = localStorage.getItem('active_token');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
};

export const setActiveToken = (token: DerivToken) => {
  localStorage.setItem('active_token', JSON.stringify(token));
};

// WebSocket Connection
export const createDerivWS = () => {
  return new WebSocket(WS_URL);
};

// API Request Helpers
export const authorizeToken = (ws: WebSocket, token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const requestId = `auth_${Date.now()}`;
    
    const handler = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.req_id === requestId) {
        ws.removeEventListener('message', handler);
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.authorize);
        }
      }
    };
    
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      authorize: token,
      req_id: requestId
    }));
  });
};

export const getBalance = (ws: WebSocket): Promise<any> => {
  return new Promise((resolve, reject) => {
    const requestId = `balance_${Date.now()}`;
    
    const handler = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.req_id === requestId) {
        ws.removeEventListener('message', handler);
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.balance);
        }
      }
    };
    
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      balance: 1,
      subscribe: 1,
      req_id: requestId
    }));
  });
};

export const buyContract = (
  ws: WebSocket,
  params: {
    amount: number;
    basis: string;
    contract_type: string;
    currency: string;
    duration: number;
    duration_unit: string;
    symbol: string;
  }
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const requestId = `buy_${Date.now()}`;
    
    const handler = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.req_id === requestId) {
        ws.removeEventListener('message', handler);
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.buy);
        }
      }
    };
    
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      buy: 1,
      price: params.amount,
      parameters: {
        amount: params.amount,
        basis: params.basis,
        contract_type: params.contract_type,
        currency: params.currency,
        duration: params.duration,
        duration_unit: params.duration_unit,
        symbol: params.symbol
      },
      req_id: requestId
    }));
  });
};

export const getAccountStatus = (ws: WebSocket): Promise<any> => {
  return new Promise((resolve, reject) => {
    const requestId = `status_${Date.now()}`;
    
    const handler = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.req_id === requestId) {
        ws.removeEventListener('message', handler);
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.get_account_status);
        }
      }
    };
    
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      get_account_status: 1,
      req_id: requestId
    }));
  });
};
