export interface OwnerInfo {
  username: string;
  fullName: string;
  email: string;
  birthDate: string;
  gender: string;
  password: string;
}

export interface CCCDInfo {
  cccdFront: File | null;
  cccdBack: File | null;
}

export interface StoreInfo {
  storeName: string;
  description: string;
  avatar?: File;
}
