/**
 * Custom hook for managing catalog items with Supabase
 * 
 * This hook provides methods to:
 * - Fetch all active catalog items
 * - Search and filter items
 * - Add new items to catalog
 * - Update existing items
 * - Deactivate items (soft delete)
 */

import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import type { CatalogItem, CatalogCategory } from '@/types/catalog';

export function useCatalog() {
    const [items, setItems] = useState<CatalogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all active catalog items
    const fetchCatalogItems = async (category?: CatalogCategory) => {
        try {
            setLoading(true);
            setError(null);

            let query = supabase
                .from('catalog_items')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (category) {
                query = query.eq('category', category);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;

            setItems(data || []);
        } catch (err) {
            setError(handleSupabaseError(err));
            console.error('Error fetching catalog items:', err);
        } finally {
            setLoading(false);
        }
    };

    // Search catalog items
    const searchItems = async (searchTerm: string) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: searchError } = await supabase
                .from('catalog_items')
                .select('*')
                .eq('is_active', true)
                .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)
                .order('name');

            if (searchError) throw searchError;

            setItems(data || []);
        } catch (err) {
            setError(handleSupabaseError(err));
            console.error('Error searching catalog items:', err);
        } finally {
            setLoading(false);
        }
    };

    // Add new catalog item
    const addCatalogItem = async (
        item: Omit<CatalogItem, 'id'>
    ): Promise<{ success: boolean; itemId?: string; error?: string }> => {
        try {
            const { data, error: insertError } = await supabase
                .from('catalog_items')
                .insert({
                    name: item.name,
                    brand: item.brand,
                    price: item.price,
                    unit: item.unit,
                    category: item.category,
                    icon: item.icon,
                })
                .select('id')
                .single();

            if (insertError) throw insertError;

            // Refresh catalog
            await fetchCatalogItems();

            return {
                success: true,
                itemId: data.id,
            };
        } catch (err) {
            return {
                success: false,
                error: handleSupabaseError(err),
            };
        }
    };

    // Update catalog item
    const updateCatalogItem = async (
        itemId: string,
        updates: Partial<Omit<CatalogItem, 'id'>>
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const { error: updateError } = await supabase
                .from('catalog_items')
                .update(updates)
                .eq('id', itemId);

            if (updateError) throw updateError;

            // Refresh catalog
            await fetchCatalogItems();

            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: handleSupabaseError(err),
            };
        }
    };

    // Deactivate catalog item (soft delete)
    const deactivateCatalogItem = async (
        itemId: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const { error: updateError } = await supabase
                .from('catalog_items')
                .update({ is_active: false })
                .eq('id', itemId);

            if (updateError) throw updateError;

            // Refresh catalog
            await fetchCatalogItems();

            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: handleSupabaseError(err),
            };
        }
    };

    // Load catalog on mount
    useEffect(() => {
        fetchCatalogItems();
    }, []);

    return {
        items,
        loading,
        error,
        searchItems,
        addCatalogItem,
        updateCatalogItem,
        deactivateCatalogItem,
        refreshCatalog: fetchCatalogItems,
    };
}
