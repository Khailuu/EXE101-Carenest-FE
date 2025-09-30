export async function sendOtp(email: string) {
    // Call API gửi OTP
    console.log("Send OTP to", email);
    return true;
  }
  
  export async function verifyOtp(email: string, otp: string) {
    // Call API xác minh OTP
    console.log("Verify OTP", otp, "for", email);
    return otp === "123456"; // demo
  }
  
  export async function resetPassword(email: string, password: string) {
    // Call API đổi mật khẩu
    console.log("Reset password for", email, "to", password);
    return true;
  }
  