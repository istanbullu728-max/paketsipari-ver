"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
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
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Initial Load from LocalStorage
    useEffect(() => {
        try {
            const savedPublished = localStorage.getItem("restaurantData_live");
            const savedDraft = localStorage.getItem("restaurantData_draft");
            
            if (savedPublished) {
                setRestaurantData(JSON.parse(savedPublished));
            }
            if (savedDraft) {
                setDraftData(JSON.parse(savedDraft));
            }
        } catch (e) {
            console.error("Failed to load from storage", e);
        }
        setIsLoaded(true);
    }, []);

    // 2. Auto-save draft changes
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem("restaurantData_draft", JSON.stringify(draftData));
    }, [draftData, isLoaded]);

    const updateRestaurantData = (newData: Partial<Restaurant>) => {
        const updated = { ...restaurantData, ...newData };
        setRestaurantData(updated);
        setDraftData((prev) => ({ ...prev, ...newData })); // Keep global settings synced
        localStorage.setItem("restaurantData_live", JSON.stringify(updated));
    };

    const updateDraftData = (newData: Partial<Restaurant>) => {
        setDraftData((prev) => ({ ...prev, ...newData }));
    };

    const publishDraft = () => {
        // Copies all draft categories and products straight to the live restaurantData
        const newLive = {
            ...restaurantData,
            categories: [...draftData.categories],
            products: [...draftData.products]
        };
        setRestaurantData(newLive);
        localStorage.setItem("restaurantData_live", JSON.stringify(newLive));
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
