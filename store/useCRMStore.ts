// store/useCRMStore.ts
import { create } from 'zustand';
import { SmeDeal, NetworkTruck, DealStage } from '../types';

// กำหนดโครงสร้างของ Store
interface CRMState {
    deals: SmeDeal[];
    trucks: NetworkTruck[];
    // Actions
    updateDealStage: (dealId: string, newStage: DealStage) => void;
    getMatches: (deal: SmeDeal) => NetworkTruck | null; // ฟังก์ชันจำลองการจับคู่รถ
}

// 1. Mock Data: ดีลงานขาย (CRM Deals) - โฟกัสธุรกิจ SME ไทย
const initialDeals: SmeDeal[] = [
    {
        id: 'd1',
        customerName: 'บจก. สมชายก่อสร้าง (มหาชัย)',
        productName: 'สีทาอาคารล็อตใหญ่',
        amount: 150000,
        volumeCBM: 2.5, // ขนาดสินค้าใหญ่พอที่จะแชร์พื้นที่ได้
        stage: 'Lead',
        destinationProvince: 'ชลบุรี', // จังหวัดเป้าหมาย
        targetDate: '2026-03-25',
    },
    {
        id: 'd2',
        customerName: 'แพ็กเกจจิ้งไทยแลนด์',
        productName: 'กล่องกระดาษพับได้',
        amount: 85000,
        volumeCBM: 1.0,
        stage: 'Negotiation',
        destinationProvince: 'ระยอง',
        targetDate: '2026-03-26',
    },
    {
        id: 'd3',
        customerName: 'อะไหล่ยนต์ศรีนคร',
        productName: 'ชุดโช้คอัพหลัง',
        amount: 210000,
        volumeCBM: 0.8,
        stage: 'Won', // ปิดการขายแล้ว (จะไปโผล่ที่หน้าขนส่ง)
        destinationProvince: 'ขอนแก่น',
        targetDate: '2026-03-24',
    },
];

// 2. Mock Data: เที่ยวรถในเครือข่าย (Network Trucks) - มีพื้นที่ว่าง (Co-load/Backhaul)
const initialTrucks: NetworkTruck[] = [
    {
        id: 'tr1',
        truckType: '4W_TIGHT', // กระบะตู้ทึบ (ความจุรวม ~3.5 CBM)
        driverName: 'คุณสมโภชน์',
        routeFrom: 'กรุงเทพฯ',
        routeTo: 'ชลบุรี', // ไปทางเดียวกับ Deal d1
        totalCapacityCBM: 3.5,
        usedCapacityCBM: 1.0, // มีพื้นที่ว่างเหลือ 2.5 CBM (พอดีกับ d1)
        departureDate: '2026-03-25',
    },
    {
        id: 'tr2',
        truckType: '6W_TIGHT', // 6ล้อตู้ทึบ (ความจุรวม ~15 CBM)
        driverName: 'คุณชัยณรงค์',
        routeFrom: 'ระยอง', // รถขากลับ (Backhaul)
        routeTo: 'สมุทรสาคร',
        totalCapacityCBM: 15.0,
        usedCapacityCBM: 14.0, // เหลือพื้นที่ว่างแค่ 1 CBM (พอดีกับ d2)
        departureDate: '2026-03-26',
    },
];

// 3. สร้าง Zustand Store
export const useCRMStore = create<CRMState>((set, get) => ({
    deals: initialDeals,
    trucks: initialTrucks,

    // Action: อัปเดตสถานะดีล (เช่น เมื่อลากจาก Lead -> Negotiation)
    updateDealStage: (dealId, newStage) =>
        set((state) => ({
            deals: state.deals.map((deal) =>
                deal.id === dealId ? { ...deal, stage: newStage } : deal
            ),
        })),

    // Action: จำลองการจับคู่ (ถ้ามีรถปลายทางเดียวกันและพื้นที่ว่างพอ)
    getMatches: (deal) => {
        const { trucks } = get();
        // Logic จำลอง: หา車ปลายทางเดียวกัน และมีพื้นที่เหลือพอดี
        const match = trucks.find(
            (truck) =>
                truck.routeTo === deal.destinationProvince &&
                truck.totalCapacityCBM - truck.usedCapacityCBM >= deal.volumeCBM
        );
        return match || null;
    },
}));