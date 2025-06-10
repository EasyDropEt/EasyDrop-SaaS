export const OTP_STORAGE_KEY = 'otp_user_id';

export const storage = {
  saveOtpUserId: (userId: string) => {
    localStorage.setItem(OTP_STORAGE_KEY, userId);
  },

  getOtpUserId: (): string | null => {
    return localStorage.getItem(OTP_STORAGE_KEY);
  },

  removeOtpUserId: () => {
    localStorage.removeItem(OTP_STORAGE_KEY);
  }
}; 