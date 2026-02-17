-- MP Elétrica - Supabase Database Schema
-- Created: 2026-02-17
-- Description: Complete database schema for quote management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Quote status types
CREATE TYPE quote_status AS ENUM ('open', 'approved', 'completed', 'cancelled');

-- Client location types
CREATE TYPE client_type AS ENUM ('casa', 'apartamento', 'loja', 'empresa');

-- Catalog categories
CREATE TYPE catalog_category AS ENUM ('fios_cabos', 'iluminacao', 'disjuntores', 'ferramentas', 'servicos');

-- Unit of measure
CREATE TYPE unit_of_measure AS ENUM ('metro', 'unid', 'rolo', 'ponto', 'visita');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    location_type client_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Indexes
    CONSTRAINT clients_name_check CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT clients_phone_check CHECK (LENGTH(TRIM(phone)) > 0)
);

-- Create index for client search
CREATE INDEX idx_clients_name ON clients USING gin(to_tsvector('portuguese', name));
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);

-- Catalog items table
CREATE TABLE catalog_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    unit unit_of_measure NOT NULL,
    category catalog_category NOT NULL,
    icon VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT catalog_items_name_check CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT catalog_items_price_check CHECK (price >= 0)
);

-- Create indexes for catalog search
CREATE INDEX idx_catalog_items_category ON catalog_items(category) WHERE is_active = true;
CREATE INDEX idx_catalog_items_name ON catalog_items USING gin(to_tsvector('portuguese', name));
CREATE INDEX idx_catalog_items_active ON catalog_items(is_active);

-- Quotes table
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_number VARCHAR(20) UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    status quote_status NOT NULL DEFAULT 'open',
    valid_until DATE NOT NULL,
    total_value DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT quotes_total_value_check CHECK (total_value >= 0),
    CONSTRAINT quotes_valid_until_check CHECK (valid_until >= CURRENT_DATE)
);

-- Create indexes for quotes
CREATE INDEX idx_quotes_client_id ON quotes(client_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX idx_quotes_quote_number ON quotes(quote_number);

-- Quote items table (junction table)
CREATE TABLE quote_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    catalog_item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE RESTRICT,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT quote_items_quantity_check CHECK (quantity > 0),
    CONSTRAINT quote_items_unit_price_check CHECK (unit_price >= 0),
    CONSTRAINT quote_items_subtotal_check CHECK (subtotal >= 0),
    
    -- Unique constraint to prevent duplicate items in same quote
    CONSTRAINT quote_items_unique UNIQUE (quote_id, catalog_item_id)
);

-- Create indexes for quote items
CREATE INDEX idx_quote_items_quote_id ON quote_items(quote_id);
CREATE INDEX idx_quote_items_catalog_item_id ON quote_items(catalog_item_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate quote number
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
DECLARE
    year_suffix VARCHAR(2);
    next_number INTEGER;
BEGIN
    -- Get last 2 digits of current year
    year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    
    -- Get next sequential number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 1 FOR 4) AS INTEGER)), 0) + 1
    INTO next_number
    FROM quotes
    WHERE quote_number LIKE '%' || year_suffix;
    
    -- Format: NNNNSS (4 digits + 2 year digits, e.g., 000126)
    NEW.quote_number := LPAD(next_number::TEXT, 4, '0') || year_suffix;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate quote total
CREATE OR REPLACE FUNCTION calculate_quote_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE quotes
    SET total_value = (
        SELECT COALESCE(SUM(subtotal), 0)
        FROM quote_items
        WHERE quote_id = NEW.quote_id
    )
    WHERE id = NEW.quote_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate subtotal on quote_items
CREATE OR REPLACE FUNCTION calculate_quote_item_subtotal()
RETURNS TRIGGER AS $$
BEGIN
    NEW.subtotal := NEW.quantity * NEW.unit_price;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to update updated_at on clients
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on catalog_items
CREATE TRIGGER update_catalog_items_updated_at
    BEFORE UPDATE ON catalog_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on quotes
CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to generate quote number
CREATE TRIGGER generate_quote_number_trigger
    BEFORE INSERT ON quotes
    FOR EACH ROW
    WHEN (NEW.quote_number IS NULL)
    EXECUTE FUNCTION generate_quote_number();

-- Trigger to calculate subtotal on quote_items insert/update
CREATE TRIGGER calculate_quote_item_subtotal_trigger
    BEFORE INSERT OR UPDATE ON quote_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_quote_item_subtotal();

-- Trigger to update quote total when items change
CREATE TRIGGER update_quote_total_on_insert
    AFTER INSERT ON quote_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_quote_total();

CREATE TRIGGER update_quote_total_on_update
    AFTER UPDATE ON quote_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_quote_total();

CREATE TRIGGER update_quote_total_on_delete
    AFTER DELETE ON quote_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_quote_total();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

-- Policies for clients (allow all authenticated users)
CREATE POLICY "Allow all operations for authenticated users on clients"
    ON clients FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for catalog_items (allow all authenticated users)
CREATE POLICY "Allow all operations for authenticated users on catalog_items"
    ON catalog_items FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for quotes (allow all authenticated users)
CREATE POLICY "Allow all operations for authenticated users on quotes"
    ON quotes FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for quote_items (allow all authenticated users)
CREATE POLICY "Allow all operations for authenticated users on quote_items"
    ON quote_items FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- SEED DATA - Catalog Items
-- ============================================================================

INSERT INTO catalog_items (name, brand, price, unit, category, icon) VALUES
    ('Cabo Flexível 2.5mm Preto', 'SIL • Rolo 100m', 4.50, 'metro', 'fios_cabos', 'bolt'),
    ('Tomada Dupla 10A c/ Espelho', 'Tramontina • Branco', 18.90, 'unid', 'fios_cabos', 'outlet'),
    ('Disjuntor DIN Unipolar 20A', 'Siemens • Curva C', 22.00, 'unid', 'disjuntores', 'shield'),
    ('Fita Isolante 33+ 20m', '3M • Profissional', 12.50, 'unid', 'fios_cabos', 'texture'),
    ('Conector Wago 3 vias', 'Wago • 221-413', 3.80, 'unid', 'fios_cabos', 'settings_input_component'),
    ('Eletroduto Corrugado 3/4"', 'Tigre • Amarelo', 2.10, 'metro', 'fios_cabos', 'pipe');

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View for quotes with client information
CREATE OR REPLACE VIEW quotes_with_client AS
SELECT 
    q.id,
    q.quote_number,
    q.status,
    q.valid_until,
    q.total_value,
    q.created_at,
    q.updated_at,
    c.id as client_id,
    c.name as client_name,
    c.phone as client_phone,
    c.address as client_address,
    c.location_type as client_location_type
FROM quotes q
JOIN clients c ON q.client_id = c.id;

-- View for quote items with full details
CREATE OR REPLACE VIEW quote_items_detailed AS
SELECT 
    qi.id,
    qi.quote_id,
    qi.quantity,
    qi.unit_price,
    qi.subtotal,
    qi.created_at,
    ci.id as catalog_item_id,
    ci.name as item_name,
    ci.brand as item_brand,
    ci.unit as item_unit,
    ci.category as item_category,
    ci.icon as item_icon
FROM quote_items qi
JOIN catalog_items ci ON qi.catalog_item_id = ci.id;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE clients IS 'Stores client information for quotes';
COMMENT ON TABLE catalog_items IS 'Master catalog of products and services';
COMMENT ON TABLE quotes IS 'Main quotes table';
COMMENT ON TABLE quote_items IS 'Line items for each quote';

COMMENT ON COLUMN quotes.quote_number IS 'Auto-generated quote number in format NNNNSS (e.g., 000126)';
COMMENT ON COLUMN quotes.valid_until IS 'Date until which the quote is valid';
COMMENT ON COLUMN quote_items.subtotal IS 'Auto-calculated: quantity * unit_price';
