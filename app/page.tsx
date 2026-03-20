// app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useCRMStore } from '@/store/useCRMStore';
import {
    TrendingUp,
    Wallet,
    Truck,
    ArrowRight,
    Building2,
    CheckCircle2,
    Clock
} from 'lucide-react';

export default function DashboardPage() {
    const { deals } = useCRMStore();

    // คำนวณตัวเลขสถิติจาก Mock Data
    const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.amount, 0);
    const wonDealsValue = deals.filter(d => d.stage === 'Won').reduce((sum, deal) => sum + deal.amount, 0);
    const wonDealsCount = deals.filter(d => d.stage === 'Won').length;

    // ตัวเลขสมมติสำหรับใช้พรีเซนต์ (เงินที่ประหยัดได้)
    const totalSavedCost = 12450;

    return (
        <div className="h-full flex flex-col space-y-6">

            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">ภาพรวมธุรกิจ (Overview)</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        ยินดีต้อนรับกลับมา! นี่คือสรุปยอดขายและต้นทุนโลจิสติกส์ของคุณในเดือนนี้
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/crm"
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        เปิดกระดานงานขาย
                    </Link>
                    <Link
                        href="/logistics"
                        className="px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 shadow-sm flex items-center gap-2 transition-colors"
                    >
                        <Truck className="w-4 h-4" />
                        จัดการรถขนส่ง
                    </Link>
                </div>
            </div>

            {/* KPI Cards (ตัวเลขสำคัญ) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Pipeline */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">มูลค่างานขายรวม (Pipeline)</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                ฿ {totalPipelineValue.toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs text-blue-600 font-medium mt-4 flex items-center gap-1">
                        <span className="bg-blue-100 px-1.5 py-0.5 rounded">+12%</span> จากเดือนที่แล้ว
                    </p>
                </div>

                {/* Card 2: Won Deals */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">ปิดการขายสำเร็จ</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                ฿ {wonDealsValue.toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <Wallet className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                        จำนวน {wonDealsCount} ออเดอร์ (รอจัดส่ง)
                    </p>
                </div>

                {/* Card 3: Saved Cost (The Killer Metric) */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl border border-emerald-400 shadow-md text-white relative overflow-hidden">
                    {/* ลายน้ำพื้นหลัง */}
                    <Truck className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-sm font-medium text-emerald-100">ค่าขนส่งที่ประหยัดได้ (Co-loading)</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                ฿ {totalSavedCost.toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <p className="text-xs text-emerald-100 mt-4 flex items-center gap-1 relative z-10">
                        เทียบเท่ากับการเติมน้ำมันฟรี 8 ถัง!
                    </p>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-base font-semibold text-gray-900">กิจกรรมล่าสุด (Recent Activities)</h2>
                </div>

                <div className="p-5 flex-1 overflow-y-auto space-y-6">
                    {/* Mock Activity 1 */}
                    <div className="flex gap-4">
                        <div className="mt-1 bg-emerald-100 p-2 rounded-full h-fit">
                            <Truck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-900 font-medium">
                                ระบบแชร์พื้นที่รถสำเร็จ: <span className="text-emerald-600 font-bold">ประหยัด 1,000 บาท</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                ออเดอร์ของ อะไหล่ยนต์ศรีนคร แชร์พื้นที่กับ รถกระบะตู้ทึบ (ไปขอนแก่น)
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 10 นาทีที่แล้ว
                            </p>
                        </div>
                    </div>

                    {/* Mock Activity 2 */}
                    <div className="flex gap-4">
                        <div className="mt-1 bg-blue-100 p-2 rounded-full h-fit">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-900 font-medium">
                                เซลส์ปิดการขายสำเร็จ: บจก. สมชายก่อสร้าง (มหาชัย)
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                มูลค่า 150,000 บาท — กำลังรอการจัดส่งไปที่ จ.ชลบุรี
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 2 ชั่วโมงที่แล้ว
                            </p>
                        </div>
                    </div>

                    {/* Mock Activity 3 */}
                    <div className="flex gap-4">
                        <div className="mt-1 bg-gray-100 p-2 rounded-full h-fit">
                            <Building2 className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-900 font-medium">
                                เพิ่มลูกค้าใหม่ (Lead): แพ็กเกจจิ้งไทยแลนด์
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                ดึงข้อมูลมาจาก LINE OA อัตโนมัติโดยระบบ CRM
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> เมื่อวานนี้
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}