import { AxiosInstance } from "axios";

// Định nghĩa thông tin chủ cửa hàng nhập ở Bước 1
export interface OwnerInfo {
  username: string;
  fullName: string;
  birthday: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  email: string;
  password: string;
}

// Payload gửi đến API đăng ký (bao gồm cả reEnterPassword)
export interface OwnerRegistrationPayload extends OwnerInfo {
  reEnterPassword: string;
}

// Dữ liệu mã xác minh nhập ở Bước 2
export interface VerificationData {
  verificationCode: string;
}

// --- KIỂU DỮ LIỆU LOGIN MỚI ---

// Payload gửi đến API Login
export interface LoginPayload {
  username: string;
  password: string;
}

// Kiểu dữ liệu cho trường 'data' trong response API
export interface LoginData {
    accessToken: string; // Tên trường chính xác
    refreshToken: string;
    username: string;
}

// Kiểu dữ liệu trả về từ API Login (Giả định response.data là đối tượng này)
export interface LoginResponse {
    status: string;
    code: number;
    message: string;
    data: LoginData;
}


// Kiểu dữ liệu cho Token Payload (sau khi giải mã)
export interface TokenPayload {
    userId: string;
    sub: string; 
    role: ('ROLE_SHOP' | 'ROLE_USER' | 'ROLE_ADMIN')[]; 
    exp: number; 
}
