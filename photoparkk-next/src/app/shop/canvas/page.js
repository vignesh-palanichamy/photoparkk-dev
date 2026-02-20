'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

// ─── Shape Data ───────────────────────────────────────────────────────────────
const shapeData = [
    {
        name: "Portrait",
        tag: "Most Popular",
        subtitle: "3 : 4 Ratio",
        description: "Perfect for solo portraits, couple shots & staircase walls.",
        route: "/shop/canvas/portrait",
        img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&q=90&auto=format&fit=crop",
        shape: "portrait",
    },
    {
        name: "Landscape",
        tag: "Best Seller",
        subtitle: "4 : 3 Ratio",
        description: "Ideal for scenic destinations, events & living room feature walls.",
        route: "/shop/canvas/landscape",
        img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=90&auto=format&fit=crop",
        shape: "landscape",
    },
    {
        name: "Square",
        tag: "Classic",
        subtitle: "1 : 1 Ratio",
        description: "Timeless square format for any photo — social media favourite.",
        route: "/shop/canvas/square",
        img: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=700&q=90&auto=format&fit=crop",
        shape: "square",
    },
];

const guarantees = [
    "Premium gallery-grade cotton canvas",
    "Vibrant HD colour reproduction",
    "Ready to hang — hardware included",
    "Ships in 4–6 business days",
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CanvasShop() {
    const router = useRouter();

    return (
        <>
            <style>{`
                .canvas-page {
                    font-family: 'Poppins', sans-serif;
                    background: #FAF8F4;
                    color: #1d1d1f;
                    min-height: 100vh;
                }

                /* ── Hero ── */
                .canvas-page .cp-hero {
                    position: relative;
                    width: 100%;
                    min-height: 78vh;
                    background: linear-gradient(160deg, #0a0f1e 0%, #0d1a3a 55%, #0a1228 100%);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }
                .canvas-page .cp-hero-bg-img {
                    position: absolute; inset: 0; width: 100%; height: 100%;
                    object-fit: cover; object-position: center 30%;
                    opacity: 0.22;
                    filter: saturate(0.6);
                }
                .canvas-page .cp-hero-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to right, rgba(10,15,30,0.9) 0%, rgba(10,15,30,0.5) 55%, rgba(10,15,30,0.15) 100%);
                }
                .canvas-page .cp-hero-content {
                    position: relative; z-index: 2;
                    max-width: 1260px; margin: 0 auto;
                    padding: 80px 48px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 48px;
                    align-items: center;
                    width: 100%;
                }
                .canvas-page .cp-hero-eyebrow {
                    display: inline-flex; align-items: center; gap: 10px;
                    margin-bottom: 24px;
                }
                .canvas-page .cp-hero-eyebrow-line {
                    width: 40px; height: 1px;
                    background: linear-gradient(90deg, #0071e3, #60a5fa);
                }
                .canvas-page .cp-hero-eyebrow-text {
                    font-size: 11px; letter-spacing: 3.5px; text-transform: uppercase;
                    color: #60a5fa; font-weight: 500;
                }
                .canvas-page .cp-hero-h1 {
                    font-family: 'Poppins', sans-serif;
                    font-size: clamp(2.4rem, 5.5vw, 4.4rem);
                    font-weight: 700; line-height: 1.08;
                    color: #f5f5f7; letter-spacing: -0.5px;
                    margin-bottom: 20px;
                }
                .canvas-page .cp-hero-h1 em { font-style: normal; color: #60a5fa; }
                .canvas-page .cp-hero-p {
                    font-size: 15px; line-height: 1.85;
                    color: rgba(245,245,247,0.6);
                    font-weight: 300; max-width: 440px;
                    margin-bottom: 40px;
                }
                .canvas-page .cp-hero-cta {
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
                .canvas-page .cp-hero-cta:hover {
                    background: #0077ed;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(0,113,227,0.5);
                }
                .canvas-page .cp-hero-right {
                    display: flex; flex-direction: column; gap: 12px;
                    align-items: flex-end;
                }
                .canvas-page .cp-hero-tag {
                    background: rgba(0,113,227,0.15);
                    border: 1px solid rgba(0,113,227,0.35);
                    border-radius: 4px;
                    padding: 4px 12px;
                    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
                    color: #60a5fa; align-self: flex-start;
                    margin-bottom: 8px;
                }
                .canvas-page .cp-hero-features {
                    list-style: none;
                    display: flex; flex-direction: column; gap: 10px;
                    width: 100%;
                    padding: 0; margin: 0;
                }
                .canvas-page .cp-hero-feature-item {
                    display: flex; align-items: center; gap: 10px;
                    font-size: 13px; color: rgba(245,245,247,0.65); font-weight: 300;
                }
                .canvas-page .cp-hero-feature-dot {
                    width: 4px; height: 4px; border-radius: 50%;
                    background: #0071e3; flex-shrink: 0;
                }

                /* ── Steps Bar ── */
                .canvas-page .cp-steps-bar {
                    background: #fff;
                    border-bottom: 1px solid #e5e5e5;
                    padding: 0 48px;
                }
                .canvas-page .cp-steps-inner {
                    max-width: 1260px; margin: 0 auto;
                    display: flex; align-items: stretch;
                }
                .canvas-page .cp-step-item {
                    display: flex; align-items: center; gap: 14px;
                    padding: 22px 0; flex: 1;
                    border-right: 1px solid #e5e5e5;
                    position: relative;
                }
                .canvas-page .cp-step-item:last-child { border-right: none; padding-right: 0; }
                .canvas-page .cp-step-item:not(:first-child) { padding-left: 36px; }
                .canvas-page .cp-step-num {
                    width: 36px; height: 36px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px; font-weight: 600; flex-shrink: 0;
                }
                .canvas-page .cp-step-num.active { background: #0071e3; color: #fff; }
                .canvas-page .cp-step-num.inactive { background: #f5f5f5; color: #a3a3a3; }
                .canvas-page .cp-step-text-label {
                    font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;
                }
                .canvas-page .cp-step-text-label.active { color: #1d1d1f; }
                .canvas-page .cp-step-text-label.inactive { color: #a3a3a3; }
                .canvas-page .cp-step-text-sub { font-size: 11px; color: #a3a3a3; font-weight: 300; }

                /* ── Section: Choose Shape ── */
                .canvas-page .cp-choose-section {
                    max-width: 1260px;
                    margin: 0 auto;
                    padding: 80px 48px 100px;
                }
                .canvas-page .cp-section-header {
                    display: flex; align-items: flex-end; justify-content: space-between;
                    margin-bottom: 56px;
                    gap: 24px;
                }
                .canvas-page .cp-section-eyebrow {
                    display: inline-block;
                    font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
                    color: #0071e3; font-weight: 600; margin-bottom: 12px;
                }
                .canvas-page .cp-section-h2 {
                    font-family: 'Poppins', sans-serif;
                    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
                    font-weight: 700; color: #1d1d1f; line-height: 1.2;
                    letter-spacing: -0.5px;
                }
                .canvas-page .cp-section-h2 em { font-style: normal; color: #0071e3; }
                .canvas-page .cp-section-divider {
                    flex-shrink: 0;
                    height: 1px; width: 80px;
                    background: linear-gradient(90deg, #0071e3, transparent);
                    margin-bottom: 6px;
                }

                /* ── Cards Grid ── */
                .canvas-page .cp-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 28px;
                }
                @media (max-width: 1024px) {
                    .canvas-page .cp-cards-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 640px) {
                    .canvas-page .cp-cards-grid { grid-template-columns: 1fr; }
                    .canvas-page .cp-hero-content { grid-template-columns: 1fr; padding: 60px 24px; }
                    .canvas-page .cp-hero-right { display: none; }
                    .canvas-page .cp-choose-section { padding: 56px 24px 80px; }
                    .canvas-page .cp-section-header { flex-direction: column; align-items: flex-start; }
                    .canvas-page .cp-steps-bar { padding: 0 24px; }
                }

                /* ── Card ── */
                .canvas-page .cp-shape-card {
                    background: #fff;
                    border-radius: 16px;
                    border: 1px solid #e5e5e5;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    display: flex; flex-direction: column;
                }
                .canvas-page .cp-shape-card:hover {
                    border-color: #0071e3;
                    transform: translateY(-8px);
                    box-shadow: 0 24px 60px rgba(0,113,227,0.15), 0 4px 20px rgba(0,0,0,0.06);
                }
                .canvas-page .cp-card-image-area {
                    position: relative;
                    height: 220px;
                    background: #f5f5f7;
                    display: flex; align-items: center; justify-content: center;
                    overflow: hidden;
                }
                .canvas-page .cp-card-image-bg {
                    position: absolute; inset: 0;
                    background: linear-gradient(160deg, #f5f5f7 0%, #e8eaf0 100%);
                }
                .canvas-page .cp-card-tag {
                    position: absolute; top: 14px; left: 14px; z-index: 5;
                    background: #0071e3; color: #fff;
                    font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
                    font-weight: 600; padding: 4px 10px; border-radius: 4px;
                }
                .canvas-page .cp-card-image-wrap {
                    position: relative; z-index: 2;
                    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    filter: drop-shadow(0 12px 32px rgba(0,0,0,0.18));
                }
                .canvas-page .cp-shape-card:hover .cp-card-image-wrap { transform: scale(1.05); }
                .canvas-page .cp-card-img {
                    display: block; object-fit: cover;
                    transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .canvas-page .cp-shape-card:hover .cp-card-img { transform: scale(1.06); }
                .canvas-page .cp-card-gloss {
                    position: absolute; inset: 0; z-index: 3; pointer-events: none;
                    background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%);
                }
                .canvas-page .cp-card-body {
                    padding: 24px 26px 26px;
                    flex: 1; display: flex; flex-direction: column;
                    gap: 10px;
                }
                .canvas-page .cp-card-header-row {
                    display: flex; align-items: center; justify-content: space-between;
                }
                .canvas-page .cp-card-name {
                    font-family: 'Poppins', sans-serif;
                    font-size: 17px; font-weight: 600; color: #1d1d1f;
                    letter-spacing: -0.2px;
                }
                .canvas-page .cp-card-subtitle {
                    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
                    color: #0071e3; font-weight: 600;
                    background: #e6f2ff; border: 1px solid #bfdbfe;
                    padding: 3px 8px; border-radius: 4px;
                }
                .canvas-page .cp-card-desc {
                    font-size: 12.5px; color: #737373; line-height: 1.7; font-weight: 300;
                }
                .canvas-page .cp-card-footer {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-top: 6px; padding-top: 16px;
                    border-top: 1px solid #f5f5f5;
                }
                .canvas-page .cp-card-cta-text {
                    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
                    font-weight: 600; color: #0071e3;
                }
                .canvas-page .cp-card-arrow {
                    width: 32px; height: 32px; border-radius: 50%;
                    background: #e6f2ff; border: 1px solid #bfdbfe;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.3s;
                }
                .canvas-page .cp-shape-card:hover .cp-card-arrow {
                    background: #0071e3; border-color: #0071e3;
                }

                /* ── Guarantee Strip ── */
                .canvas-page .cp-guarantee-strip {
                    background: linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%);
                    padding: 40px 48px;
                }
                .canvas-page .cp-guarantee-inner {
                    max-width: 1260px; margin: 0 auto;
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 20px;
                }
                .canvas-page .cp-guarantee-title {
                    font-family: 'Poppins', sans-serif;
                    font-size: 15px; font-weight: 600; color: #f5f5f7;
                    letter-spacing: 0.2px;
                }
                .canvas-page .cp-guarantee-items {
                    display: flex; flex-wrap: wrap; gap: 24px;
                }
                .canvas-page .cp-guarantee-item {
                    display: flex; align-items: center; gap: 8px;
                    font-size: 12px; color: rgba(245,245,247,0.65); font-weight: 300;
                }
                .canvas-page .cp-guarantee-check {
                    width: 18px; height: 18px; border-radius: 50%;
                    background: rgba(0,113,227,0.25); border: 1px solid rgba(0,113,227,0.5);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
            `}</style>

            <div className="canvas-page">

                {/* ── HERO ─────────────────────────────────────────────── */}
                <section className="cp-hero">
                    <img
                        src="/assets/frontend_assets/CanvasCustomized/CanvasBanner.jpeg"
                        alt="backdrop"
                        className="cp-hero-bg-img"
                    />
                    <div className="cp-hero-overlay" />

                    <div className="cp-hero-content">
                        <div>
                            <div className="cp-hero-eyebrow">
                                <div className="cp-hero-eyebrow-line" />
                                <span className="cp-hero-eyebrow-text">Premium Canvas Prints</span>
                            </div>

                            <h1 className="cp-hero-h1">
                                Your Photos.<br />
                                On <em>Canvas.</em>
                            </h1>

                            <p className="cp-hero-p">
                                Museum-quality canvas prints that bring warmth and character
                                to any space. Stretched by hand on solid wood frames.
                            </p>

                            <a href="#shapes" className="cp-hero-cta">
                                Start Designing
                                <ArrowRight size={16} />
                            </a>
                        </div>

                        <div className="cp-hero-right">
                            <div className="cp-hero-tag">Cotton Canvas</div>
                            <ul className="cp-hero-features">
                                {[
                                    "400gsm premium cotton canvas",
                                    "Kiln-dried solid wood stretcher bars",
                                    "Archival-grade UV inks for 100+ years",
                                    "Gallery folded edges — no staples visible",
                                ].map((feat, i) => (
                                    <li key={i} className="cp-hero-feature-item">
                                        <div className="cp-hero-feature-dot" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── STEPS BAR ────────────────────────────────────────── */}
                <div className="cp-steps-bar">
                    <div className="cp-steps-inner">
                        {[
                            { num: "01", label: "Choose Shape", sub: "Select your format", active: true },
                            { num: "02", label: "Upload & Crop", sub: "Add your photo", active: false },
                            { num: "03", label: "Finish & Order", sub: "Select size & checkout", active: false },
                        ].map((step, i) => (
                            <div key={i} className="cp-step-item">
                                <div className={`cp-step-num ${step.active ? "active" : "inactive"}`}>
                                    {step.num}
                                </div>
                                <div>
                                    <div className={`cp-step-text-label ${step.active ? "active" : "inactive"}`}>
                                        {step.label}
                                    </div>
                                    <div className="cp-step-text-sub">{step.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CHOOSE SHAPE ──────────────────────────────────────── */}
                <section id="shapes" className="cp-choose-section">
                    <div className="cp-section-header">
                        <div>
                            <span className="cp-section-eyebrow">Step 01</span>
                            <h2 className="cp-section-h2">
                                Choose Your <em>Canvas Shape</em>
                            </h2>
                        </div>
                        <div className="cp-section-divider" />
                    </div>

                    <div className="cp-cards-grid">
                        {shapeData.map((item, i) => (
                            <ShapeCard key={i} data={item} onClick={() => router.push(item.route)} />
                        ))}
                    </div>
                </section>

                {/* ── GUARANTEE STRIP ───────────────────────────────────── */}
                <div className="cp-guarantee-strip">
                    <div className="cp-guarantee-inner">
                        <span className="cp-guarantee-title">Our Canvas Promise</span>
                        <div className="cp-guarantee-items">
                            {guarantees.map((g, i) => (
                                <div key={i} className="cp-guarantee-item">
                                    <div className="cp-guarantee-check">
                                        <Check size={10} color="#60a5fa" />
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

/* ───────────────────────── Shape Card ────────────────────────── */
function ShapeCard({ data, onClick }) {
    const { name, tag, subtitle, description, img, shape } = data;

    const getImageStyle = () => {
        switch (shape) {
            case "portrait":
                return { width: "130px", height: "173px", borderRadius: "6px" };
            case "landscape":
                return { width: "200px", height: "150px", borderRadius: "6px" };
            case "square":
                return { width: "150px", height: "150px", borderRadius: "6px" };
            default:
                return { width: "150px", height: "150px", borderRadius: "6px" };
        }
    };

    return (
        <div className="cp-shape-card" onClick={onClick}>
            <div className="cp-card-image-area">
                <div className="cp-card-image-bg" />
                <div className="cp-card-tag">{tag}</div>
                <div className="cp-card-image-wrap">
                    <img
                        src={img}
                        alt={name}
                        className="cp-card-img"
                        style={getImageStyle()}
                    />
                    <div className="cp-card-gloss" style={getImageStyle()} />
                </div>
            </div>
            <div className="cp-card-body">
                <div className="cp-card-header-row">
                    <span className="cp-card-name">{name}</span>
                    <span className="cp-card-subtitle">{subtitle}</span>
                </div>
                <p className="cp-card-desc">{description}</p>
                <div className="cp-card-footer">
                    <span className="cp-card-cta-text">Customise Now</span>
                    <div className="cp-card-arrow">
                        <ArrowRight size={14} color="#0071e3" />
                    </div>
                </div>
            </div>
        </div>
    );
}
