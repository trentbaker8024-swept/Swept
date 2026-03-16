"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  ArrowDown,
  Eye,
  ShieldCheck,
  Users,
  Smartphone,
  DollarSign,
  Trophy,
  MapPin,
  ClipboardCheck,
  FileText,
  Rocket,
  BarChart3,
  ChevronDown,
  CheckCircle,
  Building2,
  Phone,
  Mail,
  Trash2,
  Droplets,
  TrendingDown,
  Award,
  Timer,
  Send,
} from "lucide-react";

// ─── Hooks ──────────────────────────────────────────────────────────────────

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

function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}) {
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
        setCount(decimals > 0 ? parseFloat(start.toFixed(decimals)) : Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── FAQ Accordion ──────────────────────────────────────────────────────────

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-lg font-semibold text-white pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-swept-green shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-6 pb-5 text-gray-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function BringSweptPage() {
  const [formData, setFormData] = useState({
    cityName: "",
    state: "",
    name: "",
    title: "",
    email: "",
    phone: "",
    population: "",
    challenge: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroSection = useInView(0.1);
  const problemSection = useInView();
  const solutionSection = useInView();
  const onboardingSection = useInView();
  const pricingSection = useInView();
  const caseStudySection = useInView();
  const formSection = useInView();
  const faqSection = useInView();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const benefits = [
    {
      icon: Eye,
      title: "Visible Results",
      desc: "Before-and-after photo proof of every single job. No more guessing whether cleanup happened — see it with your own eyes.",
    },
    {
      icon: ShieldCheck,
      title: "Total Accountability",
      desc: "GPS tracking, timestamped photos, real-time dashboards. Every crew member, every route, every job — fully transparent.",
    },
    {
      icon: Users,
      title: "Job Creation",
      desc: "Entry-level jobs with dignity and purpose. Background-checked workforce recruited from the communities we serve.",
    },
    {
      icon: Smartphone,
      title: "Citizen Engagement",
      desc: "Residents report messes and track cleanups via the Swept app. Turns passive complaints into active participation.",
    },
    {
      icon: DollarSign,
      title: "Cost Efficiency",
      desc: "Structured pricing with transparent spend tracking. Measurable ROI that justifies every dollar to taxpayers.",
    },
    {
      icon: Trophy,
      title: "Political Win",
      desc: "Data-driven results your constituents can see and appreciate. Clean streets win elections — we give you the proof.",
    },
  ];

  const steps = [
    {
      num: "01",
      icon: FileText,
      title: "Submit Interest",
      desc: "City submits the interest form below. Our team responds within 48 hours.",
    },
    {
      num: "02",
      icon: MapPin,
      title: "Zone Assessment",
      desc: "Swept conducts a comprehensive zone assessment and proposes a tailored coverage plan.",
    },
    {
      num: "03",
      icon: ClipboardCheck,
      title: "Contract & Hiring",
      desc: "Contract negotiation and local workforce hiring. We prioritize hiring from your community.",
    },
    {
      num: "04",
      icon: Rocket,
      title: "Launch Day",
      desc: "Crews deployed, citizen app goes live, real-time dashboard activated. Visible impact from day one.",
    },
    {
      num: "05",
      icon: BarChart3,
      title: "Report & Optimize",
      desc: "Monthly performance reporting and continuous optimization. We get better every month.",
    },
  ];

  const faqs = [
    {
      question: "How is Swept different from existing city cleanup contractors?",
      answer:
        "Traditional contractors operate in a black box — you pay and hope the work gets done. Swept provides full transparency with GPS-tracked crews, timestamped before/after photos for every job, real-time dashboards, and citizen engagement through our app. Every dollar spent is accountable, and every result is documented.",
    },
    {
      question: "Where does the workforce come from?",
      answer:
        "We prioritize local hiring in every city we operate. Our workforce development program recruits from underserved communities, providing training, background checks, equipment, and a path to career advancement. Many of our crew leads started as entry-level sweepers.",
    },
    {
      question: "What technology is required from the city?",
      answer:
        "Nothing. Swept provides all technology — the crew management platform, citizen-facing app, and administrative dashboard are all cloud-based and accessible via any web browser. We handle all tech infrastructure, training, and support.",
    },
    {
      question: "How do you ensure accountability and quality?",
      answer:
        "Every job requires GPS check-in, before photos, after photos, and supervisor verification. Our AI quality scoring system flags substandard work automatically. City administrators get real-time access to dashboards showing every metric that matters.",
    },
    {
      question: "Can we start with a pilot program?",
      answer:
        "Absolutely. Most cities begin with our Pilot Program — one zone, two crews, three months. It is designed to prove the model with minimal commitment. Over 90% of pilot cities convert to full contracts.",
    },
    {
      question: "What grants or funding can offset the cost?",
      answer:
        "Swept qualifies under multiple federal and state grant programs including EPA Solid Waste grants, HUD Community Development Block Grants, DOT beautification programs, and state-level environmental funds. We also facilitate corporate sponsorship programs that can offset 20-40% of costs.",
    },
    {
      question: "How quickly can you launch in our city?",
      answer:
        "From signed contract to boots on the ground: typically 6-8 weeks. This includes workforce hiring and training, zone mapping, equipment procurement, and technology deployment. Pilot programs can launch in as few as 4 weeks.",
    },
    {
      question: "Do citizens need to download an app?",
      answer:
        "The citizen reporting app is optional but powerful. Citizens can also report via our web portal or by texting a dedicated number. The app enhances engagement but is not required for Swept to operate effectively in your city.",
    },
  ];

  const pricingTiers = [
    {
      name: "Pilot Program",
      price: "$135K",
      period: "/month",
      details: "1 zone  ·  2 crews  ·  3-month trial",
      features: [
        "Full technology platform",
        "Before/after documentation",
        "Real-time dashboard access",
        "Monthly performance reports",
        "Citizen app deployment",
      ],
      highlight: false,
      cta: "Start a Pilot",
    },
    {
      name: "City Standard",
      price: "$450K",
      period: "/month",
      details: "3-5 zones  ·  6-10 crews  ·  Annual contract",
      features: [
        "Everything in Pilot, plus:",
        "Dedicated account manager",
        "Custom zone prioritization",
        "Weekly optimization reports",
        "Corporate sponsorship facilitation",
        "Grant application support",
      ],
      highlight: true,
      cta: "Get a Proposal",
    },
    {
      name: "Metro Scale",
      price: "Custom",
      period: " pricing",
      details: "10+ zones  ·  20+ crews  ·  Multi-year",
      features: [
        "Everything in City Standard, plus:",
        "Workforce development programs",
        "Multi-department integration",
        "Dedicated operations center",
        "Custom reporting & analytics",
        "Community engagement campaigns",
      ],
      highlight: false,
      cta: "Contact Us",
    },
  ];

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
            <span className="text-xl font-black tracking-tight text-white">SWEPT</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#the-problem" className="hover:text-white transition-colors">
              The Problem
            </a>
            <a href="#solution" className="hover:text-white transition-colors">
              Solution
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <a
              href="#interest-form"
              className="text-sm font-semibold bg-swept-green text-swept-dark px-4 py-2 rounded-lg hover:bg-swept-lime transition-colors"
            >
              Request a Proposal
            </a>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="space-y-1.5">
              <div
                className={`w-6 h-0.5 bg-white transition-all ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <div
                className={`w-6 h-0.5 bg-white transition-all ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <div
                className={`w-6 h-0.5 bg-white transition-all ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-swept-dark/95 backdrop-blur-xl border-t border-white/5 px-6 py-6 space-y-4">
            <a
              href="#the-problem"
              className="block text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              The Problem
            </a>
            <a
              href="#solution"
              className="block text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Solution
            </a>
            <a
              href="#pricing"
              className="block text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="block text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <div className="pt-4 border-t border-white/10 space-y-3">
              <Link href="/" className="block text-gray-300 font-semibold">
                Home
              </Link>
              <a
                href="#interest-form"
                className="block bg-swept-green text-swept-dark font-semibold px-4 py-2 rounded-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Request a Proposal
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-swept-green/5 rounded-full blur-[120px]" />
        </div>

        <div
          ref={heroSection.ref}
          className={`max-w-5xl mx-auto text-center relative z-10 transition-all duration-1000 ${
            heroSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-swept-green/10 border border-swept-green/20 rounded-full px-5 py-2 mb-8">
            <Building2 className="w-4 h-4 text-swept-green" />
            <span className="text-sm font-semibold text-swept-green">For City Officials & Decision Makers</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
            Bring Swept to{" "}
            <span className="text-swept-green glow">Your City</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Join the cities that are choosing visible, accountable civic improvement.
            Clean streets, transparent spending, and results your constituents can see.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#interest-form"
              className="group inline-flex items-center gap-2 bg-swept-green text-swept-dark font-bold px-8 py-4 rounded-xl text-lg hover:bg-swept-lime transition-all hover:scale-105"
            >
              Request a Proposal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#the-problem"
              className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/5 transition-all"
            >
              See the Data
              <ArrowDown className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          THE PROBLEM
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="the-problem" className="py-24 px-6">
        <div
          ref={problemSection.ref}
          className={`max-w-6xl mx-auto transition-all duration-1000 ${
            problemSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-16">
            <span className="text-swept-orange font-bold text-sm tracking-widest uppercase">
              The Problem
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              A Crisis Hiding in Plain Sight
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Litter and waste mismanagement cost American cities billions — and the problem is getting worse.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Trash2,
                stat: <AnimatedCounter end={292.4} suffix="M" decimals={1} />,
                unit: "tons",
                label: "Waste generated annually in America",
              },
              {
                icon: DollarSign,
                stat: <AnimatedCounter end={11.5} prefix="$" suffix="B" decimals={1} />,
                unit: "per year",
                label: "Litter cleanup cost to taxpayers",
              },
              {
                icon: Droplets,
                stat: <AnimatedCounter end={78} suffix="%" />,
                unit: "",
                label: "Of litter that ends up in waterways",
              },
              {
                icon: TrendingDown,
                stat: "$500+",
                unit: "per capita",
                label: "Average city spend on waste management",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-swept-gray border border-white/5 rounded-2xl p-8 text-center hover:border-swept-orange/30 transition-colors"
              >
                <div className="w-14 h-14 bg-swept-orange/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-swept-orange" />
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1">
                  {item.stat}
                </div>
                {item.unit && (
                  <div className="text-sm text-swept-orange font-semibold mb-3">{item.unit}</div>
                )}
                <p className="text-gray-400 text-sm leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-swept-orange/10 via-swept-orange/5 to-swept-orange/10 border border-swept-orange/20 rounded-2xl p-8 text-center">
            <p className="text-xl sm:text-2xl text-white font-bold">
              The status quo is massive, expensive, and{" "}
              <span className="text-swept-orange">visually unacceptable.</span>
            </p>
            <p className="text-gray-400 mt-2">
              Your residents see the problem every day. Swept makes the solution just as visible.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          THE SWEPT SOLUTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="solution" className="py-24 px-6 bg-swept-gray/50">
        <div
          ref={solutionSection.ref}
          className={`max-w-6xl mx-auto transition-all duration-1000 ${
            solutionSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-16">
            <span className="text-swept-green font-bold text-sm tracking-widest uppercase">
              The Solution
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              Why Cities Choose Swept
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Six pillars that make Swept the most accountable civic cleanup platform ever built.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="group bg-swept-dark border border-white/5 rounded-2xl p-8 hover:border-swept-green/30 transition-all card-hover"
              >
                <div className="w-14 h-14 bg-swept-green/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-swept-green/20 transition-colors">
                  <b.icon className="w-7 h-7 text-swept-green" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{b.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          HOW ONBOARDING WORKS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div
          ref={onboardingSection.ref}
          className={`max-w-5xl mx-auto transition-all duration-1000 ${
            onboardingSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-16">
            <span className="text-swept-green font-bold text-sm tracking-widest uppercase">
              Onboarding
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              From Interest to Impact
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Five clear steps from first contact to clean streets. Most cities launch in 6-8 weeks.
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="group flex items-start gap-6 bg-swept-gray border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-swept-green/20 transition-colors"
              >
                <div className="shrink-0">
                  <div className="w-16 h-16 bg-swept-green/10 rounded-2xl flex items-center justify-center group-hover:bg-swept-green/20 transition-colors">
                    <span className="text-2xl font-black text-swept-green">{step.num}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className="w-5 h-5 text-swept-green" />
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-24 px-6 bg-swept-gray/50">
        <div
          ref={pricingSection.ref}
          className={`max-w-6xl mx-auto transition-all duration-1000 ${
            pricingSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-16">
            <span className="text-swept-green font-bold text-sm tracking-widest uppercase">
              Pricing
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              Transparent, Scalable Pricing
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Start with a pilot. Scale when you see results. Every tier includes our full technology platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 border transition-all card-hover ${
                  tier.highlight
                    ? "bg-gradient-to-b from-swept-green/10 to-swept-dark border-swept-green/40 scale-[1.02]"
                    : "bg-swept-dark border-white/10"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-swept-green text-swept-dark text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-sm text-gray-400 mb-6">{tier.details}</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{tier.price}</span>
                  <span className="text-gray-400">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-swept-green shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#interest-form"
                  className={`block text-center font-bold py-3 rounded-xl transition-colors ${
                    tier.highlight
                      ? "bg-swept-green text-swept-dark hover:bg-swept-lime"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-swept-dark border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Award className="w-10 h-10 text-swept-green shrink-0" />
            <div>
              <h4 className="text-white font-bold text-lg">Funding Offsets Available</h4>
              <p className="text-gray-400 text-sm mt-1">
                Corporate sponsorship programs can offset 20-40% of costs. Swept also qualifies for
                EPA grants, HUD Community Development Block Grants, and state environmental funds.
                We help you apply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CASE STUDY
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div
          ref={caseStudySection.ref}
          className={`max-w-6xl mx-auto transition-all duration-1000 ${
            caseStudySection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-16">
            <span className="text-swept-green font-bold text-sm tracking-widest uppercase">
              Case Study
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              Dallas Pilot Program
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              90 days. One zone. Results that speak for themselves.
            </p>
          </div>

          <div className="bg-gradient-to-br from-swept-gray to-swept-dark border border-white/10 rounded-3xl overflow-hidden">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
              {[
                {
                  value: <AnimatedCounter end={47} suffix=" tons" />,
                  label: "Litter removed",
                },
                {
                  value: <AnimatedCounter end={200} suffix="+" />,
                  label: "Jobs created",
                },
                {
                  value: <AnimatedCounter end={12} suffix="K" />,
                  label: "Citizen reports resolved",
                },
                {
                  value: <AnimatedCounter end={94} suffix="%" />,
                  label: "Satisfaction rating",
                },
                {
                  value: <AnimatedCounter end={34} suffix="%" />,
                  label: "Cost savings vs. prior contractor",
                },
              ].map((stat, i) => (
                <div key={i} className="p-8 text-center">
                  <div className="text-3xl sm:text-4xl font-black text-swept-green mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 p-8 sm:p-10">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <Timer className="w-5 h-5 text-swept-green" />
                  <span className="text-white font-bold">90-Day Timeline Highlights</span>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    {
                      month: "Month 1",
                      text: "12 crew members hired and trained. Zone mapping complete. 847 cleanup jobs completed.",
                    },
                    {
                      month: "Month 2",
                      text: "Citizen app adoption hit 3,200 users. Response time dropped to under 4 hours.",
                    },
                    {
                      month: "Month 3",
                      text: "Visible litter reduction of 62%. City council voted unanimously to expand.",
                    },
                  ].map((m, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-5">
                      <div className="text-swept-green font-bold text-sm mb-2">{m.month}</div>
                      <p className="text-gray-400 text-sm leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          INTEREST FORM
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="interest-form" className="py-24 px-6 bg-swept-gray/50">
        <div
          ref={formSection.ref}
          className={`max-w-3xl mx-auto transition-all duration-1000 ${
            formSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-12">
            <span className="text-swept-green font-bold text-sm tracking-widest uppercase">
              Get Started
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              Request a Proposal
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Fill out the form below and our municipal partnerships team will respond within 48 hours
              with a tailored assessment.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-swept-dark border border-swept-green/30 rounded-3xl p-10 sm:p-14 text-center">
              <div className="w-20 h-20 bg-swept-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-swept-green" />
              </div>
              <h3 className="text-3xl font-black text-white mb-3">We Got Your Request</h3>
              <p className="text-gray-400 text-lg mb-2">
                Our municipal partnerships team is reviewing your submission.
              </p>
              <p className="text-gray-500">
                Expect a personalized response within <span className="text-swept-green font-semibold">48 hours</span> with
                a zone assessment and coverage proposal for your city.
              </p>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-500">
                  Questions in the meantime?{" "}
                  <a href="mailto:cities@swept.app" className="text-swept-green hover:underline">
                    cities@swept.app
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-swept-dark border border-white/10 rounded-3xl p-8 sm:p-10 space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    City / Municipality Name *
                  </label>
                  <input
                    type="text"
                    name="cityName"
                    required
                    value={formData.cityName}
                    onChange={handleChange}
                    placeholder="e.g., City of Austin"
                    className="w-full bg-swept-gray border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-swept-green/50 focus:outline-none focus:ring-1 focus:ring-swept-green/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g., Texas"
                    className="w-full bg-swept-gray border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-swept-green/50 focus:outline-none focus:ring-1 focus:ring-swept-green/30 transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full bg-swept-gray border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-swept-green/50 focus:outline-none focus:ring-1 focus:ring-swept-green/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Title / Role *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., City Manager, Council Member"
                    className="w-full bg-swept-gray border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-swept-green/50 focus:outline-none focus:ring-1 focus:ring-swept-green/30 transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@city.gov"
                      className="w-full bg-swept-gray border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-600 focus:border-swept-green/50 focus:outline-none focus:ring-1 focus:ring-swept-green/30 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 000-0000"
                      className="w-full bg-swept-gray border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-600 focus:border-swept-green/50 focus:outline-none focus:ring-1 focus:ring-swept-green/30 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Estimated Population
                </label>
                <select
                  name="population"
                  value={formData.population}
                  onChange={handleChange}
                  className="w-full bg-swept-gray border border-white/10 rounded-xl px-4 py-3 text-white focus:border-swept-green/50 focus:outline-none focus:ring-1 focus:ring-swept-green/30 transition-colors appearance-none"
                >
                  <option value="" className="text-gray-600">
                    Select population range
                  </option>
                  <option value="under-50k">Under 50,000</option>
                  <option value="50k-100k">50,000 - 100,000</option>
                  <option value="100k-250k">100,000 - 250,000</option>
                  <option value="250k-500k">250,000 - 500,000</option>
                  <option value="500k-1m">500,000 - 1,000,000</option>
                  <option value="over-1m">Over 1,000,000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  What is your biggest challenge with litter/cleanup? *
                </label>
                <textarea
                  name="challenge"
                  required
                  value={formData.challenge}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about the specific challenges your city faces with waste management, litter, or public space maintenance..."
                  className="w-full bg-swept-gray border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-swept-green/50 focus:outline-none focus:ring-1 focus:ring-swept-green/30 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full group flex items-center justify-center gap-3 bg-swept-green text-swept-dark font-bold py-4 rounded-xl text-lg hover:bg-swept-lime transition-all hover:scale-[1.01]"
              >
                <Send className="w-5 h-5" />
                Request a Proposal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-gray-600 text-xs">
                Your information is confidential. We will never share your details with third parties.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-24 px-6">
        <div
          ref={faqSection.ref}
          className={`max-w-3xl mx-auto transition-all duration-1000 ${
            faqSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-12">
            <span className="text-swept-green font-bold text-sm tracking-widest uppercase">
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              Common Questions
            </h2>
            <p className="text-gray-400 text-lg">
              Everything city leaders ask before partnering with Swept.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Still have questions?</p>
            <a
              href="mailto:cities@swept.app"
              className="inline-flex items-center gap-2 text-swept-green font-semibold hover:underline"
            >
              <Mail className="w-4 h-4" />
              cities@swept.app
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-swept-gray/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready to Make Your City{" "}
            <span className="text-swept-green glow">Visibly Cleaner?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join the growing network of cities that are choosing accountability, transparency, and
            results their residents can see.
          </p>
          <a
            href="#interest-form"
            className="group inline-flex items-center gap-2 bg-swept-green text-swept-dark font-bold px-10 py-5 rounded-xl text-lg hover:bg-swept-lime transition-all hover:scale-105"
          >
            Request a Proposal Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-swept-green rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-swept-dark" strokeWidth={3} />
            </div>
            <span className="text-sm font-black tracking-tight text-white">SWEPT</span>
          </Link>
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Swept. Clean streets, accountable results.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/report" className="hover:text-white transition-colors">
              Report
            </Link>
            <a href="mailto:cities@swept.app" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
