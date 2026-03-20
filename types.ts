// types.ts

// 1. CRM Deal Status (คอลัมน์ใน Kanban)
export type DealStage = 'Lead' | 'Negotiation' | 'Won';

// 2. ข้อมูลดีลงานขาย (CRM Deal)
export interface SmeDeal {
    id: string;
    customerName: string;
    productName: string;
    amount: number; // มูลค่า (บาท)
    volumeCBM: number; // ปริมาตร (CBM) - สำหรับใช้จับคู่ขนส่ง
    stage: DealStage;
    destinationProvince: string; // จังหวัดปลายทาง (สำหรับโลจิสติกส์)
    targetDate?: string; // วันที่ต้องการส่งของ (ถ้ามี)
}

// 3. ข้อมูลเที่ยวรถบรรทุกในเครือข่าย (Network Truck)
export interface NetworkTruck {
    id: string;
    truckType: '4W_TIGHT' | '6W_TIGHT'; // ประเภทรถ (เช่น กระบะตู้ทึบ, 6ล้อตู้ทึบ)
    driverName: string;
    routeFrom: string; // ต้นทาง (เช่น 'สมุทรสาคร')
    routeTo: string; // ปริมาตร (เช่น 'ชลบุรี')
    totalCapacityCBM: number; // ความจุเต็มรถ (CBM)
    usedCapacityCBM: number; // พื้นที่ที่ถูกจองไปแล้ว (CBM)
    departureDate: string; // วันที่รถออก
}