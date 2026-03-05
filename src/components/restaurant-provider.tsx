"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockRestaurant } from "@/lib/mock-data";
import { Restaurant } from "@/types";

interface RestaurantContextType {
    restaurantData: Restaurant;
    updateRestaurantData: (newData: Partial<Restaurant>) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
    const [restaurantData, setRestaurantData] = useState<Restaurant>(mockRestaurant);

    const updateRestaurantData = (newData: Partial<Restaurant>) => {
        setRestaurantData((prev) => ({ ...prev, ...newData }));
    };

    return (
        <RestaurantContext.Provider value={{ restaurantData, updateRestaurantData }}>
            {children}
        </RestaurantContext.Provider>
    );
}

export function useRestaurant() {
    const context = useContext(RestaurantContext);
    if (context === undefined) {
        throw new Error("useRestaurant must be used within a RestaurantProvider");
    }
    return context;
}
