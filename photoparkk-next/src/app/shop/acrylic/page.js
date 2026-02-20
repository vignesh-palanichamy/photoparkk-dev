'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

// ─── Shape Data ───────────────────────────────────────────────────────────────
const shapeData = [
    {
        name: "Portrait",
        tag: "Most Popular",
        subtitle: "3 : 4 Ratio",
        description: "Perfect for solo portraits, couple shots & staircase walls.",
        route: "/shop/acrylic/portrait/edit",
        img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&q=90&auto=format&fit=crop",
        shape: "portrait",
    },
    {
        name: "Landscape",
        tag: "Best Seller",
        subtitle: "4 : 3 Ratio",
        description: "Ideal for scenic destinations, events & living room feature walls.",
        route: "/shop/acrylic/landscape/edit",
        img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=90&auto=format&fit=crop",
        shape: "landscape",
    },
    {
        name: "Square",
        tag: "Classic",
        subtitle: "1 : 1 Ratio",
        description: "Timeless square format for any photo — social media favourite.",
        route: "/shop/acrylic/square/edit",
        img: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=700&q=90&auto=format&fit=crop",
        shape: "square",
    },
    {
        name: "Love Heart",
        tag: "Romantic",
        subtitle: "Heart Shape",
        description: "A heartfelt keepsake for anniversaries, weddings & gifting.",
        route: "/shop/acrylic/love/edit",
        img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=700&q=90&auto=format&fit=crop",
        shape: "love",
    },
    {
        name: "Hexagon",
        tag: "Modern",
        subtitle: "Hex Shape",
        description: "Create stunning geometric galleries on any wall.",
        route: "/shop/acrylic/hexagon/edit",
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=700&q=90&auto=format&fit=crop",
        shape: "hexagon",
    },
    {
        name: "Round",
        tag: "Minimal",
        subtitle: "Circle Shape",
        description: "Soft, elegant circles that bring warmth to any interior.",
        route: "/shop/acrylic/round/edit",
        img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=700&q=90&auto=format&fit=crop",
        shape: "round",
    },
];

