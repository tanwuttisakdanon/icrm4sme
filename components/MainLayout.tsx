// components/MainLayout.tsx
'use client'; // เป็น Client Component เพราะต้องดู path ปัจจุบัน

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Truck, Settings } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Sales Pipeline (CRM)', href: '/crm', icon: Users },
    { name: 'Co-Loading Hub', href: '/logistics', icon: Truck },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-gray-50">
            {/* 1. Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
                {/* Logo */}
                <div className="text-2xl font-bold text-emerald-700 mb-8 px-2">icrm<span className='text-emerald-500'>4sme</span></div>

                {/* Navigation Items */}
                <nav className="space-y-2 flex-grow">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Sidebar (เช่น User profile) */}
                <div className="border-t border-gray-200 pt-4 px-2 mt-auto">
                    <div className="text-xs text-gray-400">Project ID: icrm4sme</div>
                    <div className="text-sm font-medium text-gray-700">บจก. ก่อสร้างไทย (Demo)</div>
                </div>
            </aside>

            {/* 2. Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
                    <div className="text-xl font-semibold text-gray-800">
                        {navItems.find((item) => item.href === pathname)?.name || 'icrm4sme'}
                    </div>
                </header>

                {/* Page Content (ที่ children ของหน้าอื่นจะมาใส่) */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    {children}
                </div>
            </main>
        </div>
    );
}