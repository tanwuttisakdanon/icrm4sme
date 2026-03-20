// app/logistics/page.tsx
'use client';

import React, { useState } from 'react';
import { useCRMStore } from '@/store/useCRMStore';
import { NetworkTruck, SmeDeal } from '@/types';
import { Truck, MapPin, Package, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LogisticsHubPage() {
    const { deals, trucks, getMatches } = useCRMStore();

    // ดึงเฉพาะดีลที่ 'ปิดการขายแล้ว' มาหาคิวส่งของ
    const pendingShipments = deals.filter(d => d.stage === 'Won');

    // State สำหรับเลือกออเดอร์ที่ต้องการดูรถ
    const [selectedDeal, setSelectedDeal] = useState<SmeDeal | null>(
        pendingShipments.length > 0 ? pendingShipments[0] : null
    );

    // State จำลองการกดยืนยันจองรถ
    const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

    // Component ย่อย: หลอดพื้นที่รถ (Visual Capacity Bar)
    const CapacityBar = ({ truck, dealVolume }: { truck: NetworkTruck, dealVolume: number }) => {
        const usedPercent = (truck.usedCapacityCBM / truck.totalCapacityCBM) * 100;
        const dealPercent = (dealVolume / truck.totalCapacityCBM) * 100;
        const remainingPercent = 100 - usedPercent - dealPercent;

        // ตรวจสอบว่าพื้นที่พอไหม
        const isFit = remainingPercent >= 0;

        return (
            <div className="mt-4">
                <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-gray-600">ความจุรถ ({truck.totalCapacityCBM} CBM)</span>
                    {isFit ? (
                        <span className="text-emerald-600 font-bold">ว่างพอสำหรับคุณ!</span>
                    ) : (
                        <span className="text-red-500 font-bold">พื้นที่ไม่พอ</span>
                    )}
                </div>

                {/* กราฟิกแท่ง Bar */}
                <div className="h-6 w-full bg-gray-100 rounded-full flex overflow-hidden border border-gray-200 shadow-inner relative">
                    {/* พื้นที่ของคนอื่น (สีเทา/ฟ้า) */}
                    <div
                        style={{ width: `${usedPercent}%` }}
                        className="bg-blue-200 h-full flex items-center justify-center text-[10px] text-blue-800 font-medium"
                        title="พื้นที่ที่ถูกจองแล้ว"
                    >
                        {usedPercent > 15 && 'ของเจ้านี้'}
                    </div>

                    {/* พื้นที่ของคุณ (สีเขียว) */}
                    {isFit && (
                        <div
                            style={{ width: `${dealPercent}%` }}
                            className="bg-emerald-500 h-full flex items-center justify-center text-[10px] text-white font-bold animate-pulse"
                            title="ออเดอร์ของคุณ"
                        >
                            คุณ
                        </div>
                    )}

                    {/* พื้นที่เหลือจริงๆ */}
                    {isFit && remainingPercent > 0 && (
                        <div
                            style={{ width: `${remainingPercent}%` }}
                            className="bg-stripes h-full opacity-30"
                            title="พื้นที่เหลือ (Share ได้อีก)"
                        />
                    )}
                </div>

                <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                    <span>ถูกจองแล้ว {truck.usedCapacityCBM} CBM</span>
                    <span>สินค้าคุณ {dealVolume} CBM</span>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header & KPI */}
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Co-Loading Hub (ระบบแชร์พื้นที่รถ)</h1>
                    <p className="text-sm text-gray-500 mt-1">จับคู่ออเดอร์ของคุณกับรถบรรทุกในเครือข่าย เพื่อลดต้นทุนขากลับ</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 px-5 text-right shadow-sm">
                    <div className="text-xs text-emerald-800 font-medium mb-1">ค่าขนส่งที่ประหยัดได้เดือนนี้</div>
                    <div className="text-2xl font-bold text-emerald-600">฿ 12,450</div>
                </div>
            </div>

            {/* Main Split Layout */}
            <div className="flex-1 flex gap-6 overflow-hidden">

                {/* Left Column: ออเดอร์ที่รอจัดส่ง */}
                <div className="w-1/3 bg-white border border-gray-200 rounded-xl p-4 flex flex-col">
                    <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        ออเดอร์ที่รอจัดส่ง ({pendingShipments.length})
                    </h2>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {pendingShipments.map(deal => (
                            <div
                                key={deal.id}
                                onClick={() => {
                                    setSelectedDeal(deal);
                                    setBookingSuccess(null); // Reset success state
                                }}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedDeal?.id === deal.id
                                        ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="font-semibold text-gray-900 text-sm mb-1">{deal.customerName}</div>
                                <div className="flex justify-between items-end">
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> ไป: {deal.destinationProvince}</div>
                                        <div className="flex items-center gap-1"><Package className="w-3 h-3" /> {deal.volumeCBM} CBM</div>
                                    </div>
                                    <ArrowRight className={`w-4 h-4 ${selectedDeal?.id === deal.id ? 'text-blue-500' : 'text-gray-300'}`} />
                                </div>
                            </div>
                        ))}

                        {pendingShipments.length === 0 && (
                            <div className="text-center py-10 text-gray-400 text-sm">
                                ไม่มีออเดอร์ที่รอจัดส่ง<br />(ลองไปลากดีลในหน้า CRM ให้ชนะดูสิ!)
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: AI Smart Match (รถที่จับคู่ได้) */}
                <div className="flex-1 bg-gray-100/50 border border-gray-200 rounded-xl p-6 flex flex-col relative overflow-hidden">
                    {selectedDeal ? (
                        <>
                            <h2 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                AI Smart Match: พบรถว่างไป {selectedDeal.destinationProvince}
                            </h2>

                            {bookingSuccess === selectedDeal.id ? (
                                // Success State
                                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">จับคู่รถสำเร็จ!</h3>
                                    <p className="text-gray-600">
                                        คุณประหยัดค่าขนส่งไปได้ <span className="font-bold text-emerald-600">~40%</span> สำหรับออเดอร์นี้<br />
                                        ระบบได้แจ้งเตือนไปยังคนขับรถเรียบร้อยแล้ว
                                    </p>
                                </div>
                            ) : (
                                // Matching List
                                <div className="space-y-4 overflow-y-auto pr-2">
                                    {/* สมมติฐานว่าเอารถทั้งหมดมาโชว์ และ Highlight คันที่ตรง (ในที่นี้จำลองโชว์คันที่ตรงจาก Store) */}
                                    {trucks
                                        .filter(t => t.routeTo === selectedDeal.destinationProvince)
                                        .map(truck => {
                                            const isFit = (truck.totalCapacityCBM - truck.usedCapacityCBM) >= selectedDeal.volumeCBM;

                                            return (
                                                <div key={truck.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
                                                    {/* Badge "แนะนำ" */}
                                                    {isFit && (
                                                        <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                                                            Best Match
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-blue-100 p-2.5 rounded-lg text-blue-700">
                                                                <Truck className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-gray-900 text-base">{truck.truckType === '4W_TIGHT' ? 'รถกระบะตู้ทึบ' : 'รถ 6 ล้อตู้ทึบ'} (ขากลับ)</h3>
                                                                <div className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                                                                    <span>คนขับ: {truck.driverName}</span> •
                                                                    <span>ออกเดินทาง: {truck.departureDate}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-xs text-gray-500 mb-1">ค่าส่งปกติ ฿2,500</div>
                                                            <div className="text-lg font-bold text-emerald-600">Co-load ฿1,500</div>
                                                        </div>
                                                    </div>

                                                    {/* ดึง Component หลอดพื้นที่มาแสดง */}
                                                    <CapacityBar truck={truck} dealVolume={selectedDeal.volumeCBM} />

                                                    <div className="mt-5 flex gap-3">
                                                        <button
                                                            disabled={!isFit}
                                                            onClick={() => setBookingSuccess(selectedDeal.id)}
                                                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${isFit
                                                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            {isFit ? 'ยืนยันแชร์พื้นที่รถ (Co-load)' : 'พื้นที่ไม่เพียงพอ'}
                                                        </button>
                                                        <button className="px-4 py-2.5 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                                                            ดูรายละเอียดรถ
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                    {/* กรณีไม่มีรถตรงเลย */}
                                    {trucks.filter(t => t.routeTo === selectedDeal.destinationProvince).length === 0 && (
                                        <div className="text-center py-12 flex flex-col items-center">
                                            <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
                                            <div className="text-gray-500 font-medium">ยังไม่มีรถในระบบที่เดินทางไป {selectedDeal.destinationProvince} ในวันนี้</div>
                                            <button className="mt-4 text-blue-600 text-sm font-medium hover:underline">
                                                + ประกาศหาเที่ยวรถ (Bidding)
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        // Placeholder เมื่อยังไม่เลือกดีล
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <Package className="w-16 h-16 mb-4 text-gray-200" />
                            <p>กรุณาเลือกออเดอร์ทางซ้ายมือ<br />เพื่อค้นหาพื้นที่รถว่าง</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}