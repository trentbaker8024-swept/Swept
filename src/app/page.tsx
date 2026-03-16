"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Camera,
  MapPin,
  CheckCircle,
  Shield,
  Users,
  BarChart3,
  Building2,
  ArrowRight,
  Truck,
  Eye,
  Clock,
  TrendingUp,
  Award,
  Briefcase,
  Heart,
  ChevronRight,
  Mail,
  Phone,
  Star,
  Zap,
  Target,
  Globe,
} from "lucide-react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useInView();

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroSection = useInView(0.1);
  const howSection = useInView();
  const officialsSection = useInView();
  const workforceSection = useInView();
  const sponsorSection = useInView();
  const ctaSection = useInView();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setEmail("");
  };

  return (
    <div className="bg-swept-dark min-h-screen overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          NAVIGATION
      ═══════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-swept-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-swept-green rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-swept-dark" strokeWidth={3} />
            </div>
            <span className="text-xl font-black tracking-tight">SWEPT</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#city-officials" className="hover:text-white transition-colors">For Cities</a>
            <a href="#workforce" className="hover:text-white transition-colors">Jobs</a>
            <a href="#sponsors" className="hover:text-white transition-colors">Sponsors</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/report"
              className="text-sm font-semibold text-swept-green hover:text-white transition-colors"
            >
              Report a Mess
            </Link>
            <Link
              href="/bring-swept"
              className="text-sm font-semibold bg-swept-green text-swept-dark px-4 py-2 rounded-lg hover:bg-swept-lime transition-colors"
            >
              Bring Swept to Your City
            </Link>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="space-y-1.5">
              <div className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <div className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <div className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-swept-dark/95 backdrop-blur-xl border-t border-white/5 px-6 py-6 space-y-4">
            <a href="#how-it-works" className="block text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#city-officials" className="block text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>For Cities</a>
            <a href="#workforce" className="block text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Jobs</a>
            <a href="#sponsors" className="block text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Sponsors</a>
            <div className="pt-4 border-t border-white/10 space-y-3">
              <Link href="/report" className="block text-swept-green font-semibold">Report a Mess</Link>
              <Link href="/bring-swept" className="block bg-swept-green text-swept-dark font-semibold px-4 py-2 rounded-lg text-center">Bring Swept to Your City</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroSection.ref}
        className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-0"
      >
        {/* Background grid effect */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(57,255,20,1) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-swept-green/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
          <div
            className={`transition-all duration-1000 ${
              heroSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-swept-green/10 border border-swept-green/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 bg-swept-green rounded-full animate-pulse" />
              <span className="text-swept-green text-sm font-medium">Now operating in 3 cities</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter mb-6">
              YOUR CITY
              <br />
              IS{" "}
              <span className="text-swept-green glow">FILTHY.</span>
            </h1>

            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-300 mb-6">
              Swept fixes that.
            </p>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
              Visible, accountable civic cleanup powered by technology
              and driven by people who give a damn. Citizens report.
              Crews clean. Cities prove it happened.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="/report"
                className="pulse-green group inline-flex items-center justify-center gap-3 bg-swept-green text-swept-dark font-bold text-lg px-8 py-4 rounded-xl hover:bg-swept-lime transition-all"
              >
                <Camera className="w-5 h-5" />
                Report a Mess
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/bring-swept"
                className="group inline-flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-white/10 hover:border-swept-green/30 transition-all"
              >
                <Building2 className="w-5 h-5" />
                Bring Swept to Your City
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scrolling stats bar */}
        <div className="relative border-t border-white/5 bg-swept-gray/50 backdrop-blur-sm">
          <div className="overflow-hidden">
            <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap py-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-12 px-6 shrink-0">
                  <StatItem icon={<Truck className="w-5 h-5 text-swept-green" />} label="47 Tons Removed" />
                  <StatDivider />
                  <StatItem icon={<Users className="w-5 h-5 text-swept-green" />} label="200+ Jobs Created" />
                  <StatDivider />
                  <StatItem icon={<CheckCircle className="w-5 h-5 text-swept-green" />} label="12,000 Reports Resolved" />
                  <StatDivider />
                  <StatItem icon={<MapPin className="w-5 h-5 text-swept-green" />} label="3 Cities Active" />
                  <StatDivider />
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-32 px-6" ref={howSection.ref}>
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-20 transition-all duration-700 ${
              howSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="text-swept-green text-sm font-bold tracking-widest uppercase">The Process</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mt-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-gray-500 text-lg mt-4 max-w-xl mx-auto">
              Three steps. Zero bureaucracy. Total accountability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-swept-green/0 via-swept-green/30 to-swept-green/0" />

            {[
              {
                step: "01",
                title: "Spot It",
                description: "Citizens snap a photo, drop a pin, and submit a report in under 30 seconds. No apps to download. No accounts to create. Just point, shoot, and send.",
                icon: <Camera className="w-8 h-8" />,
                details: ["Photo upload", "GPS auto-tag", "Anonymous option", "30-second submission"],
              },
              {
                step: "02",
                title: "We Sweep It",
                description: "Uniformed, background-checked crews are dispatched within hours. Real workers. Real wages. Real accountability. No excuses.",
                icon: <Truck className="w-8 h-8" />,
                details: ["Dispatched in hours", "Uniformed crews", "Background-checked", "GPS-tracked routes"],
              },
              {
                step: "03",
                title: "Proof It's Done",
                description: "Before-and-after photos. GPS-verified location. Timestamped completion. The receipts are always available because the work is always real.",
                icon: <CheckCircle className="w-8 h-8" />,
                details: ["Before/after photos", "GPS verification", "Timestamped proof", "Public dashboard"],
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`card-hover relative bg-swept-gray border border-white/5 rounded-2xl p-8 transition-all duration-700 delay-${i * 200} ${
                  howSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                {/* Step number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-swept-green/10 border border-swept-green/20 rounded-2xl flex items-center justify-center text-swept-green">
                    {item.icon}
                  </div>
                  <span className="text-6xl font-black text-white/5">{item.step}</span>
                </div>

                <h3 className="text-2xl font-black mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{item.description}</p>

                <div className="space-y-2">
                  {item.details.map((detail) => (
                    <div key={detail} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-swept-green shrink-0" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOR CITY OFFICIALS
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="city-officials" className="py-32 px-6 relative" ref={officialsSection.ref}>
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-swept-dark via-swept-green/[0.02] to-swept-dark pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div
            className={`mb-20 transition-all duration-700 ${
              officialsSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="text-swept-green text-sm font-bold tracking-widest uppercase">For City Officials</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mt-4 tracking-tight max-w-4xl">
              You&apos;re not buying trash pickup.
              <br />
              <span className="text-swept-green glow">You&apos;re buying a re-election case study.</span>
            </h2>
            <p className="text-gray-500 text-lg mt-6 max-w-2xl leading-relaxed">
              Every dollar spent is documented. Every ton removed is photographed.
              Every job created is a constituent with a paycheck and a story.
              This isn&apos;t a line item. This is a legacy.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Dashboard mockup */}
            <div
              className={`transition-all duration-700 delay-200 ${
                officialsSection.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
              }`}
            >
              <div className="bg-swept-gray border border-white/5 rounded-2xl overflow-hidden">
                {/* Mock dashboard header */}
                <div className="bg-swept-dark/50 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs text-gray-600 font-mono">dashboard.swept.city</span>
                  <div />
                </div>

                <div className="p-6 space-y-6">
                  {/* Stats row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Reports This Month", value: "1,247", change: "+23%", color: "text-swept-green" },
                      { label: "Tons Removed", value: "8.4", change: "+12%", color: "text-swept-green" },
                      { label: "Avg Response Time", value: "4.2h", change: "-31%", color: "text-swept-green" },
                      { label: "Citizen Satisfaction", value: "94%", change: "+8%", color: "text-swept-green" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-swept-dark/50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                        <p className="text-2xl font-black">{stat.value}</p>
                        <p className={`text-xs ${stat.color} mt-1`}>{stat.change}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mock chart */}
                  <div className="bg-swept-dark/50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-4">Reports Resolved (Last 7 Days)</p>
                    <div className="flex items-end gap-2 h-32">
                      {[65, 40, 80, 55, 90, 70, 95].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-swept-green/20 border border-swept-green/30 rounded-t-sm transition-all duration-1000"
                            style={{
                              height: officialsSection.isVisible ? `${h}%` : "0%",
                              transitionDelay: `${i * 100 + 500}ms`,
                            }}
                          />
                          <span className="text-[10px] text-gray-600">
                            {["M", "T", "W", "T", "F", "S", "S"][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity feed */}
                  <div className="space-y-3">
                    {[
                      { time: "2 min ago", text: "Zone B-7 cleanup verified", status: "Completed" },
                      { time: "18 min ago", text: "New report: Illegally dumped tires, MLK Blvd", status: "Dispatched" },
                      { time: "1 hr ago", text: "Crew 4 shift started (5 workers)", status: "Active" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center justify-between bg-swept-dark/30 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === "Completed" ? "bg-swept-green" : item.status === "Dispatched" ? "bg-swept-orange" : "bg-blue-400"
                          }`} />
                          <div>
                            <p className="text-sm text-gray-300">{item.text}</p>
                            <p className="text-xs text-gray-600">{item.time}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.status === "Completed"
                            ? "bg-swept-green/10 text-swept-green"
                            : item.status === "Dispatched"
                            ? "bg-swept-orange/10 text-swept-orange"
                            : "bg-blue-400/10 text-blue-400"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* What you get */}
            <div
              className={`transition-all duration-700 delay-400 ${
                officialsSection.isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
              }`}
            >
              <h3 className="text-2xl font-black mb-8">What Your City Gets</h3>
              <div className="space-y-6">
                {[
                  {
                    icon: <BarChart3 className="w-6 h-6" />,
                    title: "Real-Time Dashboards",
                    desc: "Live maps, heat zones, crew tracking. Know exactly what's happening in your city at every moment. Share it with press, council, constituents.",
                  },
                  {
                    icon: <TrendingUp className="w-6 h-6" />,
                    title: "Tonnage & Impact Reports",
                    desc: "Monthly and quarterly reports showing tons removed, response times, cost-per-ton metrics, and trend analysis. Budget-ready documentation.",
                  },
                  {
                    icon: <Users className="w-6 h-6" />,
                    title: "Job Creation Metrics",
                    desc: "Every position filled is tracked. Local hiring rates, retention data, wage information, career advancement stats. Real economic impact.",
                  },
                  {
                    icon: <Star className="w-6 h-6" />,
                    title: "Citizen Satisfaction Data",
                    desc: "Automated follow-ups on resolved reports. NPS scores. Sentiment tracking. Know exactly how your residents feel about the program.",
                  },
                  {
                    icon: <Eye className="w-6 h-6" />,
                    title: "Before/After Documentation",
                    desc: "Every single cleanup is photographed, geotagged, and timestamped. An unimpeachable record of work done. Perfect for press releases.",
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: "Full Transparency Portal",
                    desc: "A public-facing page your constituents can access. Build trust through total visibility. Nothing hidden, nothing vague.",
                  },
                ].map((item, i) => (
                  <div key={item.title} className="flex gap-4 group">
                    <div className="w-12 h-12 bg-swept-green/10 border border-swept-green/20 rounded-xl flex items-center justify-center text-swept-green shrink-0 group-hover:bg-swept-green/20 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link
                  href="/bring-swept"
                  className="group inline-flex items-center gap-2 bg-swept-green text-swept-dark font-bold px-6 py-3 rounded-xl hover:bg-swept-lime transition-colors"
                >
                  Request a City Proposal
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          THE WORKFORCE
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="workforce" className="py-32 px-6" ref={workforceSection.ref}>
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-20 transition-all duration-700 ${
              workforceSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="text-swept-green text-sm font-bold tracking-widest uppercase">The Workforce</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mt-4 tracking-tight">
              Jobs with <span className="text-swept-green glow">Dignity.</span>
            </h2>
            <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
              Not gig work. Not temp labor. Real positions with real wages,
              real uniforms, and a real path forward. Every crew member is
              background-checked, trained, and invested in their community.
            </p>
          </div>

          {/* Values grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { icon: <Shield className="w-7 h-7" />, title: "Background-Checked", desc: "Every worker passes a thorough background check. Safety and trust are non-negotiable." },
              { icon: <Award className="w-7 h-7" />, title: "Uniformed", desc: "Professional uniforms. Visible presence. Pride in the work. Your neighbors will know who's cleaning up." },
              { icon: <Heart className="w-7 h-7" />, title: "Fairly Paid", desc: "Living wages, not minimum wage. Benefits. Consistent hours. Because dignity isn't optional." },
              { icon: <TrendingUp className="w-7 h-7" />, title: "Career Growth", desc: "This isn't a dead end. It's a launchpad. Clear advancement paths with real milestones." },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`card-hover bg-swept-gray border border-white/5 rounded-2xl p-6 text-center transition-all duration-700 ${
                  workforceSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="w-14 h-14 bg-swept-green/10 border border-swept-green/20 rounded-2xl flex items-center justify-center text-swept-green mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Career Ladder */}
          <div
            className={`bg-swept-gray border border-white/5 rounded-2xl p-8 md:p-12 transition-all duration-700 delay-300 ${
              workforceSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h3 className="text-2xl font-black mb-2 text-center">The Career Ladder</h3>
            <p className="text-gray-500 text-center mb-10">Every rung is reachable. Every promotion is earned.</p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
              {[
                { role: "Worker", desc: "Entry-level. No experience needed. We train you.", icon: <Users className="w-6 h-6" /> },
                { role: "Crew Lead", desc: "Lead a team of 4-6. Coordinate daily operations.", icon: <Briefcase className="w-6 h-6" /> },
                { role: "Zone PM", desc: "Manage an entire zone. Budgets. Logistics. Strategy.", icon: <Target className="w-6 h-6" /> },
                { role: "City Account Manager", desc: "Own the city relationship. The ultimate leadership role.", icon: <Globe className="w-6 h-6" /> },
              ].map((item, i) => (
                <div key={item.role} className="flex items-center gap-0">
                  <div className="flex flex-col items-center text-center w-48">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${
                      i === 3
                        ? "bg-swept-green text-swept-dark"
                        : "bg-swept-green/10 border border-swept-green/20 text-swept-green"
                    }`}>
                      {item.icon}
                    </div>
                    <h4 className="font-bold">{item.role}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  {i < 3 && (
                    <ChevronRight className="w-6 h-6 text-swept-green/40 hidden md:block mx-4 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/crew"
                className="group inline-flex items-center gap-2 text-swept-green font-bold hover:text-swept-lime transition-colors"
              >
                Join a Swept Crew
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOR BUSINESSES / SPONSORS
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="sponsors" className="py-32 px-6 relative" ref={sponsorSection.ref}>
        <div className="absolute inset-0 bg-gradient-to-b from-swept-dark via-swept-green/[0.02] to-swept-dark pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className={`transition-all duration-700 ${
                sponsorSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="text-swept-green text-sm font-bold tracking-widest uppercase">For Businesses</span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mt-4 tracking-tight">
                Adopt-a-Zone.
              </h2>
              <p className="text-gray-500 text-lg mt-6 max-w-lg leading-relaxed">
                Corporate sponsorship that people actually see. Not a logo on a PDF.
                Not a tax write-off buried in a filing. Real, visible impact in the
                neighborhoods where your customers live.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Your brand name on the zone: in-app, on crew uniforms, on social media reports",
                  "Monthly impact reports with your branding — shareable on your channels",
                  "Employee volunteer days with your Swept crew",
                  "Before/after content for your CSR pages and annual reports",
                  "Local press coverage of your partnership",
                  "Direct community goodwill — your neighbors see you investing",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-swept-green shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link
                  href="/bring-swept"
                  className="group inline-flex items-center gap-2 bg-swept-green text-swept-dark font-bold px-6 py-3 rounded-xl hover:bg-swept-lime transition-colors"
                >
                  Become a Sponsor
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Sponsor showcase mockup */}
            <div
              className={`transition-all duration-700 delay-300 ${
                sponsorSection.isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
              }`}
            >
              <div className="bg-swept-gray border border-white/5 rounded-2xl p-8">
                {/* Mock phone frame */}
                <div className="max-w-xs mx-auto">
                  <div className="bg-swept-dark rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    {/* Phone status bar */}
                    <div className="bg-swept-dark px-6 py-2 flex items-center justify-between text-[10px] text-gray-500">
                      <span>9:41</span>
                      <div className="w-20 h-5 bg-white/10 rounded-full" />
                      <span>100%</span>
                    </div>

                    {/* App content */}
                    <div className="p-4 space-y-4">
                      <div className="text-center py-3">
                        <p className="text-xs text-swept-green font-bold uppercase tracking-wider">Zone B-7 Sponsor</p>
                        <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-4">
                          <div className="w-16 h-16 bg-swept-green/20 rounded-xl mx-auto mb-2 flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-swept-green" />
                          </div>
                          <p className="text-sm font-bold">Your Business Name</p>
                          <p className="text-xs text-gray-500 mt-1">Proud sponsor of Zone B-7</p>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 space-y-3">
                        <p className="text-xs text-gray-400 font-semibold">This Month&apos;s Impact</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center">
                            <p className="text-xl font-black text-swept-green">2.4T</p>
                            <p className="text-[10px] text-gray-500">Tons Removed</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-black text-swept-green">184</p>
                            <p className="text-[10px] text-gray-500">Reports Resolved</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-[10px] text-gray-500 mb-2">Latest Cleanup</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-red-500/10 rounded-lg h-20 flex items-center justify-center">
                            <span className="text-xs text-red-400">Before</span>
                          </div>
                          <div className="bg-swept-green/10 rounded-lg h-20 flex items-center justify-center">
                            <span className="text-xs text-swept-green">After</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-center text-gray-600 text-xs mt-6">
                  Actual in-app sponsor experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SOCIAL PROOF / NUMBERS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-y border-white/5 bg-swept-gray/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 47, suffix: "T", label: "Tons of Trash Removed" },
              { value: 200, suffix: "+", label: "Jobs Created" },
              { value: 12000, suffix: "", label: "Reports Resolved" },
              { value: 94, suffix: "%", label: "Citizen Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl md:text-5xl font-black text-swept-green glow">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-gray-500 text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA / CONTACT
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-32 px-6 relative" ref={ctaSection.ref}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-swept-green/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div
            className={`transition-all duration-700 ${
              ctaSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
              Ready to clean up
              <br />
              <span className="text-swept-green glow">your city?</span>
            </h2>
            <p className="text-gray-500 text-lg mt-6 mb-12 max-w-lg mx-auto">
              Whether you&apos;re a mayor, a city councilmember, a business owner,
              or just someone who&apos;s tired of seeing trash everywhere &mdash; let&apos;s talk.
            </p>

            {formSubmitted ? (
              <div className="bg-swept-green/10 border border-swept-green/20 rounded-2xl p-8 animate-in">
                <CheckCircle className="w-12 h-12 text-swept-green mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">We got you.</h3>
                <p className="text-gray-400">Someone from the Swept team will reach out within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-swept-gray border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-swept-green/50 focus:ring-1 focus:ring-swept-green/30 transition-all"
                />
                <button
                  type="submit"
                  className="pulse-green bg-swept-green text-swept-dark font-bold px-8 py-4 rounded-xl hover:bg-swept-lime transition-colors whitespace-nowrap"
                >
                  Get in Touch
                </button>
              </form>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                hello@swept.city
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                (555) SWEPT-UP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 bg-swept-dark px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-swept-green rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-swept-dark" strokeWidth={3} />
                </div>
                <span className="text-xl font-black tracking-tight">SWEPT</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Clean cities. Real jobs.
                <br />
                Total accountability.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-gray-300 mb-4">Platform</h4>
              <div className="space-y-3">
                <Link href="/report" className="block text-sm text-gray-600 hover:text-white transition-colors">Report a Mess</Link>
                <Link href="/dashboard" className="block text-sm text-gray-600 hover:text-white transition-colors">Dashboard</Link>
                <Link href="/bring-swept" className="block text-sm text-gray-600 hover:text-white transition-colors">Bring Swept to Your City</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-gray-300 mb-4">Company</h4>
              <div className="space-y-3">
                <a href="#how-it-works" className="block text-sm text-gray-600 hover:text-white transition-colors">How It Works</a>
                <Link href="/crew" className="block text-sm text-gray-600 hover:text-white transition-colors">Join a Crew</Link>
                <a href="#sponsors" className="block text-sm text-gray-600 hover:text-white transition-colors">Sponsor a Zone</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-gray-300 mb-4">For Officials</h4>
              <div className="space-y-3">
                <a href="#city-officials" className="block text-sm text-gray-600 hover:text-white transition-colors">City Overview</a>
                <Link href="/dashboard" className="block text-sm text-gray-600 hover:text-white transition-colors">Live Dashboard</Link>
                <a href="#contact" className="block text-sm text-gray-600 hover:text-white transition-colors">Request Proposal</a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-700 text-sm">
              &copy; {new Date().getFullYear()} Swept. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-700">
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-bold text-gray-300 whitespace-nowrap">{label}</span>
    </div>
  );
}

function StatDivider() {
  return <div className="w-1.5 h-1.5 bg-swept-green/30 rounded-full" />;
}
