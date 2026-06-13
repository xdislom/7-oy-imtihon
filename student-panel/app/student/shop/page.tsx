"use client";

import React, { useState, useEffect, useMemo } from 'react';

const BASE_URL = 'https://najot-edu.softwareengineer.uz/api/v1';

function getToken() {
    const raw = localStorage.getItem('token') || '';
    return raw.replace(/^Bearer\s+/i, '');
}

function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Helper to extract arrays from any API shape ─────────────────────────────
function extractArray(obj) {
    if (Array.isArray(obj)) return obj;
    if (!obj || typeof obj !== 'object') return [];
    if (Array.isArray(obj.data)) return obj.data;
    if (obj.data && Array.isArray(obj.data.data)) return obj.data.data;
    for (const key of Object.keys(obj)) {
        if (Array.isArray(obj[key])) return obj[key];
    }
    return [];
}

// ─── Gem / Coin icon ─────────────────────────────────────────────────────────
function GemIcon({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 8l10 14L22 8 12 2z" fill="#c59c73" stroke="#b08860" strokeWidth="1.2" />
            <path d="M2 8h20M12 2L7 8l5 14 5-14-5-6z" stroke="#b08860" strokeWidth="1" fill="none" />
        </svg>
    );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, userCoins, onBuy, buying }) {
    const canAfford = userCoins >= product.price;

    return (
        <div className="bg-white rounded-[14px] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
            <div className="bg-gray-50 flex items-center justify-center h-[180px] overflow-hidden">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-3"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className="h-full w-full items-center justify-center text-gray-300"
                    style={{ display: product.image ? 'none' : 'flex' }}
                >
                    <i className="fa-solid fa-image text-[48px]"></i>
                </div>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
                <h3 className="font-bold text-gray-800 text-[15px] leading-snug">{product.name}</h3>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-[15px] font-bold text-gray-800">
                        {product.price.toLocaleString()}
                        <GemIcon size={18} />
                    </div>
                    <button
                        onClick={() => onBuy(product)}
                        disabled={!canAfford || buying === product.id}
                        className={`px-4 py-2 rounded-[8px] text-[13px] font-bold text-white transition-all duration-200 ${canAfford
                            ? 'bg-[#22c55e] hover:bg-[#16a34a] active:scale-95 cursor-pointer'
                            : 'bg-[#6b7280] cursor-not-allowed'
                            }`}
                    >
                        {buying === product.id
                            ? 'Sotib olinmoqda...'
                            : canAfford
                                ? 'Kumushingiz yetarli'
                                : "Kumushingiz yetarli emas"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Purchased Item Card ──────────────────────────────────────────────────────
function PurchasedCard({ item }) {
    return (
        <div className="bg-white rounded-[14px] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
            <div className="bg-gray-50 flex items-center justify-center h-[180px] overflow-hidden">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-3"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className="h-full w-full items-center justify-center text-gray-300"
                    style={{ display: item.image ? 'none' : 'flex' }}
                >
                    <i className="fa-solid fa-image text-[48px]"></i>
                </div>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
                <h3 className="font-bold text-gray-800 text-[15px] leading-snug">{item.name}</h3>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-[15px] font-bold text-gray-800">
                        {item.price?.toLocaleString()}
                        <GemIcon size={18} />
                    </div>
                    <span className="px-4 py-2 rounded-[8px] text-[13px] font-bold text-white bg-[#22c55e]">
                        Sotib olingan
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StudentShop() {
    const [activeTab, setActiveTab] = useState('sotuvda'); // sotuvda | sotib

    // Products state
    const [products, setProducts] = useState([]);
    const [purchasedItems, setPurchasedItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userCoins, setUserCoins] = useState(0);
    const [loading, setLoading] = useState(false);
    const [buying, setBuying] = useState(null);
    const [toast, setToast] = useState(null);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [searchName, setSearchName] = useState('');
    const [onlyAffordable, setOnlyAffordable] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Fetch user coins ────────────────────────────────────────────────────
    const fetchUserCoins = async () => {
        try {
            const res = await fetch(`${BASE_URL}/users/me`, { headers: authHeaders() });
            if (res.ok) {
                const data = await res.json();
                const me = data.data || data;
                setUserCoins(me.coin ?? me.coins ?? me.balance ?? me.kumush ?? 0);
            }
        } catch (_) { }
    };

    // ── Fetch products ──────────────────────────────────────────────────────
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/accessories`, { headers: authHeaders() });
            if (res.ok) {
                const data = await res.json();
                const list = extractArray(data);
                const mapped = list.map((item, i) => ({
                    id: item.id || item._id || i,
                    name: item.name || item.title || `Aksessuar ${i + 1}`,
                    price: Number(item.price ?? item.coin ?? item.coins ?? 0),
                    image: item.image || item.photo || item.img || item.picture || '',
                    category: item.category || item.category_name || item.type || '',
                    categoryId: item.category_id || item.categoryId || '',
                }));
                setProducts(mapped);

                // Extract categories
                const cats = [...new Set(mapped.map(p => p.category).filter(Boolean))];
                setCategories(cats);
            }
        } catch (err) {
            console.error('Products fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // ── Fetch purchased ─────────────────────────────────────────────────────
    const fetchPurchased = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/accessories/my`, { headers: authHeaders() });
            if (res.ok) {
                const data = await res.json();
                const list = extractArray(data);
                setPurchasedItems(list.map((item, i) => ({
                    id: item.id || item._id || i,
                    name: item.name || item.title || item.accessory?.name || `Aksessuar ${i + 1}`,
                    price: Number(item.price ?? item.coin ?? item.accessory?.price ?? 0),
                    image: item.image || item.photo || item.accessory?.image || '',
                    category: item.category || item.accessory?.category || '',
                })));
            }
        } catch (err) {
            console.error('Purchased fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserCoins();
        fetchProducts();
        fetchPurchased();
    }, []);

    // ── Buy handler ─────────────────────────────────────────────────────────
    const handleBuy = async (product) => {
        if (userCoins < product.price) return;
        setBuying(product.id);
        try {
            const res = await fetch(`${BASE_URL}/accessories/${product.id}/buy`, {
                method: 'POST',
                headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                showToast('success', `"${product.name}" muvaffaqiyatli sotib olindi!`);
                setUserCoins(prev => prev - product.price);
                await fetchPurchased();
            } else {
                showToast('error', data.message || 'Xatolik yuz berdi');
            }
        } catch (_) {
            showToast('error', "Server bilan bog'lanishda xatolik");
        } finally {
            setBuying(null);
        }
    };

    // ── Filtered & paginated products ────────────────────────────────────────
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            if (selectedCategory && p.category !== selectedCategory) return false;
            if (priceFrom && p.price < Number(priceFrom)) return false;
            if (priceTo && p.price > Number(priceTo)) return false;
            if (searchName && !p.name.toLowerCase().includes(searchName.toLowerCase())) return false;
            if (onlyAffordable && userCoins < p.price) return false;
            return true;
        });
    }, [products, selectedCategory, priceFrom, priceTo, searchName, onlyAffordable, userCoins]);

    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

    const totalPurchasedPages = Math.ceil(purchasedItems.length / pageSize);
    const paginatedPurchased = purchasedItems.slice((page - 1) * pageSize, page * pageSize);

    const handlePageSizeChange = (val) => {
        setPageSize(Number(val));
        setPage(1);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1);
    };

    const totalItems = activeTab === 'sotuvda' ? filteredProducts.length : purchasedItems.length;
    const totalPg = activeTab === 'sotuvda' ? totalPages : totalPurchasedPages;

    return (
        <>
            <div className="p-[20px] md:p-[30px] flex flex-col gap-5">

                        {/* ── Card container ── */}
                        <div className="bg-white rounded-[14px] shadow-sm border border-gray-100">

                            {/* ── Tabs ── */}
                            <div className="flex gap-0 border-b border-gray-200 px-6">
                                <button
                                    onClick={() => handleTabChange('sotuvda')}
                                    className={`py-4 px-3 text-[15px] font-bold relative transition-colors ${activeTab === 'sotuvda' ? 'text-[#c59c73]' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Sotuvda
                                    {activeTab === 'sotuvda' && (
                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c59c73] rounded-t-full" />
                                    )}
                                </button>
                                <button
                                    onClick={() => handleTabChange('sotib')}
                                    className={`py-4 px-3 text-[15px] font-bold relative transition-colors ${activeTab === 'sotib' ? 'text-[#c59c73]' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Sotib olganlarim
                                    {activeTab === 'sotib' && (
                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c59c73] rounded-t-full" />
                                    )}
                                </button>
                            </div>

                            {/* ── Filters (only for sotuvda tab) ── */}
                            {activeTab === 'sotuvda' && (
                                <div className="px-6 py-4 flex flex-wrap items-end gap-5 border-b border-gray-100">

                                    {/* Kategoriya */}
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[13px] text-gray-500 font-medium">Kategoriya</span>
                                        <div className="relative">
                                            <select
                                                value={selectedCategory}
                                                onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}
                                                className="appearance-none bg-white border border-gray-200 rounded-[8px] px-3 py-[9px] pr-8 text-[14px] text-gray-700 font-medium outline-none focus:border-[#c59c73] cursor-pointer min-w-[110px]"
                                            >
                                                <option value="">Barchasi</option>
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <i className="fa-solid fa-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Aksessuar qiymati */}
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[13px] text-gray-500 font-medium">Aksessuar qiymati</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                placeholder=""
                                                value={priceFrom}
                                                onChange={e => { setPriceFrom(e.target.value); setPage(1); }}
                                                className="w-[70px] border border-gray-200 rounded-[8px] px-3 py-[9px] text-[14px] text-gray-700 outline-none focus:border-[#c59c73]"
                                            />
                                            <span className="text-[13px] text-gray-500 font-medium">dan</span>
                                            <input
                                                type="number"
                                                placeholder=""
                                                value={priceTo}
                                                onChange={e => { setPriceTo(e.target.value); setPage(1); }}
                                                className="w-[70px] border border-gray-200 rounded-[8px] px-3 py-[9px] text-[14px] text-gray-700 outline-none focus:border-[#c59c73]"
                                            />
                                            <span className="text-[13px] text-gray-500 font-medium">gacha</span>
                                        </div>
                                    </div>

                                    {/* Aksessuar nomi */}
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[13px] text-gray-500 font-medium">Aksessuar nomi</span>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Qidirish..."
                                                value={searchName}
                                                onChange={e => { setSearchName(e.target.value); setPage(1); }}
                                                className="border border-gray-200 rounded-[8px] px-3 py-[9px] pr-9 text-[14px] text-gray-700 outline-none focus:border-[#c59c73] w-[200px]"
                                            />
                                            <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Kumushlarim yetadi toggle */}
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[13px] text-gray-500 font-medium">Kumushlarim yetadi</span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => { setOnlyAffordable(v => !v); setPage(1); }}
                                                className={`relative w-[46px] h-[26px] rounded-full transition-colors duration-200 focus:outline-none ${onlyAffordable ? 'bg-[#c59c73]' : 'bg-gray-300'}`}
                                            >
                                                <span
                                                    className={`absolute top-[3px] w-[20px] h-[20px] bg-white rounded-full shadow transition-transform duration-200 ${onlyAffordable ? 'translate-x-[23px]' : 'translate-x-[3px]'}`}
                                                />
                                            </button>

                                            {/* Coin display */}
                                            <div className="flex items-center justify-center w-[36px] h-[36px] bg-gray-100 rounded-[8px] border border-gray-200">
                                                <GemIcon size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Content ── */}
                            <div className="p-6">
                                {loading ? (
                                    <div className="flex items-center justify-center py-16 text-gray-400">
                                        <i className="fa-solid fa-circle-notch fa-spin text-[32px]" />
                                    </div>
                                ) : activeTab === 'sotuvda' ? (
                                    paginatedProducts.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                                            <i className="fa-solid fa-cart-shopping text-[48px]" />
                                            <p className="text-[15px] font-medium">Mahsulotlar topilmadi</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                            {paginatedProducts.map(product => (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                    userCoins={userCoins}
                                                    onBuy={handleBuy}
                                                    buying={buying}
                                                />
                                            ))}
                                        </div>
                                    )
                                ) : (
                                    paginatedPurchased.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                                            <i className="fa-solid fa-bag-shopping text-[48px]" />
                                            <p className="text-[15px] font-medium">Hali hech narsa sotib olmadingiz</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                            {paginatedPurchased.map(item => (
                                                <PurchasedCard key={item.id} item={item} />
                                            ))}
                                        </div>
                                    )
                                )}

                                {/* ── Pagination ── */}
                                {totalItems > 0 && !loading && (
                                    <div className="flex items-center justify-end gap-3 mt-6">
                                        {/* Items per page */}
                                        <div className="relative">
                                            <select
                                                value={pageSize}
                                                onChange={e => handlePageSizeChange(e.target.value)}
                                                className="appearance-none border border-gray-200 bg-white rounded-[8px] px-3 py-[6px] pr-7 text-[13px] text-gray-700 font-medium outline-none focus:border-[#c59c73] cursor-pointer"
                                            >
                                                {[4, 8, 12, 16, 20].map(n => (
                                                    <option key={n} value={n}>{n}</option>
                                                ))}
                                            </select>
                                            <i className="fa-solid fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 pointer-events-none" />
                                        </div>

                                        {/* Range info */}
                                        <span className="text-[13px] text-gray-600 font-medium">
                                            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalItems)} of {totalItems}
                                        </span>

                                        {/* Prev */}
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="w-[30px] h-[30px] flex items-center justify-center rounded-[6px] border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <i className="fa-solid fa-chevron-left text-[11px]" />
                                        </button>

                                        {/* Next */}
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPg, p + 1))}
                                            disabled={page >= totalPg}
                                            className="w-[30px] h-[30px] flex items-center justify-center rounded-[6px] border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <i className="fa-solid fa-chevron-right text-[11px]" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
            {/* ── Toast ── */}
            {toast && (
                <div className={`fixed bottom-8 right-8 z-[999] flex items-center gap-3 px-5 py-4 rounded-[14px] shadow-2xl text-white text-[14px] font-semibold transition-all ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'} text-[18px]`} />
                    {toast.message}
                </div>
            )}
        </>
    );
}
