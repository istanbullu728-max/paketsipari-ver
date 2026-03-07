"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockRestaurant } from "@/lib/mock-data";
import { Restaurant } from "@/types";

interface RestaurantContextType {
    restaurantData: Restaurant; // The LIVE menu
    draftData: Restaurant;      // The WIP menu in Admin
    updateDraftData: (newData: Partial<Restaurant>) => void;
    publishDraft: () => void;
    // Legacy support for global settings (like theme/open status)
    updateRestaurantData: (newData: Partial<Restaurant>) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
    // published data
    const [restaurantData, setRestaurantData] = useState<Restaurant>(mockRestaurant);
    // draft data for admin panel
    const [draftData, setDraftData] = useState<Restaurant>(mockRestaurant);

    const updateRestaurantData = (newData: Partial<Restaurant>) => {
        setRestaurantData((prev) => ({ ...prev, ...newData }));
        setDraftData((prev) => ({ ...prev, ...newData })); // Keep global settings synced
    };

    const updateDraftData = (newData: Partial<Restaurant>) => {
        setDraftData((prev) => ({ ...prev, ...newData }));
    };

    const publishDraft = () => {
        // Copies all draft categories and products straight to the live restaurantData
        setRestaurantData(prev => ({
            ...prev,
            categories: [...draftData.categories],
            products: [...draftData.products]
        }));
    };

    return (
        <RestaurantContext.Provider value={{
            restaurantData,
            draftData,
            updateDraftData,
            publishDraft,
            updateRestaurantData
        }}>
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
