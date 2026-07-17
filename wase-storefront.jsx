import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, Heart, ShoppingBag, Minus, Plus, ChevronDown, ChevronRight, Truck, Tag, Gift, Star, Check } from "lucide-react";

/* ---------------------------------------------------------------
   WASÉ — "Designed With Purpose"
   Design tokens
   Color   cream #F7F3EC · ink #14120F · gold #A9803F · gold-light #D8BD8B
           hairline #E4DCCB · stone #6F6858
   Type    Display: Playfair Display (the logo's serif) · Body/UI: Inter
   Motif   The fleur-de-lis from the mark is reused as the wishlist glyph,
           the section divider, and the empty-state mark — the one
           signature element the whole prototype is built around.
------------------------------------------------------------------*/

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&display=swap";

function FleurDeLis({ size = 16, color = "currentColor", filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="1.2">
      <path d="M12 2c1.2 1.6 1.8 3 1.8 4.4 0 1-.4 1.8-1 2.5.9-.5 1.7-.7 2.5-.7 1.7 0 3 1.2 3 2.8 0 1.5-1.1 2.6-2.5 2.6-.6 0-1.1-.2-1.6-.5.5.9.8 1.9.8 3H14v3.4a1.6 1.6 0 0 1-1.6 1.6h-.8A1.6 1.6 0 0 1 10 19.5V16H8.5c0-1.1.3-2.1.8-3-.5.3-1 .5-1.6.5-1.4 0-2.5-1.1-2.5-2.6 0-1.6 1.3-2.8 3-2.8.8 0 1.6.2 2.5.7-.6-.7-1-1.5-1-2.5C10.2 5 10.8 3.6 12 2Z"/>
    </svg>
  );
}

const CURRENCIES = {
  GBP: { symbol: "£", rate: 1 },
  USD: { symbol: "$", rate: 1.27 },
  NGN: { symbol: "₦", rate: 2080 },
};

const CATEGORIES = ["Men", "Women", "Kids", "Underwear", "Footwear", "Accessories"];
const COLLECTIONS = ["New Arrivals", "Best Sellers", "Featured Collection", "Limited Edition", "Sale"];
const ALL_COLORS = ["Ink", "Ivory", "Gold", "Stone", "Burgundy", "Forest"];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const SWATCH = {
  Ink: "#14120F", Ivory: "#F1EADA", Gold: "#A9803F", Stone: "#8C8474", Burgundy: "#5B1F2A", Forest: "#2C3B2E",
};

function grad(a, b) {
  return `linear-gradient(160deg, ${a} 0%, ${b} 100%)`;
}

