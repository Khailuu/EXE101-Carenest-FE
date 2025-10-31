import { AxiosResponse } from 'axios';
import { OwnerRegistrationPayload, LoginPayload, LoginResponse, TokenPayload } from '@/app/register/store-register/types';
import { shopsApi, authApi } from "@/constants/api"; 

const X_KEY_APT_REQUEST_KEY = 'X-Key-APT'; 
const X_KEY_APT_ACCESS_KEY = 'x-key-apt'; 

export const authService = {

  registerOwner: async (data: OwnerRegistrationPayload): Promise<string> => {
    const response: AxiosResponse = await shopsApi.post(
      '/shop/register', // Endpoint chỉ là /register
      data
    );
    const xKeyAPT = (
      response.headers[X_KEY_APT_ACCESS_KEY] || 
      response.headers['X-Key-Apt']
    );
    
    if (!xKeyAPT || typeof xKeyAPT !== 'string') {
      throw new Error("Registration successful, but the API did not provide the required X-Key-APT header.");
    }
    
    return xKeyAPT.trim(); 
  },


  verifyEmail: async (email: string, otp: string, xKeyAPT: string): Promise<void> => {
    const payload = { 
      email, 
      otp: otp.trim() 
    }; 

    await authApi.post('/auth/registerVerifyToken', payload, { 
      headers: {
        [X_KEY_APT_REQUEST_KEY]: xKeyAPT, 
      }
    });
  },


  resendOtp: async (email: string, xKeyAPT: string): Promise<void> => {
    // SỬ DỤNG authApi (Base URL: .../api/auth)
    await authApi.post('/auth/resendOTP', { email }, { 
      headers: {
        [X_KEY_APT_REQUEST_KEY]: xKeyAPT,
      }
    });
  },
  
  login: async (data: LoginPayload): Promise<string> => {
    const response: AxiosResponse<LoginResponse> = await authApi.post(
      '/auth/login', 
      data
    );
    console.log(response)
    const accessToken = response.data?.data?.accessToken;

    if (!accessToken) {
        throw new Error("Login successful, but no access token received in the 'data' field.");
    }
    
    return accessToken; // Trả về Access Token
  },

  getUserCount: async (): Promise<number> => {
    const response: AxiosResponse = await authApi.get('/auth/admin/accounts/count');
    return response.data.data; // API trả về data: 5
  },
};


export const decodeTokenPayload = (token: string): TokenPayload => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        
        if (!Array.isArray(payload.roles)) {
            payload.roles = [payload.roles]; 
        }

        return payload as TokenPayload;
    } catch (e) {
        console.error("Failed to decode token:", e);
        return { sub: "", role: ['ROLE_USER'], exp: 0, userId: "" }; 
    }
};

export const getUserIdFromTokenPayload = (token: string): string => {
    const payload = decodeTokenPayload(token);
    console.log(payload)
    return payload.userId || ''; 
};