const guarantees = [
    "Crystal-clear UV-grade acrylic",
    "Vibrant HD print quality",
    "Ready to hang — hardware included",
    "Ships in 4–6 business days",
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AcrylicShop() {
    const router = useRouter();

    return (
        <>
            <style>{`
                /* ── ALL STYLES SCOPED UNDER .acrylic-page ── */
                /* Site palette: primary #0071e3 | secondary #1d1d1f | primary-light #e6f2ff */

                .acrylic-page {
                    font-family: 'Poppins', sans-serif;
                    background: #FAF8F4;
                    color: #1d1d1f;
                    min-height: 100vh;
                }

                /* ── Hero ── */
                .acrylic-page .ap-hero {
                    position: relative;
                    width: 100%;
                    min-height: 78vh;
                    background: linear-gradient(160deg, #0a0f1e 0%, #0d1a3a 55%, #0a1228 100%);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }
                .acrylic-page .ap-hero-bg-img {
                    position: absolute; inset: 0; width: 100%; height: 100%;
                    object-fit: cover; object-position: center 30%;
                    opacity: 0.22;
                    filter: saturate(0.6);
                }
                .acrylic-page .ap-hero-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to right, rgba(10,15,30,0.9) 0%, rgba(10,15,30,0.5) 55%, rgba(10,15,30,0.15) 100%);
                }
                .acrylic-page .ap-hero-content {
                    position: relative; z-index: 2;
                    max-width: 1260px; margin: 0 auto;
                    padding: 80px 48px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 48px;
                    align-items: center;
                    width: 100%;
                }
                .acrylic-page .ap-hero-eyebrow {
                    display: inline-flex; align-items: center; gap: 10px;
                    margin-bottom: 24px;
                }
                .acrylic-page .ap-hero-eyebrow-line {
                    width: 40px; height: 1px;
                    background: linear-gradient(90deg, #0071e3, #60a5fa);
                }
                .acrylic-page .ap-hero-eyebrow-text {
                    font-size: 11px; letter-spacing: 3.5px; text-transform: uppercase;
                    color: #60a5fa; font-weight: 500;
                }
                .acrylic-page .ap-hero-h1 {
                    font-family: 'Poppins', sans-serif;
                    font-size: clamp(2.4rem, 5.5vw, 4.4rem);
                    font-weight: 700; line-height: 1.08;
                    color: #f5f5f7; letter-spacing: -0.5px;
                    margin-bottom: 20px;
                }
                .acrylic-page .ap-hero-h1 em { font-style: normal; color: #60a5fa; }
                .acrylic-page .ap-hero-p {
                    font-size: 15px; line-height: 1.85;
                    color: rgba(245,245,247,0.6);
                    font-weight: 300; max-width: 440px;
                    margin-bottom: 40px;
                }
                .acrylic-page .ap-hero-cta {
                    display: inline-flex; align-items: center; gap: 12px;
                    padding: 14px 32px;
                    background: #0071e3;
                    color: #fff; font-size: 13px; font-weight: 600;
                    letter-spacing: 1.2px; text-transform: uppercase;
                    border: none; border-radius: 6px; cursor: pointer;
                    transition: all 0.3s;
                    text-decoration: none;
                    box-shadow: 0 4px 20px rgba(0,113,227,0.4);
                }
                .acrylic-page .ap-hero-cta:hover {
                    background: #0077ed;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(0,113,227,0.5);
                }
                .acrylic-page .ap-hero-right {
                    display: flex; flex-direction: column; gap: 12px;
                    align-items: flex-end;
                }
                .acrylic-page .ap-hero-tag {
                    background: rgba(0,113,227,0.15);
                    border: 1px solid rgba(0,113,227,0.35);
                    border-radius: 4px;
                    padding: 4px 12px;
                    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
                    color: #60a5fa; align-self: flex-start;
                    margin-bottom: 8px;
                }
                .acrylic-page .ap-hero-features {
                    list-style: none;
                    display: flex; flex-direction: column; gap: 10px;
                    width: 100%;
                    padding: 0; margin: 0;
                }
                .acrylic-page .ap-hero-feature-item {
                    display: flex; align-items: center; gap: 10px;
                    font-size: 13px; color: rgba(245,245,247,0.65); font-weight: 300;
                }
                .acrylic-page .ap-hero-feature-dot {
                    width: 4px; height: 4px; border-radius: 50%;
                    background: #0071e3; flex-shrink: 0;
                }

                /* ── Steps Bar ── */
                .acrylic-page .ap-steps-bar {
                    background: #fff;
                    border-bottom: 1px solid #e5e5e5;
                    padding: 0 48px;
                }
                .acrylic-page .ap-steps-inner {
                    max-width: 1260px; margin: 0 auto;
                    display: flex; align-items: stretch;
                }
                .acrylic-page .ap-step-item {
                    display: flex; align-items: center; gap: 14px;
                    padding: 22px 0; flex: 1;
                    border-right: 1px solid #e5e5e5;
                    position: relative;
                }
                .acrylic-page .ap-step-item:last-child { border-right: none; padding-right: 0; }
                .acrylic-page .ap-step-item:not(:first-child) { padding-left: 36px; }
                .acrylic-page .ap-step-num {
                    width: 36px; height: 36px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px; font-weight: 600; flex-shrink: 0;
                }
                .acrylic-page .ap-step-num.active { background: #0071e3; color: #fff; }
                .acrylic-page .ap-step-num.inactive { background: #f5f5f5; color: #a3a3a3; }
                .acrylic-page .ap-step-text-label {
                    font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;
                }
                .acrylic-page .ap-step-text-label.active { color: #1d1d1f; }
                .acrylic-page .ap-step-text-label.inactive { color: #a3a3a3; }
                .acrylic-page .ap-step-text-sub { font-size: 11px; color: #a3a3a3; font-weight: 300; }

                /* ── Section: Choose Shape ── */
                .acrylic-page .ap-choose-section {
                    max-width: 1260px;
                    margin: 0 auto;
                    padding: 80px 48px 100px;
                }
                .acrylic-page .ap-section-header {
                    display: flex; align-items: flex-end; justify-content: space-between;
                    margin-bottom: 56px;
                    gap: 24px;
                }
                .acrylic-page .ap-section-eyebrow {
                    display: inline-block;
                    font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
                    color: #0071e3; font-weight: 600; margin-bottom: 12px;
                }
                .acrylic-page .ap-section-h2 {
                    font-family: 'Poppins', sans-serif;
                    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
                    font-weight: 700; color: #1d1d1f; line-height: 1.2;
                    letter-spacing: -0.5px;
                }
                .acrylic-page .ap-section-h2 em { font-style: normal; color: #0071e3; }
                .acrylic-page .ap-section-divider {
                    flex-shrink: 0;
                    height: 1px; width: 80px;
                    background: linear-gradient(90deg, #0071e3, transparent);
                    margin-bottom: 6px;
                }

                /* ── Cards Grid ── */
                .acrylic-page .ap-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 28px;
                }
                @media (max-width: 1024px) {
                    .acrylic-page .ap-cards-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 640px) {
                    .acrylic-page .ap-cards-grid { grid-template-columns: 1fr; }
                    .acrylic-page .ap-hero-content { grid-template-columns: 1fr; padding: 60px 24px; }
                    .acrylic-page .ap-hero-right { display: none; }
                    .acrylic-page .ap-choose-section { padding: 56px 24px 80px; }
                    .acrylic-page .ap-section-header { flex-direction: column; align-items: flex-start; }
                    .acrylic-page .ap-steps-bar { padding: 0 24px; }
                }

                /* ── Card ── */
                .acrylic-page .ap-shape-card {
                    background: #fff;
                    border-radius: 16px;
                    border: 1px solid #e5e5e5;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    display: flex; flex-direction: column;
                }
                .acrylic-page .ap-shape-card:hover {
                    border-color: #0071e3;
                    transform: translateY(-8px);
                    box-shadow: 0 24px 60px rgba(0,113,227,0.15), 0 4px 20px rgba(0,0,0,0.06);
                }
                .acrylic-page .ap-card-image-area {
                    position: relative;
                    height: 220px;
                    background: #f5f5f7;
                    display: flex; align-items: center; justify-content: center;
                    overflow: hidden;
                }
                .acrylic-page .ap-card-image-bg {
                    position: absolute; inset: 0;
                    background: linear-gradient(160deg, #f5f5f7 0%, #e8eaf0 100%);
                }
                .acrylic-page .ap-card-tag {
                    position: absolute; top: 14px; left: 14px; z-index: 5;
                    background: #0071e3; color: #fff;
                    font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
                    font-weight: 600; padding: 4px 10px; border-radius: 4px;
                }
                .acrylic-page .ap-card-image-wrap {
                    position: relative; z-index: 2;
                    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    filter: drop-shadow(0 12px 32px rgba(0,0,0,0.18));
                }
                .acrylic-page .ap-shape-card:hover .ap-card-image-wrap { transform: scale(1.05); }
                .acrylic-page .ap-card-img {
                    display: block; object-fit: cover;
                    transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .acrylic-page .ap-shape-card:hover .ap-card-img { transform: scale(1.06); }
                .acrylic-page .ap-card-gloss {
                    position: absolute; inset: 0; z-index: 3; pointer-events: none;
                    background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%);
                }
                .acrylic-page .ap-card-body {
                    padding: 24px 26px 26px;
                    flex: 1; display: flex; flex-direction: column;
                    gap: 10px;
                }
                .acrylic-page .ap-card-header-row {
                    display: flex; align-items: center; justify-content: space-between;
                }
                .acrylic-page .ap-card-name {
                    font-family: 'Poppins', sans-serif;
                    font-size: 17px; font-weight: 600; color: #1d1d1f;
                    letter-spacing: -0.2px;
                }
                .acrylic-page .ap-card-subtitle {
                    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
                    color: #0071e3; font-weight: 600;
                    background: #e6f2ff; border: 1px solid #bfdbfe;
                    padding: 3px 8px; border-radius: 4px;
                }
                .acrylic-page .ap-card-desc {
                    font-size: 12.5px; color: #737373; line-height: 1.7; font-weight: 300;
                }
                .acrylic-page .ap-card-footer {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-top: 6px; padding-top: 16px;
                    border-top: 1px solid #f5f5f5;
                }
                .acrylic-page .ap-card-cta-text {
                    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
                    font-weight: 600; color: #0071e3;
                }
                .acrylic-page .ap-card-arrow {
                    width: 32px; height: 32px; border-radius: 50%;
                    background: #e6f2ff; border: 1px solid #bfdbfe;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.3s;
                }
                .acrylic-page .ap-shape-card:hover .ap-card-arrow {
                    background: #0071e3; border-color: #0071e3;
                }

                /* ── Guarantee Strip ── */
                .acrylic-page .ap-guarantee-strip {
                    background: linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%);
                    padding: 40px 48px;
                }
                .acrylic-page .ap-guarantee-inner {
                    max-width: 1260px; margin: 0 auto;
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 20px;
                }
                .acrylic-page .ap-guarantee-title {
                    font-family: 'Poppins', sans-serif;
                    font-size: 15px; font-weight: 600; color: #f5f5f7;
                    letter-spacing: 0.2px;
                }
                .acrylic-page .ap-guarantee-items {
                    display: flex; flex-wrap: wrap; gap: 24px;
                }
                .acrylic-page .ap-guarantee-item {
                    display: flex; align-items: center; gap: 8px;
                    font-size: 12px; color: rgba(245,245,247,0.65); font-weight: 300;
                }
                .acrylic-page .ap-guarantee-check {
                    width: 18px; height: 18px; border-radius: 50%;
                    background: rgba(0,113,227,0.25); border: 1px solid rgba(0,113,227,0.5);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
            `}</style>

            <div className="acrylic-page">

                {/* ── HERO ─────────────────────────────────────────────── */}
                <section className="ap-hero">
                    <img
                        src="/assets/frontend_assets/CanvasCustomized/AcrylicBanner.jpg"
                        alt="backdrop"
                        className="ap-hero-bg-img"
                    />
                    <div className="ap-hero-overlay" />

                    <div className="ap-hero-content">
                        <div>
                            <div className="ap-hero-eyebrow">
                                <div className="ap-hero-eyebrow-line" />
                                <span className="ap-hero-eyebrow-text">The Premium Acrylic Collection</span>
                            </div>
                            <h1 className="ap-hero-h1">
                                Your Memories,<br />
                                <em>Crystallised</em> in<br />
                                Acrylic Glass
                            </h1>
                            <p className="ap-hero-p">
                                Premium UV-grade acrylic printing with unmatched colour depth. Choose your shape, upload your moment — we handle the rest.
                            </p>
                            <button
                                className="ap-hero-cta"
                                onClick={() => {
                                    document.getElementById('choose-shape')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Explore Shapes
                                <ArrowRight size={14} />
                            </button>
                        </div>

                        <div className="ap-hero-right">
                            <span className="ap-hero-tag">Why Acrylic?</span>
                            <ul className="ap-hero-features">
                                {[
                                    "Crystal-clear UV-grade acrylic glass",
                                    "10× more vibrant than standard prints",
                                    "Anti-scratch & moisture resistant",
                                    "Ready-to-hang wall hardware included",
                                    "Handcrafted & QC-checked at our studio",
                                    "Ships pan-India in 4–6 business days",
                                ].map((f, i) => (
                                    <li key={i} className="ap-hero-feature-item">
                                        <div className="ap-hero-feature-dot" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── STEPS BAR ────────────────────────────────────────── */}
                <div className="ap-steps-bar">
                    <div className="ap-steps-inner">
                        {[
                            { n: "1", label: "Select Shape", sub: "You are here" },
                            { n: "2", label: "Upload Photo", sub: "Crop & customise" },
                            { n: "3", label: "Place Order", sub: "Checkout securely" },
                        ].map((s, i) => (
                            <div key={i} className="ap-step-item">
                                <div className={`ap-step-num ${i === 0 ? "active" : "inactive"}`}>{s.n}</div>
                                <div>
                                    <div className={`ap-step-text-label ${i === 0 ? "active" : "inactive"}`}>{s.label}</div>
                                    <div className="ap-step-text-sub">{s.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── SHAPE GRID ────────────────────────────────────────── */}
                <section className="ap-choose-section" id="choose-shape">
                    <div className="ap-section-header">
                        <div>
                            <span className="ap-section-eyebrow">Step 01 / 03</span>
                            <h2 className="ap-section-h2">
                                Choose Your <em>Perfect</em> Frame Shape
                            </h2>
                        </div>
                        <div className="ap-section-divider" />
                    </div>

                    <div className="ap-cards-grid">
                        {shapeData.map((shape, index) => (
                            <ShapeCard
                                key={index}
                                shape={shape}
                                onClick={() => router.push(shape.route)}
                            />
                        ))}
                    </div>
                </section>

                {/* ── GUARANTEE STRIP ──────────────────────────────────── */}
                <div className="ap-guarantee-strip">
                    <div className="ap-guarantee-inner">
                        <span className="ap-guarantee-title">Our Promise to You</span>
                        <div className="ap-guarantee-items">
                            {guarantees.map((g, i) => (
                                <div key={i} className="ap-guarantee-item">
                                    <div className="ap-guarantee-check">
                                        <Check size={10} color="#60a5fa" strokeWidth={2.5} />
                                    </div>
                                    {g}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

// ─── Shape Card ───────────────────────────────────────────────────────────────
function ShapeCard({ shape, onClick }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="ap-shape-card"
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="ap-card-image-area">
                <div className="ap-card-image-bg" />
                {shape.tag && <span className="ap-card-tag">{shape.tag}</span>}
                <div className="ap-card-image-wrap">
                    <ShapeImageClip shape={shape} hovered={hovered} />
                </div>
            </div>

            <div className="ap-card-body">
                <div className="ap-card-header-row">
                    <h3 className="ap-card-name">{shape.name}</h3>
                    <span className="ap-card-subtitle">{shape.subtitle}</span>
                </div>
                <p className="ap-card-desc">{shape.description}</p>
                <div className="ap-card-footer">
                    <span className="ap-card-cta-text">Customise Now</span>
                    <div className="ap-card-arrow">
                        <ArrowRight size={13} color={hovered ? "#fff" : "#0071e3"} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Shape Image Clip ────────────────────────────────────────────────────────
function ShapeImageClip({ shape, hovered }) {
    const { name, img } = shape;
    const gloss = <div className="ap-card-gloss" />;
    const imgStyle = {
        transition: "transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
        transform: hovered ? "scale(1.08)" : "scale(1.0)",
    };

    if (name === "Portrait") return (
        <div style={{ position: "relative", width: "100px", height: "138px", borderRadius: "6px", overflow: "hidden" }}>
            <img src={img} alt={name} className="ap-card-img" style={{ ...imgStyle, width: "100%", height: "100%", objectFit: "cover" }} />
            {gloss}
        </div>
    );
    if (name === "Landscape") return (
        <div style={{ position: "relative", width: "158px", height: "110px", borderRadius: "6px", overflow: "hidden" }}>
            <img src={img} alt={name} className="ap-card-img" style={{ ...imgStyle, width: "100%", height: "100%", objectFit: "cover" }} />
            {gloss}
        </div>
    );
    if (name === "Square") return (
        <div style={{ position: "relative", width: "124px", height: "124px", borderRadius: "6px", overflow: "hidden" }}>
            <img src={img} alt={name} className="ap-card-img" style={{ ...imgStyle, width: "100%", height: "100%", objectFit: "cover" }} />
            {gloss}
        </div>
    );
    if (name === "Round") return (
        <div style={{ position: "relative", width: "124px", height: "124px", borderRadius: "50%", overflow: "hidden" }}>
            <img src={img} alt={name} className="ap-card-img" style={{ ...imgStyle, width: "100%", height: "100%", objectFit: "cover" }} />
            {gloss}
        </div>
    );
    if (name === "Love Heart") return (
        <div style={{ position: "relative", width: "130px", height: "130px" }}>
            <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                    <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
                        <path d="M0.5,0.9 C0.1,0.68,0.01,0.46,0.01,0.3 C0.01,0.155,0.12,0.04,0.265,0.04 C0.346,0.04,0.42,0.08,0.47,0.145 L0.5,0.18 L0.53,0.145 C0.58,0.08,0.654,0.04,0.735,0.04 C0.88,0.04,0.99,0.155,0.99,0.3 C0.99,0.46,0.9,0.68,0.5,0.9 Z" />
                    </clipPath>
                </defs>
            </svg>
            <div style={{ width: "100%", height: "100%", clipPath: "url(#heartClip)", overflow: "hidden" }}>
                <img src={img} alt={name} className="ap-card-img" style={{ ...imgStyle, width: "100%", height: "100%", objectFit: "cover" }} />
                {gloss}
            </div>
        </div>
    );
    if (name === "Hexagon") return (
        <div style={{ position: "relative", width: "130px", height: "130px", clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", overflow: "hidden" }}>
            <img src={img} alt={name} className="ap-card-img" style={{ ...imgStyle, width: "100%", height: "100%", objectFit: "cover" }} />
            {gloss}
        </div>
    );
    return (
        <div style={{ position: "relative", width: "120px", height: "120px", borderRadius: "8px", overflow: "hidden" }}>
            <img src={img} alt={name} className="ap-card-img" style={{ ...imgStyle, width: "100%", height: "100%", objectFit: "cover" }} />
            {gloss}
        </div>
    );
}
