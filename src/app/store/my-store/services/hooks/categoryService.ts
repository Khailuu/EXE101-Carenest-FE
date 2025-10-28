// src/app/store/my-store/services/hooks/categoryService.ts
import axios from "axios";

const API_URL = "https://category.devnest.io.vn/swagger/index.html"; // ⚠️ thay URL thật

export const createCategory = async (payload: { name: string; shopId: string }) => {
  const res = await axios.post(API_URL, payload);
  return res.data;
};

export const getAllCategories = async (shopId: string) => {
  const res = await axios.get(`${API_URL}?shopId=${shopId}`);
  return res.data;
};
