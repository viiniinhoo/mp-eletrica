"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ClientData, QuoteItem, QuoteStatus } from '@/types/quote';

interface QuoteContextType {
    clientData: ClientData | null;
    items: QuoteItem[];
    totalValue: number;
    updateClientData: (data: ClientData) => void;
    addItem: (item: QuoteItem) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    removeItem: (itemId: string) => void;
    clearQuote: () => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [items, setItems] = useState<QuoteItem[]>([]);

    const totalValue = items.reduce((acc, item) => {
        return acc + (item.catalogItem.price * item.quantity);
    }, 0);

    const updateClientData = (data: ClientData) => {
        setClientData(data);
    };

    const addItem = (newItem: QuoteItem) => {
        setItems((prev) => {
            const existingItemIndex = prev.findIndex(
                (i) => i.catalogItem.id === newItem.catalogItem.id
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...prev];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
                };
                return updatedItems;
            }

            return [...prev, newItem];
        });
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.catalogItem.id === itemId
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        );
    };

    const removeItem = (itemId: string) => {
        setItems((prev) => prev.filter((i) => i.catalogItem.id !== itemId));
    };

    const clearQuote = () => {
        setClientData(null);
        setItems([]);
    };

    return (
        <QuoteContext.Provider value={{ clientData, items, totalValue, updateClientData, addItem, updateQuantity, removeItem, clearQuote }}>
            {children}
        </QuoteContext.Provider>
    );
}

export function useQuote() {
    const context = useContext(QuoteContext);
    if (context === undefined) {
        throw new Error('useQuote must be used within a QuoteProvider');
    }
    return context;
}
