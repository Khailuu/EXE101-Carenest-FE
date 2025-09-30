import { Button } from "antd";
import { StatusType } from "../hooks/useOrderData";

interface StatusFilterButtonsProps {
    statusButtons: { key: string; text: string; color: string }[];
    activeStatus: StatusType;
    setActiveStatus: (status: StatusType) => void;
}

export default function StatusFilterButtons({ statusButtons, activeStatus, setActiveStatus }: StatusFilterButtonsProps) {
    return (
        <div className="flex flex-wrap gap-3 mb-6">
            {statusButtons.map(btn => (
                <Button 
                    key={btn.key}
                    type={activeStatus === btn.key ? "primary" : "default"}
                    className={`rounded-full px-6 transition duration-300 ${
                        // Sử dụng !important để đảm bảo Tailwind ghi đè màu Antd
                        activeStatus === btn.key 
                        ? `!bg-${btn.color}-500 !border-${btn.color}-500 !text-white` 
                        : '!text-gray-700 !border-gray-300'
                    }`}
                    onClick={() => setActiveStatus(btn.key as StatusType)}
                >
                    {btn.text}
                </Button>
            ))}
        </div>
    );
}