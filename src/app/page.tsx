'use client'

import React, { JSX } from 'react';
import { Card, Button } from 'antd'; // Sử dụng Card và Button của Antd
import {
  HeartOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

// --- INTERFACES (TypeScript Types) ---
interface Service {
  title: string;
  price: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

interface Product {
  name: string;
  category: string;
  price: string;
  image: string;
}

// --- MOCK DATA (Dữ liệu giả) ---
const serviceList: Service[] = [
  { 
    title: 'Tắm & Chải lông cơ bản', 
    price: 'Từ 150.000 VNĐ', 
    description: 'Giúp thú cưng sạch sẽ, thơm tho, loại bỏ lông rụng.', 
    image: 'https://picsum.photos/id/237/400/300',
    icon: <HeartOutlined className="text-4xl text-teal-500" />
  },
  { 
    title: 'Tiêm ngừa & Tẩy giun', 
    price: 'Theo phác đồ', 
    description: 'Bảo vệ thú cưng khỏi các bệnh truyền nhiễm nguy hiểm.', 
    image: 'https://picsum.photos/id/1014/400/300',
    icon: <CheckCircleOutlined className="text-4xl text-teal-500" />
  },
  { 
    title: 'Cắt tỉa lông chuyên nghiệp', 
    price: 'Từ 300.000 VNĐ', 
    description: 'Tạo kiểu lông thời trang, gọn gàng, phù hợp giống.', 
    image: 'https://picsum.photos/id/160/400/300',
    icon: <HeartOutlined className="text-4xl text-teal-500" />
  },
  { 
    title: 'Kiểm tra sức khỏe tổng quát', 
    price: 'Miễn phí (lần đầu)', 
    description: 'Bác sĩ thú y kiểm tra toàn diện, tư vấn chăm sóc.', 
    image: 'https://picsum.photos/id/1084/400/300',
    icon: <CheckCircleOutlined className="text-4xl text-teal-500" />
  },
];

const productList: Product[] = [
  { name: 'Thức ăn hạt cao cấp', category: 'Dinh dưỡng', price: '250.000 VNĐ', image: 'https://picsum.photos/id/200/400/300' },
  { name: 'Dầu gội khô chiết xuất tự nhiên', category: 'Chăm sóc da lông', price: '120.000 VNĐ', image: 'https://picsum.photos/id/40/400/300' },
  { name: 'Đồ chơi gặm nhai bền bỉ', category: 'Phụ kiện', price: '85.000 VNĐ', image: 'https://picsum.photos/id/60/400/300' },
  { name: 'Vòng cổ chống ve rận', category: 'Sức khỏe', price: '190.000 VNĐ', image: 'https://picsum.photos/id/20/400/300' },
];

// --- HOME COMPONENT ---
export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- 1. HERO SECTION: Giới thiệu chung --- */}
      <header className="bg-gradient-to-r from-teal-400 to-green-300 text-white py-20 md:py-32 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white">
            Kết nối yêu thương, Chăm sóc trọn vẹn
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-teal-100">
            Dễ dàng đặt lịch dịch vụ và mua sắm sản phẩm từ các cửa hàng thú cưng uy tín.
          </p>
          <Button 
            size="large"
            type="primary"
            className="bg-white text-teal-600 border-none font-semibold text-lg hover:!bg-gray-100 transition duration-300 shadow-lg hover:!scale-105"
            href="#dich-vu"
          >
            Tìm Bác sĩ Thú y ngay
          </Button>
        </div>
      </header>

      {/* --- 2. SERVICES SECTION: Tắm rửa thú cưng và Tiêm ngừa --- */}
      <section id="dich-vu" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Các Dịch Vụ Chăm Sóc Sức Khỏe & Thẩm Mỹ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceList.map((service, index) => (
              <Card 
                key={index}
                hoverable
                className="rounded-xl overflow-hidden shadow-lg transition duration-300 border border-teal-100 bg-teal-50"
                cover={<img alt={service.title} src={service.image} className="w-full h-48 object-cover"/>}
              >
                <div className="mb-2">{service.icon}</div>
                <Card.Meta
                  title={<span className="text-xl font-semibold text-teal-700">{service.title}</span>}
                  description={
                    <div className='mt-2'>
                        <p className="text-lg font-bold text-pink-500 mb-2">{service.price}</p>
                        <p className="text-gray-600">{service.description}</p>
                    </div>
                  }
                />
                <Button 
                  type="default" 
                  className="mt-4 w-full border-teal-500 text-teal-500 hover:!bg-teal-100 hover:!text-teal-600"
                >
                  Đặt Lịch Ngay
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. PRODUCT SECTION: List các sản phẩm cho thú cưng --- */}
      <section id="san-pham" className="py-16 bg-lime-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Sản Phẩm Tốt Nhất Cho Người Bạn Bốn Chân
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.map((product, index) => (
              <Card 
                key={index}
                hoverable
                className="rounded-xl overflow-hidden shadow-md border border-lime-200 bg-white"
                cover={<img alt={product.name} src={product.image} className="w-full h-32 object-cover"/>}
              >
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">{product.category}</p>
                    <h3 className="text-lg font-semibold text-gray-700 mt-1">{product.name}</h3>
                    <p className="text-xl font-bold text-orange-500 mt-2">{product.price}</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<ShoppingCartOutlined />}
                    className="mt-4 w-full bg-orange-400 border-orange-400 hover:!bg-orange-500 transition duration-300"
                >
                    Thêm vào giỏ
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer Placeholder */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>© 2025 PetConnect. Hợp tác cùng các chuỗi phòng khám và cửa hàng thú cưng.</p>
      </footer>
    </div>
  );
}