"use client";
import { Modal, Table, Rate, Spin, Pagination, Tag } from "antd";
import { useEffect, useState } from "react";
import { reviewService, ReviewItem } from "@/services/reviewService";

interface ReviewModalProps {
  open: boolean;
  orderId?: string;
  onCloseAction: () => void; // rename for client component requirement
}

export default function ReviewModal({ open, orderId, onCloseAction }: ReviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchReviews = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const res = await reviewService.getReviews({ orderId, pageIndex, pageSize, sortDirection: 'asc' });
      setReviews(res.data.items || []);
      setTotalItems(res.data.totalItems || res.data.items.length);
    } catch (e) {
      // silent error; could add notification
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchReviews();
  }, [open, orderId, pageIndex, pageSize]);

  return (
    <Modal
      title={`Đánh giá đơn hàng`}
      open={open}
      onCancel={onCloseAction}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Table
          dataSource={reviews}
          rowKey={(r) => r.id}
          pagination={false}
          size="small"
          columns={[
            {
              title: 'Khách hàng',
              dataIndex: 'customerId',
              key: 'customerId',
              width: 120,
              render: (v: string) => <span className="text-sm">{v?.slice(0,8)}...</span>,
            },
            {
              title: 'Điểm',
              dataIndex: 'rating',
              key: 'rating',
              width: "30%",
              render: (r: number) => <Rate value={r} disabled />,
            },
            {
              title: 'Nội dung',
              dataIndex: 'contents',
              key: 'contents',
              ellipsis: true,
              render: (c: string) => <span className="text-xs">{c || 'Không có nội dung'}</span>,
            },
            {
              title: 'Loại',
              dataIndex: 'type',
              key: 'type',
              width: 80,
              render: (t: number) => <Tag color={t === 1 ? 'blue' : 'green'}>{t === 1 ? 'Service' : 'Product'}</Tag>,
            },
          ]}
        />
        <div className="mt-4 flex justify-end">
          <Pagination
            current={pageIndex}
            pageSize={pageSize}
            total={totalItems}
            onChange={(p, s) => {
              setPageIndex(p);
              setPageSize(s || pageSize);
            }}
            size="small"
            showSizeChanger
          />
        </div>
      </Spin>
    </Modal>
  );
}
