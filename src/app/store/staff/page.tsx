// src/app/store/staff/page.tsx

"use client";

import { useState, JSX } from 'react';
import { message } from 'antd';
import StoreHeader from '../info/components/StoreHeader'; // Dùng lại Header đã sửa
import StaffFilters from './components/StaffFilters';
import StaffTable from './components/StaffTable';
import StaffFormModal from './components/StaffFormModal';

export type StaffRole = 'Quản lý' | 'Nhân viên';
export type StaffStatus = 'Hoạt động' | 'Tạm khóa';

export interface StaffData {
    key: string;
    avatar: string;
    name: string;
    email: string;
    dob: string; // Date of Birth
    startDate: string; // Ngày bắt đầu làm việc
    branch: string;
    role: StaffRole;
    status: StaffStatus;
}

// Dữ liệu mock
const initialStaffData: StaffData[] = [
    { key: '1', avatar: 'https://i.pravatar.cc/150?img=68', name: 'Vũ Hoàng Trung', email: 'trung.vu@pet.com', dob: '12/06/1995', startDate: '01/03/2023', branch: 'Chi nhánh 1', role: 'Quản lý', status: 'Hoạt động' },
    { key: '2', avatar: 'https://i.pravatar.cc/150?img=33', name: 'Lê Thị Mỹ Anh', email: 'anh.le@pet.com', dob: '05/11/1998', startDate: '15/05/2023', branch: 'Chi nhánh 1', role: 'Nhân viên', status: 'Hoạt động' },
    { key: '3', avatar: 'https://i.pravatar.cc/150?img=50', name: 'Trần Văn Long', email: 'long.tran@pet.com', dob: '20/01/2000', startDate: '20/09/2023', branch: 'Chi nhánh 2', role: 'Nhân viên', status: 'Tạm khóa' },
    { key: '4', avatar: 'https://i.pravatar.cc/150?img=5', name: 'Nguyễn Thanh Nga', email: 'nga.nguyen@pet.com', dob: '01/01/1997', startDate: '01/01/2024', branch: 'Chi nhánh 2', role: 'Nhân viên', status: 'Hoạt động' },
];

export default function StaffManagementPage(): JSX.Element {
    const [staffData, setStaffData] = useState<StaffData[]>(initialStaffData);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffData | null>(null);
    
    // State cho tìm kiếm nâng cao (Giả lập)
    const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

    // Xử lý Thêm/Sửa nhân viên
    const handleSaveStaff = (values: any) => {
        if (editingStaff) {
            // Logic Sửa
            setStaffData(prev => prev.map(s => s.key === editingStaff.key ? { ...s, ...values } : s));
            message.success(`Cập nhật thông tin nhân viên ${values.name} thành công!`);
        } else {
            // Logic Thêm mới
            const newKey = String(staffData.length > 0 ? Math.max(...staffData.map(s => Number(s.key))) + 1 : 1);
            const newStaff: StaffData = { 
                key: newKey, 
                avatar: 'https://i.pravatar.cc/150?img=51', // Avatar mặc định
                status: 'Hoạt động', // Mặc định là Hoạt động khi tạo mới
                ...values 
            };
            setStaffData(prev => [newStaff, ...prev]);
            message.success(`Tạo tài khoản nhân viên ${values.name} thành công!`);
        }
        setIsFormModalOpen(false);
        setEditingStaff(null);
    };

    // Mở Modal và truyền dữ liệu để Sửa/Xem chi tiết
    const handleOpenFormModal = (staff: StaffData | null) => {
        setEditingStaff(staff);
        setIsFormModalOpen(true);
    };

    // Xử lý Xóa nhân viên (Giả lập)
    const handleDeleteStaff = (key: string, name: string) => {
        setStaffData(prev => prev.filter(s => s.key !== key));
        message.success(`Đã xóa tài khoản nhân viên ${name}.`);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <StoreHeader /> 
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Quản lý nhân viên
                </h1>
                
                {/* Thanh Filters */}
                <StaffFilters 
                    setIsFormModalOpen={setIsFormModalOpen} 
                    setIsAdvancedSearchOpen={setIsAdvancedSearchOpen}
                    isAdvancedSearchOpen={isAdvancedSearchOpen}
                />
                
                {/* Bảng nhân viên */}
                <StaffTable 
                    data={staffData} 
                    handleOpenFormModal={handleOpenFormModal}
                    handleDelete={handleDeleteStaff}
                />
            </div>
            
            {/* Modal Tạo/Sửa/Xem chi tiết nhân viên */}
            <StaffFormModal
                isModalOpen={isFormModalOpen}
                setIsModalOpen={setIsFormModalOpen}
                editingStaff={editingStaff}
                handleSave={handleSaveStaff}
            />
        </div>
    );
}