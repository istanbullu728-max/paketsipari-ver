"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { format } from "date-fns";

export type OrderStatus = "pending" | "preparing" | "delivering" | "completed" | "cancelled";

export interface OrderItem {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    options: string[];
}

export interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerNote?: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt?: Date;
}

interface OrderContextType {
    orders: Order[];
    addOrder: (order: Omit<Order, "id" | "status" | "createdAt">) => void;
    updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
    deleteOrder: (orderId: string) => void;
    getMetrics: () => {
        todayRevenue: number;
        pendingCount: number;
        completedCount: number;
        activeVisitors: number; // mock
    };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([
        {
            id: "ORD-1234",
            customerName: "Ahmet Yılmaz",
            customerPhone: "05551234567",
            customerAddress: "Örnek Mah. Test Sok. No:1 Kat:2",
            customerNote: "Kapıyı çalmayın, bebek uyuyor.",
            items: [
                { id: "1", productName: "Adana Dürüm", quantity: 2, price: 120, options: ["Bol Acılı", "Lavaş"] },
                { id: "2", productName: "Ayran", quantity: 2, price: 15, options: ["Büyük"] }
            ],
            totalAmount: 270,
            status: "pending",
            createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
            updatedAt: new Date(Date.now() - 1000 * 60 * 5)
        },
        {
            id: "ORD-1235",
            customerName: "Ayşe Demir",
            customerPhone: "05329876543",
            customerAddress: "Merkez Mah. Atatürk Cad. No:45",
            items: [
                { id: "3", productName: "Urfa Porsiyon", quantity: 1, price: 180, options: ["Bulgur Pilavı"] }
            ],
            totalAmount: 180,
            status: "preparing",
            createdAt: new Date(Date.now() - 1000 * 60 * 20), // 20 mins ago
            updatedAt: new Date(Date.now() - 1000 * 60 * 15)
        },
        {
            id: "ORD-1236",
            customerName: "Mehmet Kaya",
            customerPhone: "05051112233",
            customerAddress: "Yeni Mah. Pazar Sok. No:12 Kat:4",
            items: [
                { id: "4", productName: "Lahmacun", quantity: 5, price: 40, options: ["Acılı"] },
                { id: "5", productName: "Kola", quantity: 1, price: 30, options: [] }
            ],
            totalAmount: 230,
            status: "delivering",
            createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
            updatedAt: new Date(Date.now() - 1000 * 60 * 10)
        }
    ]);

    const addOrder = (orderData: Omit<Order, "id" | "status" | "createdAt">) => {
        const newOrder: Order = {
            ...orderData,
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setOrders(prev => [newOrder, ...prev]);
    };

    const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date() } : o));
    };

    const deleteOrder = (orderId: string) => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
    };

    const getMetrics = () => {
        const today = new Date();
        const todayOrders = orders.filter(o =>
            o.createdAt.getDate() === today.getDate() &&
            o.createdAt.getMonth() === today.getMonth() &&
            o.createdAt.getFullYear() === today.getFullYear()
        );

        return {
            todayRevenue: todayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
            pendingCount: orders.filter(o => o.status === "pending" || o.status === "preparing").length,
            completedCount: orders.filter(o => o.status === "completed").length,
            activeVisitors: Math.floor(Math.random() * 40) + 10 // Mock active visitors between 10-50
        };
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder, getMetrics }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error("useOrders must be used within an OrderProvider");
    }
    return context;
}
