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
        cancelledCount: number;
        activeVisitors: number; // mock
    };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);

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
            todayRevenue: todayOrders
                .filter(o => o.status !== "cancelled")
                .reduce((sum, o) => sum + o.totalAmount, 0),
            pendingCount: orders.filter(o => o.status === "pending" || o.status === "preparing").length,
            completedCount: orders.filter(o => o.status === "completed").length,
            cancelledCount: orders.filter(o => o.status === "cancelled").length,
            activeVisitors: 0
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
