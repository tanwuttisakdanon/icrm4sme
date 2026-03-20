// app/crm/page.tsx
'use client';

import React, { useState } from 'react';
import { useCRMStore } from '@/store/useCRMStore';
import { DealStage, SmeDeal } from '@/types';
import { Building2, Package, MapPin, DollarSign, ArrowRight, CheckCircle2, Truck, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const STAGES: { id: DealStage; label: string; color: string }[] = [
    { id: 'Lead', label: '1. ลูกค้าใหม่ (Lead)', color: 'bg-gray-100' },
    { id: 'Negotiation', label: '2. กำลังเจรจา (Negotiation)', color: 'bg-blue-50' },
    { id: 'Won', label: '3. ปิดการขาย (Won)', color: 'bg-emerald-50' },
];

export default function CRMBoardPage() {
    const { deals, updateDealStage, getMatches } = useCRMStore();
    const router = useRouter();

    // State สำหรับควบคุม Pop-up เมื่อปิดการขาย
    const [showWonModal, setShowWonModal] = useState(false);
    const [activeDeal, setActiveDeal] = useState<SmeDeal | null>(null);

    // ฟังก์ชันจัดการเมื่อเซลส์เปลี่ยนสถานะดีล
    const handleMoveDeal = (deal: SmeDeal, newStage: DealStage) => {
        updateDealStage(deal.id, newStage);

        // Trigger The "Wow" Factor: ถ้าเปลี่ยนเป็น Won ให้แสดง Modal ทันที
        if (newStage === 'Won') {
            setActiveDeal(deal);
            setShowWonModal(true);
        }
    };

    // ฟังก์ชันกดยืนยันจาก Modal เพื่อไปหน้า Logistics
    const handleGoToLogistics = () => {
        setShowWonModal(false);
        router.push('/logistics'); // พาไปหน้าจับคู่รถ
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
                    <p className="text-sm text-gray-500 mt-1">ลากดีลหรือกดปุ่มเพื่อเปลี่ยนสถานะงานขาย</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    + เพิ่มดีลใหม่
                </button>
            </div>

            {/* Kanban Board Layout */}
            <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
                {STAGES.map((stage) => (
                    <div key={stage.id} className={`flex-1 min-w-[320px] rounded-xl border border-gray-200 flex flex-col ${stage.color}`}>
                        <div className="p-4 border-b border-gray-200/50 flex justify-between items-center bg-white/50 rounded-t-xl">
                            <h2 className="font-semibold text-gray-700">{stage.label}</h2>
                            <span className="bg-white px-2.5 py-0.5 rounded-full text-xs font-bold text-gray-600 shadow-sm">
                                {deals.filter((d) => d.stage === stage.id).length}
                            </span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
                            {deals
                                .filter((deal) => deal.stage === stage.id)
                                .map((deal) => (
                                    // Deal Card
                                    <div key={deal.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                                <Building2 className="w-4 h-4 text-emerald-600" />
                                                {deal.customerName}
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Package className="w-3.5 h-3.5" />
                                                {deal.productName} (<span className="font-medium text-emerald-600">{deal.volumeCBM} CBM</span>)
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <MapPin className="w-3.5 h-3.5" />
                                                จัดส่ง: {deal.destinationProvince} ({deal.targetDate})
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-900 mt-2 bg-gray-50 p-1.5 rounded">
                                                <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                                                {deal.amount.toLocaleString()} บาท
                                            </div>
                                        </div>

                                        {/* Action Buttons based on current stage */}
                                        <div className="flex gap-2 mt-auto border-t border-gray-100 pt-3">
                                            {stage.id === 'Lead' && (
                                                <button
                                                    onClick={() => handleMoveDeal(deal, 'Negotiation')}
                                                    className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-1.5 rounded transition-colors"
                                                >
                                                    เจรจา <ArrowRight className="w-3 h-3" />
                                                </button>
                                            )}
                                            {stage.id === 'Negotiation' && (
                                                <button
                                                    onClick={() => handleMoveDeal(deal, 'Won')}
                                                    className="flex-1 flex items-center justify-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold py-1.5 rounded transition-colors shadow-sm"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> ปิดการขาย!
                                                </button>
                                            )}
                                            {stage.id === 'Won' && (
                                                <div className="flex-1 text-center text-xs font-medium text-emerald-600 bg-emerald-50 py-1.5 rounded flex items-center justify-center gap-1 border border-emerald-100">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> ชนะดีลแล้ว
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* The "Wow Factor" Smart Trigger Modal */}
            {showWonModal && activeDeal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-center relative">
                            <button
                                onClick={() => setShowWonModal(false)}
                                className="absolute top-4 right-4 text-white/80 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">ยอดเยี่ยม! ปิดการขายสำเร็จ</h3>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <p className="text-gray-600 text-sm mb-4 text-center">
                                ออเดอร์ของ <span className="font-semibold text-gray-900">{activeDeal.customerName}</span> กำลังรอจัดส่ง
                            </p>

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-blue-900 text-sm mb-1">พบรถว่างไป {activeDeal.destinationProvince}!</h4>
                                        <p className="text-xs text-blue-800 leading-relaxed">
                                            มีรถบรรทุกในเครือข่ายกำลังเดินทางไปเส้นทางนี้ และมีพื้นที่ว่างพอดีสำหรับ <span className="font-semibold">{activeDeal.volumeCBM} CBM</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowWonModal(false)}
                                    className="flex-1 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    ไว้จัดการทีหลัง
                                </button>
                                <button
                                    onClick={handleGoToLogistics}
                                    className="flex-1 py-2.5 px-4 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-md transition-colors flex items-center justify-center gap-2"
                                >
                                    <Truck className="w-4 h-4" />
                                    ดูรถเพื่อลดค่าส่ง 40%
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}