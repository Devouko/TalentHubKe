"use client";

import React, { useState } from 'react';
import { ArrowRight, Play, Menu } from 'lucide-react';

interface NavLink {
    label: string;
    href: string;
    isActive?: boolean;
}

interface ResponsiveHeroBannerProps {
    logoText?: string;
    backgroundImageUrl?: string;
    navLinks?: NavLink[];
    ctaButtonText?: string;
    ctaButtonHref?: string;
    badgeText?: string;
    badgeLabel?: string;
    title?: string;
    titleLine2?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    statsTitle?: string;
    stats?: Array<{ label: string; value: string }>;
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
    logoText = "Transform to Talent",
    backgroundImageUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80",
    navLinks = [
        { label: "Home", href: "/", isActive: true },
        { label: "Browse Gigs", href: "/browse-gigs" },
        { label: "Find Talent", href: "/all-talent" },
        { label: "Products", href: "/products" },
        { label: "Dashboard", href: "/dashboard" }
    ],
    ctaButtonText = "Get Started",
    ctaButtonHref = "/auth/signin",
    badgeLabel = "New",
    badgeText = "Escrow System Now Live",
    title = "Transform Your Skills",
    titleLine2 = "Into Opportunities",
    description = "Connect with top talent and clients worldwide. Our platform offers secure escrow payments, real-time messaging, and a seamless marketplace experience.",
    primaryButtonText = "Start Earning",
    primaryButtonHref = "/apply-seller",
    secondaryButtonText = "Explore Gigs",
    secondaryButtonHref = "/browse-gigs",
    statsTitle = "Trusted by professionals worldwide",
    stats = [
        { label: "Active Freelancers", value: "10K+" },
        { label: "Projects Completed", value: "50K+" },
        { label: "Client Satisfaction", value: "98%" },
        { label: "Countries", value: "45+" }
    ]
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <section className="w-full isolate min-h-screen overflow-hidden relative">
            <img
                src={backgroundImageUrl}
                alt=""
                className="w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

            <header className="z-10 relative">
                <div className="mx-6">
                    <div className="flex items-center justify-between pt-4">
                        <a
                            href="/"
                            className="text-2xl font-bold text-white"
                        >
                            {logoText}
                        </a>

                        <nav className="hidden md:flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
                                {navLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className={`px-3 py-2 text-sm font-medium hover:text-white transition-colors ${link.isActive ? 'text-white/90' : 'text-white/80'
                                            }`}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <a
                                    href={ctaButtonHref}
                                    className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90 transition-colors"
                                >
                                    {ctaButtonText}
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </nav>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur"
                            aria-expanded={mobileMenuOpen}
                            aria-label="Toggle menu"
                        >
                            <Menu className="h-5 w-5 text-white/90" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="z-10 relative">
                <div className="sm:pt-28 md:pt-32 lg:pt-40 max-w-7xl mx-auto pt-28 px-6 pb-16">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-2.5 py-2 ring-1 ring-white/15 backdrop-blur animate-fade-in">
                            <span className="inline-flex items-center text-xs font-medium text-neutral-900 bg-white/90 rounded-full py-0.5 px-2">
                                {badgeLabel}
                            </span>
                            <span className="text-sm font-medium text-white/90">
                                {badgeText}
                            </span>
                        </div>

                        <h1 className="sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-4xl text-white tracking-tight font-bold animate-fade-in-up">
                            {title}
                            <br className="hidden sm:block" />
                            {titleLine2}
                        </h1>

                        <p className="sm:text-lg text-base text-white/80 max-w-2xl mt-6 mx-auto animate-fade-in-up-delay">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:gap-4 mt-10 gap-3 items-center justify-center animate-fade-in-up-delay-2">
                            <a
                                href={primaryButtonHref}
                                className="inline-flex items-center gap-2 hover:bg-white/15 text-sm font-medium text-white bg-white/10 ring-white/15 ring-1 rounded-full py-3 px-5 transition-colors"
                            >
                                {primaryButtonText}
                                <ArrowRight className="h-4 w-4" />
                            </a>
                            <a
                                href={secondaryButtonHref}
                                className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-3 text-sm font-medium text-white/90 hover:text-white transition-colors"
                            >
                                {secondaryButtonText}
                                <Play className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div className="mx-auto mt-20 max-w-5xl">
                        <p className="text-sm text-white/70 text-center mb-6">
                            {statsTitle}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            {stats.map((stat, index) => (
                                <div key={index} className="animate-fade-in-up">
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-white/70">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResponsiveHeroBanner;
