import { apiSecured, reviewApi } from "@/constants/api";

export interface ReviewItem {
  id: string;
  customerId: string;
  itemDetailId: string;
  rating: number;
  contents: string;
  imgUrl: string;
  type: number; // 1/2: service/product? (assumption)
  createdAt?: string;
}

export interface ReviewQueryParams {
  orderId?: string;
  pageIndex?: number;
  pageSize?: number;
  sortDirection?: 'asc' | 'desc';
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: {
    items: ReviewItem[];
    totalItems?: number;
    pageIndex?: number;
    pageSize?: number;
  };
}

export const reviewService = {
  async getReviews(params: ReviewQueryParams): Promise<ReviewResponse> {
    if (!params.orderId) {
      return {
        success: true,
        message: 'No orderId supplied',
        data: { items: [], totalItems: 0, pageIndex: params.pageIndex || 1, pageSize: params.pageSize || 10 },
      };
    }

    const query = new URLSearchParams({
      pageIndex: String(params.pageIndex || 1),
      pageSize: String(params.pageSize || 10),
      sortDirection: params.sortDirection || 'asc',
      orderId: params.orderId,
    });

    const res = await reviewApi.get(`/review?${query.toString()}`);
    return res.data as ReviewResponse;
  },
};
