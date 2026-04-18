
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Courier {
    id: string;
    name: string;
    phone: string;
    isActive: boolean;
}

interface CourierContextType {
    couriers: Courier[];
    addCourier: (courier: Omit<Courier, "id" | "isActive">) => void;
    deleteCourier: (id: string) => void;
    toggleCourierStatus: (id: string) => void;
}

const CourierContext = createContext<CourierContextType | undefined>(undefined);

export function CourierProvider({ children }: { children: ReactNode }) {
    const [couriers, setCouriers] = useState<Courier[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("restaurant_couriers");
        if (saved) {
            try {
                setCouriers(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse couriers", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("restaurant_couriers", JSON.stringify(couriers));
        }
    }, [couriers, isLoaded]);

    const addCourier = (data: Omit<Courier, "id" | "isActive">) => {
        const newCourier: Courier = {
            ...data,
            id: `CUR-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            isActive: true
        };
        setCouriers(prev => [...prev, newCourier]);
    };

    const deleteCourier = (id: string) => {
        setCouriers(prev => prev.filter(c => c.id !== id));
    };

    const toggleCourierStatus = (id: string) => {
        setCouriers(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    };

    return (
        <CourierContext.Provider value={{ couriers, addCourier, deleteCourier, toggleCourierStatus }}>
            {children}
        </CourierContext.Provider>
    );
}

export function useCouriers() {
    const context = useContext(CourierContext);
    if (context === undefined) {
        throw new Error("useCouriers must be used within a CourierProvider");
    }
    return context;
}
