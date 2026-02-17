import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from '../app/providers';

// Lazy load pages
const Dashboard = lazy(() => import('../app/page'));
const Catalog = lazy(() => import('../app/catalog/page'));
const NewCatalogItem = lazy(() => import('../app/catalog/new/page'));
const Quotes = lazy(() => import('../app/quotes/page'));
const QuoteDetail = lazy(() => import('../app/quotes/[id]/page'));
const NewQuoteStep1 = lazy(() => import('../app/quotes/new/step-1/page'));
const NewQuoteStep2 = lazy(() => import('../app/quotes/new/step-2/page'));
const NewQuoteStep3 = lazy(() => import('../app/quotes/new/step-3/page'));
const Profile = lazy(() => import('../app/profile/page'));

const App: React.FC = () => {
    return (
        <Providers>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/catalog/new" element={<NewCatalogItem />} />
                    <Route path="/quotes" element={<Quotes />} />
                    <Route path="/quotes/:id" element={<QuoteDetail />} />
                    <Route path="/quotes/new/step-1" element={<NewQuoteStep1 />} />
                    <Route path="/quotes/new/step-2" element={<NewQuoteStep2 />} />
                    <Route path="/quotes/new/step-3" element={<NewQuoteStep3 />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* Fallback to root */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </Providers>
    );
};

export default App;