const PRODUCTS = [
  { id: "WSE-001", name: "Chevalier Wool Overcoat", category: "Men", collections: ["New Arrivals", "Featured Collection"], price: 420, colors: ["Ink", "Stone"], sizes: ["S", "M", "L", "XL"], stock: 14, sku: "WSE-MEN-001", weight: "1.4kg", material: "92% virgin wool, 8% cashmere", care: "Dry clean only. Store on a padded hanger.", img: grad("#2b2924", "#14120f"), rating: 4.8, reviews: 32 },
  { id: "WSE-002", name: "Aurelie Silk Blouse", category: "Women", collections: ["Best Sellers"], price: 165, colors: ["Ivory", "Burgundy"], sizes: ["XS", "S", "M", "L"], stock: 22, sku: "WSE-WMN-002", weight: "0.2kg", material: "100% mulberry silk", care: "Hand wash cold. Line dry in shade.", img: grad("#efe6d3", "#c9a86b"), rating: 4.6, reviews: 21 },
  { id: "WSE-003", name: "Junior Heritage Blazer", category: "Kids", collections: ["New Arrivals"], price: 95, colors: ["Ink", "Forest"], sizes: ["XS", "S", "M"], stock: 9, sku: "WSE-KID-003", weight: "0.6kg", material: "70% wool, 30% polyester blend", care: "Dry clean recommended.", img: grad("#3a4a3c", "#1c241d"), rating: 4.9, reviews: 8 },
  { id: "WSE-004", name: "Modal Everyday Boxer Set", category: "Underwear", collections: ["Best Sellers"], price: 38, colors: ["Ink", "Stone", "Ivory"], sizes: ["S", "M", "L", "XL"], stock: 60, sku: "WSE-UND-004", weight: "0.1kg", material: "95% modal, 5% elastane", care: "Machine wash cold, tumble dry low.", img: grad("#c9c2b2", "#8c8474"), rating: 4.7, reviews: 54 },
  { id: "WSE-005", name: "Marchetti Leather Oxford", category: "Footwear", collections: ["Featured Collection"], price: 265, colors: ["Ink", "Burgundy"], sizes: ["S", "M", "L", "XL"], stock: 11, sku: "WSE-FTW-005", weight: "1.1kg", material: "Full-grain calf leather, leather sole", care: "Wipe with a soft dry cloth. Use cedar shoe trees.", img: grad("#4a2229", "#1d0d10"), rating: 4.8, reviews: 17 },
  { id: "WSE-006", name: "Sable Silk Pocket Square", category: "Accessories", collections: ["Limited Edition"], price: 55, colors: ["Gold", "Burgundy"], sizes: ["S"], stock: 5, sku: "WSE-ACC-006", weight: "0.05kg", material: "100% silk twill", care: "Dry clean only.", img: grad("#c9a86b", "#7a5b2c"), rating: 5.0, reviews: 6 },
  { id: "WSE-007", name: "Lucienne Wrap Dress", category: "Women", collections: ["New Arrivals", "Featured Collection"], price: 240, colors: ["Burgundy", "Ink"], sizes: ["XS", "S", "M", "L"], stock: 16, sku: "WSE-WMN-007", weight: "0.4kg", material: "100% crepe de chine", care: "Hand wash cold. Cool iron only.", img: grad("#5b1f2a", "#28090e"), rating: 4.7, reviews: 29 },
  { id: "WSE-008", name: "Etienne Tailored Trouser", category: "Men", collections: ["Best Sellers"], price: 175, colors: ["Ink", "Stone"], sizes: ["S", "M", "L", "XL", "XXL"], stock: 24, sku: "WSE-MEN-008", weight: "0.5kg", material: "98% wool, 2% elastane", care: "Dry clean only.", img: grad("#33312b", "#14120f"), rating: 4.5, reviews: 40 },
  { id: "WSE-009", name: "Petit Fleur Romper", category: "Kids", collections: ["Sale"], price: 42, originalPrice: 60, colors: ["Ivory", "Gold"], sizes: ["XS", "S"], stock: 18, sku: "WSE-KID-009", weight: "0.15kg", material: "100% organic cotton", care: "Machine wash warm.", img: grad("#efe6d3", "#c9a86b"), rating: 4.6, reviews: 12 },
  { id: "WSE-010", name: "Cassian Lace Bralette", category: "Underwear", collections: ["New Arrivals"], price: 48, colors: ["Ivory", "Burgundy"], sizes: ["XS", "S", "M", "L"], stock: 33, sku: "WSE-UND-010", weight: "0.08kg", material: "Recycled nylon, French lace", care: "Hand wash cold, lay flat to dry.", img: grad("#efe6d3", "#8c6b6f"), rating: 4.4, reviews: 19 },
  { id: "WSE-011", name: "Roderic Suede Loafer", category: "Footwear", collections: ["Best Sellers"], price: 210, colors: ["Stone", "Ink"], sizes: ["S", "M", "L", "XL"], stock: 20, sku: "WSE-FTW-011", weight: "0.9kg", material: "Suede upper, leather sole", care: "Brush clean. Avoid water exposure.", img: grad("#8c8474", "#4a453a"), rating: 4.7, reviews: 25 },
  { id: "WSE-012", name: "Gilt Chain Belt", category: "Accessories", collections: ["Limited Edition", "Sale"], price: 88, originalPrice: 120, colors: ["Gold"], sizes: ["S", "M", "L"], stock: 7, sku: "WSE-ACC-012", weight: "0.3kg", material: "Brass hardware, calf leather", care: "Store flat. Polish with a dry cloth.", img: grad("#d8bd8b", "#a9803f"), rating: 4.9, reviews: 11 },
  { id: "WSE-013", name: "Verrier Cashmere Sweater", category: "Men", collections: ["Featured Collection"], price: 310, colors: ["Ink", "Forest", "Ivory"], sizes: ["S", "M", "L", "XL"], stock: 13, sku: "WSE-MEN-013", weight: "0.5kg", material: "100% Mongolian cashmere", care: "Hand wash cold. Dry flat.", img: grad("#2c3b2e", "#12180f"), rating: 4.9, reviews: 22 },
  { id: "WSE-014", name: "Odile Pleated Midi Skirt", category: "Women", collections: ["Sale"], price: 98, originalPrice: 140, colors: ["Ink", "Gold"], sizes: ["XS", "S", "M", "L"], stock: 15, sku: "WSE-WMN-014", weight: "0.35kg", material: "Recycled polyester satin", care: "Dry clean only.", img: grad("#33312b", "#a9803f"), rating: 4.3, reviews: 14 },
  { id: "WSE-015", name: "Junior Canvas High-Top", category: "Kids", collections: ["Best Sellers"], price: 58, colors: ["Ivory", "Ink"], sizes: ["XS", "S", "M"], stock: 27, sku: "WSE-KID-015", weight: "0.4kg", material: "Cotton canvas, rubber sole", care: "Spot clean with a damp cloth.", img: grad("#efe6d3", "#33312b"), rating: 4.6, reviews: 9 },
  { id: "WSE-016", name: "Sable Silk Tie", category: "Accessories", collections: ["New Arrivals"], price: 62, colors: ["Burgundy", "Forest", "Gold"], sizes: ["S"], stock: 31, sku: "WSE-ACC-016", weight: "0.06kg", material: "100% silk", care: "Dry clean only.", img: grad("#5b1f2a", "#2c3b2e"), rating: 4.8, reviews: 15 },
];

