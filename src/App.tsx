import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './app/providers';

// Lazy load pages to keep bundle small
const Dashboard = lazy(() => import('./app/page'));
const Catalog = lazy(() => import('./app/catalog/page'));
const Quotes = lazy(() => import('./app/quotes/page'));
// Add other pages as needed

const App: React.FC = () => {
    return (
        <Providers>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/quotes" element={<Quotes />} />
                    {/* Fallback to root */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </Providers>
    );
};

export default App;
