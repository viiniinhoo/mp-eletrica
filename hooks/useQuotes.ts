/**
 * Custom hook for managing quotes with Supabase
 * 
 * This hook provides methods to:
 * - Fetch all quotes
 * - Create new quotes
 * - Update quote status
 * - Delete quotes
 * - Fetch quote details with items
 */

import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import type { Quote, QuoteItem, ClientData, QuoteStatus } from '@/types/quote';

interface QuoteWithItems extends Quote {
    items: QuoteItem[];
}

export function useQuotes() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all quotes
    const fetchQuotes = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('quotes_with_client')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            // Transform database format to app format
            const transformedQuotes: Quote[] = (data || []).map(row => ({
                id: row.quote_number,
                client: {
                    name: row.client_name,
                    phone: row.client_phone,
                    address: row.client_address,
                    validUntil: row.valid_until,
                    locationType: row.client_location_type,
                },
                items: [], // Items loaded separately
                status: row.status as QuoteStatus,
                createdAt: row.created_at,
            }));

            setQuotes(transformedQuotes);
        } catch (err) {
            setError(handleSupabaseError(err));
            console.error('Error fetching quotes:', err);
        } finally {
            setLoading(false);
        }
    };

    // Create a new quote
    const createQuote = async (
        clientData: ClientData,
        items: QuoteItem[]
    ): Promise<{ success: boolean; quoteId?: string; error?: string }> => {
        try {
            // 1. Check if client exists or create new one
            const { data: existingClient } = await supabase
                .from('clients')
                .select('id')
                .eq('phone', clientData.phone)
                .single();

            let clientId: string;

            if (existingClient) {
                clientId = existingClient.id;
            } else {
                // Create new client
                const { data: newClient, error: clientError } = await supabase
                    .from('clients')
                    .insert({
                        name: clientData.name,
                        phone: clientData.phone,
                        address: clientData.address,
                        location_type: clientData.locationType,
                    })
                    .select('id')
                    .single();

                if (clientError) throw clientError;
                clientId = newClient.id;
            }

            // 2. Create quote
            const { data: newQuote, error: quoteError } = await supabase
                .from('quotes')
                .insert({
                    client_id: clientId,
                    valid_until: clientData.validUntil,
                    status: 'open',
                })
                .select('id, quote_number')
                .single();

            if (quoteError) throw quoteError;

            // 3. Add quote items
            const quoteItems = items.map(item => ({
                quote_id: newQuote.id,
                catalog_item_id: item.catalogItem.id,
                quantity: item.quantity,
                unit_price: item.catalogItem.price,
            }));

            const { error: itemsError } = await supabase
                .from('quote_items')
                .insert(quoteItems);

            if (itemsError) throw itemsError;

            // Refresh quotes list
            await fetchQuotes();

            return {
                success: true,
                quoteId: newQuote.quote_number,
            };
        } catch (err) {
            return {
                success: false,
                error: handleSupabaseError(err),
            };
        }
    };

    // Update quote status
    const updateQuoteStatus = async (
        quoteNumber: string,
        newStatus: QuoteStatus
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const { error: updateError } = await supabase
                .from('quotes')
                .update({ status: newStatus })
                .eq('quote_number', quoteNumber);

            if (updateError) throw updateError;

            // Refresh quotes list
            await fetchQuotes();

            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: handleSupabaseError(err),
            };
        }
    };

    // Fetch quote details with items
    const fetchQuoteDetails = async (
        quoteNumber: string
    ): Promise<QuoteWithItems | null> => {
        try {
            // Get quote info
            const { data: quoteData, error: quoteError } = await supabase
                .from('quotes_with_client')
                .select('*')
                .eq('quote_number', quoteNumber)
                .single();

            if (quoteError) throw quoteError;

            // Get quote items
            const { data: itemsData, error: itemsError } = await supabase
                .from('quote_items_detailed')
                .select('*')
                .eq('quote_id', quoteData.id);

            if (itemsError) throw itemsError;

            // Transform to app format
            const quote: QuoteWithItems = {
                id: quoteData.quote_number,
                client: {
                    name: quoteData.client_name,
                    phone: quoteData.client_phone,
                    address: quoteData.client_address,
                    validUntil: quoteData.valid_until,
                    locationType: quoteData.client_location_type,
                },
                items: (itemsData || []).map(item => ({
                    catalogItem: {
                        id: item.catalog_item_id,
                        name: item.item_name,
                        brand: item.item_brand,
                        price: item.unit_price,
                        unit: item.item_unit,
                        category: item.item_category,
                        icon: item.item_icon,
                    },
                    quantity: item.quantity,
                })),
                status: quoteData.status as QuoteStatus,
                createdAt: quoteData.created_at,
            };

            return quote;
        } catch (err) {
            console.error('Error fetching quote details:', err);
            return null;
        }
    };

    // Delete quote
    const deleteQuote = async (
        quoteNumber: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const { error: deleteError } = await supabase
                .from('quotes')
                .delete()
                .eq('quote_number', quoteNumber);

            if (deleteError) throw deleteError;

            // Refresh quotes list
            await fetchQuotes();

            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: handleSupabaseError(err),
            };
        }
    };

    // Load quotes on mount
    useEffect(() => {
        fetchQuotes();
    }, []);

    return {
        quotes,
        loading,
        error,
        createQuote,
        updateQuoteStatus,
        fetchQuoteDetails,
        deleteQuote,
        refreshQuotes: fetchQuotes,
    };
}