function fmt(price, currency) {
  const c = CURRENCIES[currency];
  const val = price * c.rate;
  const decimals = currency === "NGN" ? 0 : 2;
  return `${c.symbol}${val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

/* ---------------------------- Layout chrome ---------------------------- */

function TopBar({ currency, setCurrency, country, setCountry }) {
  return (
    <div className="w-full text-[11px] tracking-[0.12em] uppercase" style={{ background: "#14120F", color: "#D8BD8B" }}>
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <span className="hidden sm:block">Complimentary shipping over {fmt(150, currency)}</span>
        <div className="flex items-center gap-4 ml-auto">
          <select value={country} onChange={(e) => setCountry(e.target.value)}
            className="bg-transparent outline-none cursor-pointer" style={{ color: "#D8BD8B" }}>
            <option style={{ color: "#14120F" }}>United Kingdom</option>
            <option style={{ color: "#14120F" }}>Nigeria</option>
            <option style={{ color: "#14120F" }}>United States</option>
            <option style={{ color: "#14120F" }}>Europe</option>
            <option style={{ color: "#14120F" }}>Rest of World</option>
          </select>
          <span className="opacity-40">|</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent outline-none cursor-pointer" style={{ color: "#D8BD8B" }}>
            {Object.keys(CURRENCIES).map((c) => <option key={c} style={{ color: "#14120F" }}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

function Logo({ dark = false }) {
  return (
    <div className="flex flex-col items-center leading-none select-none">
      <FleurDeLis size={18} color={dark ? "#A9803F" : "#A9803F"} filled />
      <span className="mt-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, letterSpacing: "0.14em", color: dark ? "#F7F3EC" : "#14120F" }}>WASÉ</span>
      <span className="mt-0.5 text-[9px] tracking-[0.3em] uppercase" style={{ color: "#A9803F" }}>Designed with purpose</span>
    </div>
  );
}

function NavBar({ go, searchOpen, setSearchOpen, cartCount, setCartOpen, wishlistCount, query, setQuery, onSearchSelect }) {
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  return (
    <div className="sticky top-0 z-30" style={{ background: "#F7F3EC", borderBottom: "1px solid #E4DCCB" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <button onClick={() => go("home")} className="flex-1 flex justify-start">
            <span className="hidden md:flex gap-6 text-[12px] tracking-[0.1em] uppercase" style={{ color: "#3a362d" }}>
              {CATEGORIES.slice(0, 3).map((c) => (
                <span key={c} onClick={(e) => { e.stopPropagation(); go("plp", { category: c }); }}
                  className="hover:opacity-60 cursor-pointer">{c}</span>
              ))}
            </span>
          </button>
          <button onClick={() => go("home")} className="flex-shrink-0"><Logo /></button>
          <div className="flex-1 flex items-center justify-end gap-5">
            <span className="hidden md:flex gap-6 text-[12px] tracking-[0.1em] uppercase" style={{ color: "#3a362d" }}>
              {CATEGORIES.slice(3).map((c) => (
                <span key={c} onClick={() => go("plp", { category: c })} className="hover:opacity-60 cursor-pointer">{c}</span>
              ))}
            </span>
            <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search"><Search size={18} color="#3a362d" /></button>
            <button onClick={() => go("account")} className="relative">
              <Heart size={18} color="#3a362d" fill={wishlistCount ? "#3a362d" : "none"} />
              {wishlistCount > 0 && <span className="absolute -top-2 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#A9803F", color: "#F7F3EC" }}>{wishlistCount}</span>}
            </button>
            <button onClick={() => setCartOpen(true)} className="relative" aria-label="Cart">
              <ShoppingBag size={18} color="#3a362d" />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#A9803F", color: "#F7F3EC" }}>{cartCount}</span>}
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="pb-4 relative">
            <div className="flex items-center border-b" style={{ borderColor: "#14120F" }}>
              <Search size={16} color="#6F6658" />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, categories..."
                className="w-full bg-transparent outline-none py-2 px-3 text-sm" style={{ color: "#14120F" }} />
              <button onClick={() => { setSearchOpen(false); setQuery(""); }}><X size={16} color="#6F6658" /></button>
            </div>
            {results.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 shadow-lg z-40" style={{ background: "#FFFDF9", border: "1px solid #E4DCCB" }}>
                {results.map((r) => (
                  <div key={r.id} onClick={() => { onSearchSelect(r); setSearchOpen(false); setQuery(""); }}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#F1EADA]">
                    <div className="w-9 h-9 flex-shrink-0" style={{ background: r.img }} />
                    <div className="text-sm" style={{ color: "#14120F" }}>{r.name}<div className="text-[11px]" style={{ color: "#6F6658" }}>{r.category}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 my-10">
      <div className="h-px w-16" style={{ background: "#E4DCCB" }} />
      <FleurDeLis size={14} color="#A9803F" />
      <div className="h-px w-16" style={{ background: "#E4DCCB" }} />
    </div>
  );
}

function Eyebrow({ children }) {
  return <div className="text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: "#A9803F" }}>{children}</div>;
}

/* ---------------------------- Product cards ---------------------------- */

function ProductCard({ p, currency, go, wishlist, toggleWishlist }) {
  const saved = wishlist.includes(p.id);
  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden cursor-pointer" style={{ background: p.img }} onClick={() => go("pdp", { id: p.id })}>
        <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(247,243,236,0.85)" }}>
          <Heart size={14} color="#14120F" fill={saved ? "#14120F" : "none"} />
        </button>
        {p.collections.includes("Sale") && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.15em] uppercase px-2 py-1" style={{ background: "#A9803F", color: "#F7F3EC" }}>Sale</span>
        )}
        {p.collections.includes("Limited Edition") && !p.collections.includes("Sale") && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.15em] uppercase px-2 py-1" style={{ background: "#14120F", color: "#D8BD8B" }}>Limited</span>
        )}
      </div>
      <div className="pt-3 cursor-pointer" onClick={() => go("pdp", { id: p.id })}>
        <div className="text-[11px] tracking-[0.1em] uppercase" style={{ color: "#6F6658" }}>{p.category}</div>
        <div className="text-[15px] mt-0.5" style={{ fontFamily: "'Playfair Display', serif", color: "#14120F" }}>{p.name}</div>
        <div className="flex items-center gap-2 mt-1">
          {p.originalPrice && <span className="text-[13px] line-through" style={{ color: "#B0A794" }}>{fmt(p.originalPrice, currency)}</span>}
          <span className="text-[13px]" style={{ color: p.originalPrice ? "#A9803F" : "#3a362d" }}>{fmt(p.price, currency)}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Pages ---------------------------- */

function Home({ go, currency, wishlist, toggleWishlist }) {
  const newArrivals = PRODUCTS.filter((p) => p.collections.includes("New Arrivals")).slice(0, 4);
  const bestSellers = PRODUCTS.filter((p) => p.collections.includes("Best Sellers")).slice(0, 4);

  return (
    <div>
      <div className="relative h-[78vh] flex items-center justify-center text-center" style={{ background: grad("#20241d", "#0d0c09") }}>
        <div>
          <FleurDeLis size={30} color="#D8BD8B" filled />
          <h1 className="mt-5" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(36px,6vw,64px)", color: "#F7F3EC" }}>The Autumn Sitting</h1>
          <p className="mt-3 text-sm tracking-[0.08em]" style={{ color: "#D8BD8B" }}>Tailoring, silk, and leather — cut for permanence, not a season.</p>
          <button onClick={() => go("plp", { collection: "New Arrivals" })}
            className="mt-8 px-8 py-3 text-[12px] tracking-[0.15em] uppercase" style={{ background: "#F7F3EC", color: "#14120F" }}>
            Shop New Arrivals
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-6 gap-3 -mt-16 relative z-10">
        {CATEGORIES.map((c) => (
          <div key={c} onClick={() => go("plp", { category: c })}
            className="aspect-square flex items-end p-3 cursor-pointer shadow-md" style={{ background: grad("#efe6d3", "#c9a86b") }}>
            <span className="text-[12px] tracking-[0.1em] uppercase" style={{ color: "#14120F" }}>{c}</span>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <Eyebrow>Just In</Eyebrow>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#14120F" }}>New Arrivals</h2>
          </div>
          <button onClick={() => go("plp", { collection: "New Arrivals" })} className="text-[12px] tracking-[0.1em] uppercase flex items-center gap-1" style={{ color: "#A9803F" }}>View all <ChevronRight size={14} /></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {newArrivals.map((p) => <ProductCard key={p.id} p={p} currency={currency} go={go} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
        </div>
      </div>

      <Divider />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <Eyebrow>Customer Favourites</Eyebrow>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#14120F" }}>Best Sellers</h2>
          </div>
          <button onClick={() => go("plp", { collection: "Best Sellers" })} className="text-[12px] tracking-[0.1em] uppercase flex items-center gap-1" style={{ color: "#A9803F" }}>View all <ChevronRight size={14} /></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-20">
          {bestSellers.map((p) => <ProductCard key={p.id} p={p} currency={currency} go={go} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
        </div>
      </div>

      <div className="py-20 text-center" style={{ background: "#14120F" }}>
        <FleurDeLis size={20} color="#A9803F" filled />
        <h3 className="mt-4" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 24, color: "#F7F3EC" }}>Join the House of WASÉ</h3>
        <p className="mt-2 text-sm" style={{ color: "#D8BD8B" }}>Subscribe for early access and 10% off your first order.</p>
        <div className="mt-6 flex justify-center gap-2">
          <input placeholder="Email address" className="px-4 py-2 text-sm outline-none w-64" style={{ background: "#F7F3EC", color: "#14120F" }} />
          <button className="px-5 py-2 text-[12px] tracking-[0.1em] uppercase" style={{ background: "#A9803F", color: "#F7F3EC" }}>Subscribe</button>
        </div>
      </div>
    </div>
  );
}

function PLP({ params, go, currency, wishlist, toggleWishlist }) {
  const [filters, setFilters] = useState({ category: params.category ? [params.category] : [], collection: params.collection ? [params.collection] : [], size: [], color: [] });
  const [priceMax, setPriceMax] = useState(500);
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    setFilters({ category: params.category ? [params.category] : [], collection: params.collection ? [params.collection] : [], size: [], color: [] });
  }, [params.category, params.collection]);

  function toggle(group, val) {
    setFilters((f) => ({ ...f, [group]: f[group].includes(val) ? f[group].filter((v) => v !== val) : [...f[group], val] }));
  }

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) =>
      (filters.category.length === 0 || filters.category.includes(p.category)) &&
      (filters.collection.length === 0 || filters.collection.some((c) => p.collections.includes(c))) &&
      (filters.size.length === 0 || filters.size.some((s) => p.sizes.includes(s))) &&
      (filters.color.length === 0 || filters.color.some((c) => p.colors.includes(c))) &&
      p.price <= priceMax
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [filters, priceMax, sort]);

  const title = params.category || params.collection || "All Products";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Eyebrow>Catalogue</Eyebrow>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, color: "#14120F" }}>{title}</h1>
      <div className="text-sm mt-1" style={{ color: "#6F6658" }}>{filtered.length} pieces</div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 mt-8">
        <aside className="space-y-8">
          <FilterGroup title="Category" options={CATEGORIES} selected={filters.category} onToggle={(v) => toggle("category", v)} />
          <FilterGroup title="Collection" options={COLLECTIONS} selected={filters.collection} onToggle={(v) => toggle("collection", v)} />
          <FilterGroup title="Size" options={ALL_SIZES} selected={filters.size} onToggle={(v) => toggle("size", v)} inline />
          <div>
            <div className="text-[12px] tracking-[0.1em] uppercase mb-3" style={{ color: "#14120F" }}>Colour</div>
            <div className="flex flex-wrap gap-2">
              {ALL_COLORS.map((c) => (
                <button key={c} onClick={() => toggle("color", c)} title={c}
                  className="w-7 h-7 rounded-full border-2" style={{ background: SWATCH[c], borderColor: filters.color.includes(c) ? "#A9803F" : "transparent" }} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-[12px] tracking-[0.1em] uppercase mb-3" style={{ color: "#14120F" }}>Price up to {fmt(priceMax, currency)}</div>
            <input type="range" min="20" max="500" value={priceMax} onChange={(e) => setPriceMax(+e.target.value)} className="w-full accent-[#A9803F]" />
          </div>
        </aside>

        <div>
          <div className="flex justify-end mb-6">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-[12px] tracking-[0.05em] uppercase border px-3 py-2 outline-none" style={{ borderColor: "#E4DCCB", color: "#3a362d" }}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <FleurDeLis size={22} color="#A9803F" />
              <p className="mt-3 text-sm" style={{ color: "#6F6658" }}>No pieces match these filters yet. Try widening your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p) => <ProductCard key={p.id} p={p} currency={currency} go={go} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, options, selected, onToggle, inline }) {
  return (
    <div>
      <div className="text-[12px] tracking-[0.1em] uppercase mb-3" style={{ color: "#14120F" }}>{title}</div>
      <div className={inline ? "flex flex-wrap gap-2" : "space-y-2"}>
        {options.map((o) => {
          const active = selected.includes(o);
          return inline ? (
            <button key={o} onClick={() => onToggle(o)} className="w-9 h-9 text-[11px] border" style={{ borderColor: active ? "#14120F" : "#E4DCCB", background: active ? "#14120F" : "transparent", color: active ? "#F7F3EC" : "#3a362d" }}>{o}</button>
          ) : (
            <label key={o} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "#3a362d" }}>
              <span className="w-4 h-4 border flex items-center justify-center" style={{ borderColor: "#8C8474", background: active ? "#A9803F" : "transparent" }} onClick={() => onToggle(o)}>
                {active && <Check size={11} color="#F7F3EC" />}
              </span>
              {o}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function SizeGuideModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(20,18,15,0.6)" }} onClick={onClose}>
      <div className="max-w-lg w-full p-8" style={{ background: "#FFFDF9" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#14120F" }}>Size Guide</h3>
          <button onClick={onClose}><X size={18} color="#3a362d" /></button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b" style={{ borderColor: "#E4DCCB", color: "#6F6658" }}>
            <th className="py-2">Size</th><th>Chest (cm)</th><th>Waist (cm)</th><th>Hip (cm)</th>
          </tr></thead>
          <tbody>
            {[["XS", "82", "64", "88"], ["S", "88", "70", "94"], ["M", "94", "76", "100"], ["L", "100", "82", "106"], ["XL", "106", "88", "112"], ["XXL", "112", "94", "118"]].map((r) => (
              <tr key={r[0]} className="border-b" style={{ borderColor: "#E4DCCB" }}>{r.map((c, i) => <td key={i} className="py-2" style={{ color: "#14120F" }}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs mt-4" style={{ color: "#6F6658" }}>Measurements are body measurements, not garment measurements. Between sizes? We recommend sizing up.</p>
      </div>
    </div>
  );
}

function PDP({ params, go, currency, wishlist, toggleWishlist, addToCart }) {
  const product = PRODUCTS.find((p) => p.id === params.id) || PRODUCTS[0];
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [openCare, setOpenCare] = useState(false);
  const [sizeGuide, setSizeGuide] = useState(false);
  const [added, setAdded] = useState(false);

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const completeTheLook = PRODUCTS.filter((p) => p.category !== product.category).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-[11px] tracking-[0.1em] uppercase mb-6 flex gap-2" style={{ color: "#6F6658" }}>
        <span className="cursor-pointer" onClick={() => go("home")}>Home</span> / <span className="cursor-pointer" onClick={() => go("plp", { category: product.category })}>{product.category}</span> / <span style={{ color: "#14120F" }}>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        <div>
          <div className="aspect-[3/4]" style={{ background: product.img }} />
          <div className="flex gap-2 mt-3">
            {product.colors.map((c) => <div key={c} className="w-16 h-16" style={{ background: product.img, opacity: c === color ? 1 : 0.4 }} />)}
          </div>
          <div className="mt-3 text-[11px] tracking-[0.1em] uppercase" style={{ color: "#6F6658" }}>Product video available on request</div>
        </div>

        <div>
          <div className="text-[11px] tracking-[0.1em] uppercase" style={{ color: "#6F6658" }}>{product.category}</div>
          <h1 className="mt-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#14120F" }}>{product.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} color="#A9803F" fill={i < Math.round(product.rating) ? "#A9803F" : "none"} />)}
            <span className="text-xs ml-1" style={{ color: "#6F6658" }}>{product.rating} ({product.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-3 mt-4">
            {product.originalPrice && <span className="line-through text-lg" style={{ color: "#B0A794" }}>{fmt(product.originalPrice, currency)}</span>}
            <span className="text-2xl" style={{ color: product.originalPrice ? "#A9803F" : "#14120F", fontFamily: "'Playfair Display', serif" }}>{fmt(product.price, currency)}</span>
          </div>

          <div className="mt-6">
            <div className="text-[12px] tracking-[0.1em] uppercase mb-2" style={{ color: "#14120F" }}>Colour — {color}</div>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} className="w-8 h-8 rounded-full border-2" style={{ background: SWATCH[c], borderColor: c === color ? "#A9803F" : "transparent" }} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[12px] tracking-[0.1em] uppercase" style={{ color: "#14120F" }}>Size</div>
              <button onClick={() => setSizeGuide(true)} className="text-[11px] underline" style={{ color: "#A9803F" }}>Size guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className="w-11 h-11 text-sm border" style={{ borderColor: s === size ? "#14120F" : "#E4DCCB", background: s === size ? "#14120F" : "transparent", color: s === size ? "#F7F3EC" : "#3a362d" }}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border" style={{ borderColor: "#E4DCCB" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2"><Minus size={13} /></button>
              <span className="px-4 text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2"><Plus size={13} /></button>
            </div>
            <span className="text-xs" style={{ color: product.stock < 10 ? "#A9803F" : "#6F6658" }}>{product.stock < 10 ? `Only ${product.stock} left in stock` : "In stock"}</span>
          </div>

          <div className="flex gap-3 mt-6">
            <button disabled={!size} onClick={() => { addToCart(product, color, size, qty); setAdded(true); setTimeout(() => setAdded(false), 1800); }}
              className="flex-1 py-3 text-[12px] tracking-[0.15em] uppercase disabled:opacity-40" style={{ background: "#14120F", color: "#F7F3EC" }}>
              {added ? "Added to Bag" : size ? "Add to Bag" : "Select a size"}
            </button>
            <button onClick={() => toggleWishlist(product.id)} className="w-12 flex items-center justify-center border" style={{ borderColor: "#E4DCCB" }}>
              <Heart size={16} color="#14120F" fill={wishlist.includes(product.id) ? "#14120F" : "none"} />
            </button>
          </div>

          <div className="mt-10 border-t pt-6 space-y-4 text-sm" style={{ borderColor: "#E4DCCB", color: "#3a362d" }}>
            <div className="flex justify-between"><span style={{ color: "#6F6658" }}>SKU</span><span>{product.sku}</span></div>
            <div className="flex justify-between"><span style={{ color: "#6F6658" }}>Weight</span><span>{product.weight}</span></div>
            <div className="flex justify-between"><span style={{ color: "#6F6658" }}>Material</span><span className="text-right max-w-[60%]">{product.material}</span></div>
            <div>
              <button onClick={() => setOpenCare((o) => !o)} className="flex justify-between w-full">
                <span style={{ color: "#6F6658" }}>Care instructions</span><ChevronDown size={15} style={{ transform: openCare ? "rotate(180deg)" : "none" }} />
              </button>
              {openCare && <p className="mt-2 text-xs" style={{ color: "#6F6658" }}>{product.care}</p>}
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div className="mb-16">
        <Eyebrow>You May Also Like</Eyebrow>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#14120F" }} className="mb-6">More from {product.category}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {related.map((p) => <ProductCard key={p.id} p={p} currency={currency} go={go} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
        </div>
      </div>

      <div className="mb-16">
        <Eyebrow>Complete the Look</Eyebrow>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#14120F" }} className="mb-6">Styled Together</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {completeTheLook.map((p) => <ProductCard key={p.id} p={p} currency={currency} go={go} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
        </div>
      </div>

      {sizeGuide && <SizeGuideModal onClose={() => setSizeGuide(false)} />}
    </div>
  );
}

/* ---------------------------- Cart drawer ---------------------------- */

function CartDrawer({ open, onClose, cart, setCart, saved, setSaved, currency, go }) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [giftCard, setGiftCard] = useState("");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = applied === "WASE10" ? subtotal * 0.1 : 0;
  const shippingThreshold = 150;
  const shippingLeft = Math.max(0, shippingThreshold - (subtotal - discount));
  const total = subtotal - discount;

  const recs = PRODUCTS.filter((p) => !cart.some((c) => c.id === p.id)).slice(0, 3);

  function updateQty(idx, delta) {
    setCart((c) => c.map((item, i) => i === idx ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  }
  function removeItem(idx) {
    setCart((c) => c.filter((_, i) => i !== idx));
  }
  function saveForLater(idx) {
    setSaved((s) => [...s, cart[idx]]);
    removeItem(idx);
  }
  function moveToCart(idx) {
    setCart((c) => [...c, saved[idx]]);
    setSaved((s) => s.filter((_, i) => i !== idx));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0" style={{ background: "rgba(20,18,15,0.5)" }} onClick={onClose} />
      <div className="relative w-full max-w-md h-full flex flex-col" style={{ background: "#FFFDF9" }}>
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "#E4DCCB" }}>
          <h3 className="flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#14120F" }}><ShoppingBag size={17} /> Your Bag</h3>
          <button onClick={onClose}><X size={20} color="#3a362d" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <FleurDeLis size={24} color="#A9803F" />
              <p className="mt-3 text-sm" style={{ color: "#6F6658" }}>Your bag is empty. Explore the new collection.</p>
              <button onClick={() => { onClose(); go("plp", { collection: "New Arrivals" }); }} className="mt-4 text-[12px] tracking-[0.1em] uppercase underline" style={{ color: "#A9803F" }}>Shop New Arrivals</button>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-20 h-24 flex-shrink-0" style={{ background: item.img }} />
                  <div className="flex-1">
                    <div className="text-sm" style={{ fontFamily: "'Playfair Display', serif", color: "#14120F" }}>{item.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#6F6658" }}>{item.color} · {item.size}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border" style={{ borderColor: "#E4DCCB" }}>
                        <button onClick={() => updateQty(idx, -1)} className="px-2 py-1"><Minus size={11} /></button>
                        <span className="px-3 text-xs">{item.qty}</span>
                        <button onClick={() => updateQty(idx, 1)} className="px-2 py-1"><Plus size={11} /></button>
                      </div>
                      <span className="text-sm" style={{ color: "#14120F" }}>{fmt(item.price * item.qty, currency)}</span>
                    </div>
                    <div className="flex gap-3 mt-2 text-[11px] tracking-[0.05em] uppercase" style={{ color: "#A9803F" }}>
                      <button onClick={() => saveForLater(idx)}>Save for later</button>
                      <button onClick={() => removeItem(idx)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}

              {saved.length > 0 && (
                <div className="pt-4 border-t" style={{ borderColor: "#E4DCCB" }}>
                  <div className="text-[12px] tracking-[0.1em] uppercase mb-3" style={{ color: "#14120F" }}>Saved for Later</div>
                  {saved.map((item, idx) => (
                    <div key={idx} className="flex gap-3 mb-3">
                      <div className="w-14 h-16 flex-shrink-0" style={{ background: item.img }} />
                      <div className="flex-1">
                        <div className="text-xs" style={{ color: "#14120F" }}>{item.name}</div>
                        <button onClick={() => moveToCart(idx)} className="text-[11px] uppercase underline mt-1" style={{ color: "#A9803F" }}>Move to bag</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {recs.length > 0 && (
                <div className="pt-5 border-t" style={{ borderColor: "#E4DCCB" }}>
                  <div className="text-[12px] tracking-[0.1em] uppercase mb-3" style={{ color: "#14120F" }}>You May Also Like</div>
                  <div className="grid grid-cols-3 gap-2">
                    {recs.map((p) => (
                      <div key={p.id} className="cursor-pointer" onClick={() => { onClose(); go("pdp", { id: p.id }); }}>
                        <div className="aspect-[3/4]" style={{ background: p.img }} />
                        <div className="text-[10px] mt-1" style={{ color: "#3a362d" }}>{fmt(p.price, currency)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t px-6 py-5 space-y-3" style={{ borderColor: "#E4DCCB" }}>
            <div className="flex items-center gap-2 text-xs" style={{ color: "#6F6658" }}>
              <Truck size={14} />
              {shippingLeft > 0 ? <span>Add {fmt(shippingLeft, currency)} more for free shipping</span> : <span>You've unlocked free shipping</span>}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center border px-2" style={{ borderColor: "#E4DCCB" }}>
                <Tag size={13} color="#6F6658" />
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" className="w-full bg-transparent outline-none px-2 py-2 text-xs" />
              </div>
              <button onClick={() => setApplied(code.toUpperCase() === "WASE10" ? "WASE10" : "invalid")} className="px-3 text-[11px] uppercase" style={{ background: "#14120F", color: "#F7F3EC" }}>Apply</button>
            </div>
            {applied === "invalid" && <div className="text-xs" style={{ color: "#5B1F2A" }}>Code not recognised — try WASE10.</div>}
            {applied === "WASE10" && <div className="text-xs" style={{ color: "#A9803F" }}>WASE10 applied — 10% off</div>}
            <div className="flex items-center border px-2" style={{ borderColor: "#E4DCCB" }}>
              <Gift size={13} color="#6F6658" />
              <input value={giftCard} onChange={(e) => setGiftCard(e.target.value)} placeholder="Gift card number" className="w-full bg-transparent outline-none px-2 py-2 text-xs" />
            </div>
            <div className="pt-2 space-y-1 text-sm">
              <div className="flex justify-between" style={{ color: "#6F6658" }}><span>Subtotal</span><span>{fmt(subtotal, currency)}</span></div>
              {discount > 0 && <div className="flex justify-between" style={{ color: "#A9803F" }}><span>Discount</span><span>-{fmt(discount, currency)}</span></div>}
              <div className="flex justify-between text-base pt-1" style={{ color: "#14120F", fontFamily: "'Playfair Display', serif" }}><span>Total</span><span>{fmt(total, currency)}</span></div>
            </div>
            <button onClick={() => { onClose(); go("checkout"); }} className="w-full py-3 text-[12px] tracking-[0.15em] uppercase mt-2" style={{ background: "#14120F", color: "#F7F3EC" }}>Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------- Checkout ---------------------------- */

function Checkout({ cart, currency, go }) {
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState(1);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (!mode) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <FleurDeLis size={22} color="#A9803F" />
        <h1 className="mt-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#14120F" }}>Checkout</h1>
        <p className="mt-2 text-sm" style={{ color: "#6F6658" }}>Continue as a guest or sign in to your account.</p>
        <div className="mt-8 space-y-3">
          <button onClick={() => setMode("guest")} className="w-full py-3 text-[12px] tracking-[0.15em] uppercase" style={{ background: "#14120F", color: "#F7F3EC" }}>Guest Checkout</button>
          <div className="text-xs" style={{ color: "#B0A794" }}>or</div>
          <button onClick={() => setMode("account")} className="w-full py-3 text-[12px] tracking-[0.15em] uppercase border" style={{ borderColor: "#14120F", color: "#14120F" }}>Sign In to Account</button>
        </div>
      </div>
    );
  }

  const steps = ["Shipping", "Payment", "Review"];
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex justify-center gap-8 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase" style={{ color: step === i + 1 ? "#14120F" : "#B0A794" }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ background: step >= i + 1 ? "#A9803F" : "#E4DCCB", color: "#FFFDF9" }}>{i + 1}</span>{s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#14120F" }}>Shipping Address</h2>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="First name" className="border px-3 py-2 text-sm outline-none" style={{ borderColor: "#E4DCCB" }} />
            <input placeholder="Last name" className="border px-3 py-2 text-sm outline-none" style={{ borderColor: "#E4DCCB" }} />
          </div>
          <input placeholder="Address" className="w-full border px-3 py-2 text-sm outline-none" style={{ borderColor: "#E4DCCB" }} />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="City" className="border px-3 py-2 text-sm outline-none" style={{ borderColor: "#E4DCCB" }} />
            <input placeholder="Postcode" className="border px-3 py-2 text-sm outline-none" style={{ borderColor: "#E4DCCB" }} />
          </div>
          <button onClick={() => setStep(2)} className="w-full py-3 text-[12px] tracking-[0.15em] uppercase mt-4" style={{ background: "#14120F", color: "#F7F3EC" }}>Continue to Payment</button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-3">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#14120F" }} className="mb-2">Payment Method</h2>
          {["Card via Stripe", "PayPal", "Apple Pay", "Google Pay"].map((m) => (
            <button key={m} className="w-full border px-4 py-3 text-sm text-left" style={{ borderColor: "#E4DCCB", color: "#3a362d" }}>{m}</button>
          ))}
          <button onClick={() => setStep(3)} className="w-full py-3 text-[12px] tracking-[0.15em] uppercase mt-4" style={{ background: "#14120F", color: "#F7F3EC" }}>Review Order</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#14120F" }} className="mb-4">Review & Place Order</h2>
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-2 border-b" style={{ borderColor: "#E4DCCB", color: "#3a362d" }}>
              <span>{item.name} × {item.qty}</span><span>{fmt(item.price * item.qty, currency)}</span>
            </div>
          ))}
          <div className="flex justify-between text-lg mt-4" style={{ fontFamily: "'Playfair Display', serif", color: "#14120F" }}><span>Total</span><span>{fmt(subtotal, currency)}</span></div>
          <button onClick={() => go("confirmation")} className="w-full py-3 text-[12px] tracking-[0.15em] uppercase mt-6" style={{ background: "#14120F", color: "#F7F3EC" }}>Place Order</button>
        </div>
      )}
    </div>
  );
}

function Confirmation({ go }) {
  return (
    <div className="max-w-md mx-auto px-6 py-28 text-center">
      <FleurDeLis size={28} color="#A9803F" filled />
      <h1 className="mt-5" style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#14120F" }}>Thank you for your order</h1>
      <p className="mt-2 text-sm" style={{ color: "#6F6658" }}>Order #WASE-10482 confirmed. A confirmation, and later a shipping notice with tracking, will be sent to your inbox.</p>
      <button onClick={() => go("home")} className="mt-8 text-[12px] tracking-[0.1em] uppercase underline" style={{ color: "#A9803F" }}>Continue Shopping</button>
    </div>
  );
}

/* ---------------------------- App ---------------------------- */

export default function App() {
  const [view, setView] = useState("home");
  const [params, setParams] = useState({});
  const [currency, setCurrency] = useState("GBP");
  const [country, setCountry] = useState("United Kingdom");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [saved, setSaved] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  function go(v, p = {}) { setView(v); setParams(p); window.scrollTo(0, 0); }
  function toggleWishlist(id) { setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]); }
  function addToCart(product, color, size, qty) {
    setCart((c) => [...c, { ...product, color, size, qty }]);
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F7F3EC", minHeight: "100%" }}>
      <link rel="stylesheet" href={FONT_LINK} />
      <TopBar currency={currency} setCurrency={setCurrency} country={country} setCountry={setCountry} />
      <NavBar go={go} searchOpen={searchOpen} setSearchOpen={setSearchOpen} query={query} setQuery={setQuery}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)} setCartOpen={setCartOpen} wishlistCount={wishlist.length}
        onSearchSelect={(p) => go("pdp", { id: p.id })} />

      {view === "home" && <Home go={go} currency={currency} wishlist={wishlist} toggleWishlist={toggleWishlist} />}
      {view === "plp" && <PLP params={params} go={go} currency={currency} wishlist={wishlist} toggleWishlist={toggleWishlist} />}
      {view === "pdp" && <PDP params={params} go={go} currency={currency} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />}
      {view === "checkout" && <Checkout cart={cart} currency={currency} go={go} />}
      {view === "confirmation" && <Confirmation go={go} />}
      {view === "account" && (
        <div className="max-w-md mx-auto px-6 py-28 text-center">
          <FleurDeLis size={22} color="#A9803F" />
          <h1 className="mt-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#14120F" }}>Wishlist</h1>
          {wishlist.length === 0 ? (
            <p className="mt-3 text-sm" style={{ color: "#6F6658" }}>Nothing saved yet. Tap the heart on any piece to save it here.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 mt-6 text-left">
              {PRODUCTS.filter((p) => wishlist.includes(p.id)).map((p) => (
                <div key={p.id} className="cursor-pointer" onClick={() => go("pdp", { id: p.id })}>
                  <div className="aspect-[3/4]" style={{ background: p.img }} />
                  <div className="text-[11px] mt-1" style={{ color: "#14120F" }}>{p.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="mt-20 py-14 border-t" style={{ borderColor: "#E4DCCB" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm" style={{ color: "#6F6658" }}>
          <div><div className="text-[12px] tracking-[0.1em] uppercase mb-3" style={{ color: "#14120F" }}>Shop</div>{CATEGORIES.slice(0, 4).map((c) => <div key={c} className="mb-1 cursor-pointer hover:opacity-70" onClick={() => go("plp", { category: c })}>{c}</div>)}</div>
          <div><div className="text-[12px] tracking-[0.1em] uppercase mb-3" style={{ color: "#14120F" }}>Support</div><div className="mb-1">Contact Us</div><div className="mb-1">Returns & Exchanges</div><div className="mb-1">Shipping Info</div><div className="mb-1">Size Guide</div></div>
          <div><div className="text-[12px] tracking-[0.1em] uppercase mb-3" style={{ color: "#14120F" }}>The House</div><div className="mb-1">Our Story</div><div className="mb-1">Fashion Journal</div><div className="mb-1">Sustainability</div></div>
          <div><div className="text-[12px] tracking-[0.1em] uppercase mb-3" style={{ color: "#14120F" }}>Connect</div><div className="mb-1">Instagram</div><div className="mb-1">TikTok</div><div className="mb-1">Pinterest</div></div>
        </div>
        <div className="text-center mt-10"><FleurDeLis size={14} color="#A9803F" /></div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} saved={saved} setSaved={setSaved} currency={currency} go={go} />
    </div>
  );
}
