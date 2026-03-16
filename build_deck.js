const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// Icon imports
const { FaCamera, FaMapMarkerAlt, FaCheckCircle, FaShieldAlt, FaUsers, FaChartBar, FaBuilding, FaDollarSign, FaCity, FaHandshake, FaArrowRight, FaBullseye, FaRecycle, FaTruck, FaClipboardCheck, FaStar, FaGlobe } = require("react-icons/fa");

function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// Factory functions for reusable styles (PptxGenJS mutates objects)
const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.3 });
const makeCardShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.2 });

// Colors
const BLACK = "0A0A0A";
const DARK = "111111";
const DARK_GRAY = "1A1A1A";
const MID_GRAY = "2A2A2A";
const LIGHT_GRAY = "888888";
const WHITE = "FFFFFF";
const GREEN = "39FF14";
const ORANGE = "FF6B00";
const LIME = "CCFF00";

async function buildDeck() {
  let pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Swept";
  pres.title = "Swept - Pitch Deck";

  // Pre-render icons
  const icons = {
    camera: await iconToBase64Png(FaCamera, "#39FF14"),
    map: await iconToBase64Png(FaMapMarkerAlt, "#39FF14"),
    check: await iconToBase64Png(FaCheckCircle, "#39FF14"),
    shield: await iconToBase64Png(FaShieldAlt, "#39FF14"),
    users: await iconToBase64Png(FaUsers, "#39FF14"),
    chart: await iconToBase64Png(FaChartBar, "#39FF14"),
    building: await iconToBase64Png(FaBuilding, "#39FF14"),
    dollar: await iconToBase64Png(FaDollarSign, "#39FF14"),
    city: await iconToBase64Png(FaCity, "#39FF14"),
    handshake: await iconToBase64Png(FaHandshake, "#39FF14"),
    arrow: await iconToBase64Png(FaArrowRight, "#39FF14"),
    bullseye: await iconToBase64Png(FaBullseye, "#FF6B00"),
    recycle: await iconToBase64Png(FaRecycle, "#39FF14"),
    truck: await iconToBase64Png(FaTruck, "#39FF14"),
    clipboard: await iconToBase64Png(FaClipboardCheck, "#39FF14"),
    star: await iconToBase64Png(FaStar, "#FF6B00"),
    globe: await iconToBase64Png(FaGlobe, "#39FF14"),
    dollarWhite: await iconToBase64Png(FaDollarSign, "#FFFFFF"),
    usersWhite: await iconToBase64Png(FaUsers, "#FFFFFF"),
    checkWhite: await iconToBase64Png(FaCheckCircle, "#FFFFFF"),
    chartWhite: await iconToBase64Png(FaChartBar, "#FFFFFF"),
  };

  // ==========================================
  // SLIDE 1: TITLE
  // ==========================================
  let s1 = pres.addSlide();
  s1.background = { color: BLACK };
  // Green accent bar at top
  s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });
  s1.addText("SWEPT", {
    x: 0.8, y: 1.0, w: 8.4, h: 1.2,
    fontSize: 72, fontFace: "Arial Black", color: GREEN, bold: true,
    charSpacing: 8, margin: 0
  });
  s1.addText("Clean Cities. Real Jobs.\nTotal Accountability.", {
    x: 0.8, y: 2.2, w: 8.4, h: 1.0,
    fontSize: 28, fontFace: "Arial", color: WHITE, margin: 0
  });
  s1.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.4, w: 2, h: 0.04, fill: { color: GREEN } });
  s1.addText("Visible, accountable civic cleanup powered by technology\nand driven by people who give a damn.", {
    x: 0.8, y: 3.7, w: 7, h: 0.8,
    fontSize: 14, fontFace: "Arial", color: LIGHT_GRAY, margin: 0
  });
  s1.addText("sweptcity.com", {
    x: 0.8, y: 4.8, w: 4, h: 0.5,
    fontSize: 16, fontFace: "Arial", color: GREEN, margin: 0
  });

  // ==========================================
  // SLIDE 2: THE PROBLEM
  // ==========================================
  let s2 = pres.addSlide();
  s2.background = { color: BLACK };
  s2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });
  s2.addText("THE PROBLEM", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.6,
    fontSize: 14, fontFace: "Arial", color: GREEN, bold: true, charSpacing: 4, margin: 0
  });
  s2.addText("Your city is filthy.\nAnd nobody's accountable for the money spent fixing it.", {
    x: 0.8, y: 0.8, w: 8.4, h: 1.0,
    fontSize: 26, fontFace: "Arial", color: WHITE, bold: true, margin: 0
  });

  // Stat cards - row 1
  const statCards = [
    { num: "$11.5B", label: "spent on litter cleanup\nin the US annually", x: 0.8 },
    { num: "50B", label: "pieces of litter clog\nAmerica's roadways", x: 3.4 },
    { num: "7%", label: "property value drop\nin littered neighborhoods", x: 6.0 },
  ];
  statCards.forEach((card) => {
    s2.addShape(pres.shapes.RECTANGLE, {
      x: card.x, y: 2.1, w: 2.4, h: 1.6,
      fill: { color: DARK_GRAY }, shadow: makeCardShadow()
    });
    s2.addShape(pres.shapes.RECTANGLE, { x: card.x, y: 2.1, w: 2.4, h: 0.05, fill: { color: ORANGE } });
    s2.addText(card.num, {
      x: card.x + 0.2, y: 2.25, w: 2.0, h: 0.6,
      fontSize: 32, fontFace: "Arial Black", color: ORANGE, bold: true, margin: 0
    });
    s2.addText(card.label, {
      x: card.x + 0.2, y: 2.85, w: 2.0, h: 0.7,
      fontSize: 11, fontFace: "Arial", color: LIGHT_GRAY, margin: 0
    });
  });

  // Bottom callout
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 4.0, w: 8.4, h: 1.2,
    fill: { color: MID_GRAY }, shadow: makeCardShadow()
  });
  s2.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.0, w: 0.06, h: 1.2, fill: { color: GREEN } });
  s2.addText("Dallas alone spends $20M+ per year fighting litter with a crew of just 18 people.\nNo tracking. No accountability. No proof it happened.", {
    x: 1.1, y: 4.1, w: 7.8, h: 1.0,
    fontSize: 14, fontFace: "Arial", color: WHITE, margin: 0
  });

  // ==========================================
  // SLIDE 3: THE SOLUTION
  // ==========================================
  let s3 = pres.addSlide();
  s3.background = { color: BLACK };
  s3.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });
  s3.addText("THE SOLUTION", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.6,
    fontSize: 14, fontFace: "Arial", color: GREEN, bold: true, charSpacing: 4, margin: 0
  });
  s3.addText("Swept: Visible, accountable civic cleanup.", {
    x: 0.8, y: 0.8, w: 8.4, h: 0.6,
    fontSize: 26, fontFace: "Arial", color: WHITE, bold: true, margin: 0
  });

  // 3 steps
  const steps = [
    { icon: icons.camera, title: "Citizens Report", desc: "Snap a photo, drop a pin.\nGoes into the queue instantly.", x: 0.8 },
    { icon: icons.truck, title: "Crews Clean", desc: "GPS-tracked, uniformed,\nbackground-checked crews.", x: 3.8 },
    { icon: icons.clipboard, title: "Proof It's Done", desc: "Before/after photos.\nTimestamped. Geotagged.", x: 6.8 },
  ];
  steps.forEach((step, i) => {
    s3.addShape(pres.shapes.RECTANGLE, {
      x: step.x, y: 1.7, w: 2.6, h: 2.4,
      fill: { color: DARK_GRAY }, shadow: makeCardShadow()
    });
    // Step number
    s3.addShape(pres.shapes.OVAL, {
      x: step.x + 0.2, y: 1.9, w: 0.45, h: 0.45,
      fill: { color: GREEN }
    });
    s3.addText(String(i + 1), {
      x: step.x + 0.2, y: 1.9, w: 0.45, h: 0.45,
      fontSize: 18, fontFace: "Arial Black", color: BLACK, align: "center", valign: "middle", margin: 0
    });
    s3.addText(step.title, {
      x: step.x + 0.8, y: 1.95, w: 1.6, h: 0.4,
      fontSize: 16, fontFace: "Arial", color: WHITE, bold: true, margin: 0
    });
    s3.addText(step.desc, {
      x: step.x + 0.2, y: 2.6, w: 2.2, h: 0.8,
      fontSize: 12, fontFace: "Arial", color: LIGHT_GRAY, margin: 0
    });
  });

  // Arrow connectors
  s3.addImage({ data: icons.arrow, x: 3.25, y: 2.6, w: 0.35, h: 0.35 });
  s3.addImage({ data: icons.arrow, x: 6.25, y: 2.6, w: 0.35, h: 0.35 });

  // Bottom value prop
  s3.addText("The result: Elected officials get data-driven proof of civic improvement.\nCitizens see their reports resolved. Workers get dignified jobs.", {
    x: 0.8, y: 4.5, w: 8.4, h: 0.8,
    fontSize: 13, fontFace: "Arial", color: LIGHT_GRAY, margin: 0
  });

  // ==========================================
  // SLIDE 4: FOR CITY OFFICIALS
  // ==========================================
  let s4 = pres.addSlide();
  s4.background = { color: BLACK };
  s4.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });
  s4.addText("FOR CITY OFFICIALS", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.6,
    fontSize: 14, fontFace: "Arial", color: GREEN, bold: true, charSpacing: 4, margin: 0
  });
  s4.addText("You're not buying trash pickup.\nYou're buying a re-election case study.", {
    x: 0.8, y: 0.8, w: 8.4, h: 0.8,
    fontSize: 24, fontFace: "Arial", color: WHITE, bold: true, margin: 0
  });

  // What cities get - 2x3 grid
  const cityBenefits = [
    { icon: icons.chart, title: "Real-Time Dashboard", desc: "Live stats on crews, reports, tonnage" },
    { icon: icons.check, title: "Before/After Proof", desc: "Timestamped, geotagged documentation" },
    { icon: icons.users, title: "Job Creation Data", desc: "Track jobs created, hours worked, wages paid" },
    { icon: icons.shield, title: "Fraud-Proof Operations", desc: "GPS tracking on every crew, every shift" },
    { icon: icons.star, title: "Citizen Satisfaction", desc: "94% satisfaction in pilot programs" },
    { icon: icons.globe, title: "Public Transparency", desc: "Citizens track their own reports in the app" },
  ];
  cityBenefits.forEach((b, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const bx = 0.8 + col * 3.0;
    const by = 1.9 + row * 1.4;
    s4.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: by, w: 2.7, h: 1.15,
      fill: { color: DARK_GRAY }, shadow: makeCardShadow()
    });
    s4.addImage({ data: b.icon, x: bx + 0.15, y: by + 0.15, w: 0.35, h: 0.35 });
    s4.addText(b.title, {
      x: bx + 0.6, y: by + 0.12, w: 1.95, h: 0.4,
      fontSize: 13, fontFace: "Arial", color: WHITE, bold: true, margin: 0
    });
    s4.addText(b.desc, {
      x: bx + 0.6, y: by + 0.5, w: 1.95, h: 0.5,
      fontSize: 11, fontFace: "Arial", color: LIGHT_GRAY, margin: 0
    });
  });

  // Quote callout
  s4.addText('"We brought Swept to our city — 47 tons removed, 200 jobs created,\n12,000 citizen reports resolved." — That\'s your press conference.', {
    x: 0.8, y: 4.9, w: 8.4, h: 0.6,
    fontSize: 12, fontFace: "Arial", color: GREEN, italic: true, margin: 0
  });

  // ==========================================
  // SLIDE 5: THE WORKFORCE
  // ==========================================
  let s5 = pres.addSlide();
  s5.background = { color: BLACK };
  s5.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });
  s5.addText("THE WORKFORCE", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.6,
    fontSize: 14, fontFace: "Arial", color: GREEN, bold: true, charSpacing: 4, margin: 0
  });
  s5.addText("Jobs with dignity. Entry-level positions that matter.", {
    x: 0.8, y: 0.8, w: 8.4, h: 0.6,
    fontSize: 24, fontFace: "Arial", color: WHITE, bold: true, margin: 0
  });

  // 4 workforce pillars
  const pillars = [
    { title: "Background\nChecked", desc: "Every worker vetted" },
    { title: "Uniformed\n& Identifiable", desc: "Bold, visible gear" },
    { title: "Fairly\nPaid", desc: "$18-25/hr starting" },
    { title: "Career\nGrowth", desc: "Clear advancement path" },
  ];
  pillars.forEach((p, i) => {
    const px = 0.8 + i * 2.25;
    s5.addShape(pres.shapes.RECTANGLE, {
      x: px, y: 1.7, w: 2.0, h: 1.5,
      fill: { color: DARK_GRAY }, shadow: makeCardShadow()
    });
    s5.addShape(pres.shapes.RECTANGLE, { x: px, y: 1.7, w: 2.0, h: 0.05, fill: { color: GREEN } });
    s5.addText(p.title, {
      x: px + 0.15, y: 1.9, w: 1.7, h: 0.7,
      fontSize: 16, fontFace: "Arial", color: WHITE, bold: true, margin: 0
    });
    s5.addText(p.desc, {
      x: px + 0.15, y: 2.6, w: 1.7, h: 0.4,
      fontSize: 11, fontFace: "Arial", color: LIGHT_GRAY, margin: 0
    });
  });

  // Career ladder
  s5.addText("CAREER LADDER", {
    x: 0.8, y: 3.6, w: 8.4, h: 0.4,
    fontSize: 12, fontFace: "Arial", color: GREEN, bold: true, charSpacing: 3, margin: 0
  });
  const ladder = ["Worker", "Crew Lead", "Zone PM", "City Account Manager"];
  ladder.forEach((role, i) => {
    const lx = 0.8 + i * 2.25;
    s5.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: 4.1, w: 2.0, h: 0.5,
      fill: { color: i === 3 ? GREEN : MID_GRAY }
    });
    s5.addText(role, {
      x: lx, y: 4.1, w: 2.0, h: 0.5,
      fontSize: 13, fontFace: "Arial", color: i === 3 ? BLACK : WHITE,
      bold: true, align: "center", valign: "middle", margin: 0
    });
    if (i < 3) {
      s5.addImage({ data: icons.arrow, x: lx + 2.0, y: 4.17, w: 0.25, h: 0.25 });
    }
  });

  // ==========================================
  // SLIDE 6: MARKET SIZE / OPPORTUNITY
  // ==========================================
  let s6 = pres.addSlide();
  s6.background = { color: BLACK };
  s6.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });
  s6.addText("MARKET OPPORTUNITY", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.6,
    fontSize: 14, fontFace: "Arial", color: GREEN, bold: true, charSpacing: 4, margin: 0
  });
  s6.addText("Cities are already spending this money.\nWe just make it work.", {
    x: 0.8, y: 0.8, w: 8.4, h: 0.8,
    fontSize: 24, fontFace: "Arial", color: WHITE, bold: true, margin: 0
  });

  // Big market numbers
  const markets = [
    { num: "$11.5B", label: "US litter cleanup\nmarket (annual)", color: GREEN },
    { num: "$1.3B", label: "Direct government\nspend on litter", color: GREEN },
    { num: "$9.1B", label: "Business spend\n(sponsorship TAM)", color: ORANGE },
  ];
  markets.forEach((m, i) => {
    const mx = 0.8 + i * 3.1;
    s6.addShape(pres.shapes.RECTANGLE, {
      x: mx, y: 1.9, w: 2.8, h: 1.5,
      fill: { color: DARK_GRAY }, shadow: makeCardShadow()
    });
    s6.addText(m.num, {
      x: mx, y: 2.0, w: 2.8, h: 0.7,
      fontSize: 36, fontFace: "Arial Black", color: m.color, align: "center", margin: 0
    });
    s6.addText(m.label, {
      x: mx, y: 2.7, w: 2.8, h: 0.6,
      fontSize: 12, fontFace: "Arial", color: LIGHT_GRAY, align: "center", margin: 0
    });
  });

  // City examples
  s6.addText("WHAT CITIES SPEND TODAY", {
    x: 0.8, y: 3.8, w: 8.4, h: 0.4,
    fontSize: 12, fontFace: "Arial", color: GREEN, bold: true, charSpacing: 3, margin: 0
  });
  const citySpend = [
    { city: "Dallas, TX", amount: "$153M", detail: "sanitation budget / $20M+ on litter" },
    { city: "Philadelphia, PA", amount: "$48M", detail: "annual litter cleanup" },
    { city: "Texas DOT", amount: "$50M", detail: "highway litter alone" },
  ];
  citySpend.forEach((c, i) => {
    const cy = 4.3 + i * 0.4;
    s6.addText(c.city, { x: 0.8, y: cy, w: 2.0, h: 0.35, fontSize: 12, fontFace: "Arial", color: WHITE, bold: true, margin: 0 });
    s6.addText(c.amount, { x: 2.8, y: cy, w: 1.2, h: 0.35, fontSize: 12, fontFace: "Arial Black", color: GREEN, margin: 0 });
    s6.addText(c.detail, { x: 4.0, y: cy, w: 5.0, h: 0.35, fontSize: 12, fontFace: "Arial", color: LIGHT_GRAY, margin: 0 });
  });

  // ==========================================
  // SLIDE 7: REVENUE MODEL
  // ==========================================
  let s7 = pres.addSlide();
  s7.background = { color: BLACK };
  s7.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });
  s7.addText("REVENUE MODEL", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.6,
    fontSize: 14, fontFace: "Arial", color: GREEN, bold: true, charSpacing: 4, margin: 0
  });
  s7.addText("Three revenue streams. One mission.", {
    x: 0.8, y: 0.8, w: 8.4, h: 0.5,
    fontSize: 24, fontFace: "Arial", color: WHITE, bold: true, margin: 0
  });

  // Revenue stream cards
  const streams = [
    {
      pct: "70%", title: "Government Contracts",
      desc: "Monthly service agreements per zone/district.\nExisting public works budgets.\nNo new taxes required. $135K-$450K/mo per city.",
      color: GREEN
    },
    {
      pct: "20%", title: "Corporate Sponsorship",
      desc: '"Adopt-a-Zone" — local businesses sponsor\ncleanup areas. Visible in-app and on social.\n$5K-$25K/month per zone.',
      color: ORANGE
    },
    {
      pct: "10%", title: "Grants & Incentives",
      desc: "EPA, HUD block grants, workforce\ndevelopment funds. Multiple qualifying\ncategories per city.",
      color: LIME
    },
  ];
  streams.forEach((s, i) => {
    const sy = 1.6 + i * 1.25;
    s7.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: sy, w: 8.4, h: 1.05,
      fill: { color: DARK_GRAY }, shadow: makeCardShadow()
    });
    s7.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: sy, w: 0.06, h: 1.05, fill: { color: s.color } });
    s7.addText(s.pct, {
      x: 1.1, y: sy + 0.05, w: 1.2, h: 0.9,
      fontSize: 32, fontFace: "Arial Black", color: s.color, valign: "middle", margin: 0
    });
    s7.addText(s.title, {
      x: 2.5, y: sy + 0.08, w: 4, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: WHITE, bold: true, margin: 0
    });
    s7.addText(s.desc, {
      x: 2.5, y: sy + 0.42, w: 6.5, h: 0.6,
      fontSize: 11, fontFace: "Arial", color: LIGHT_GRAY, margin: 0
    });
  });

  // Bottom note
  s7.addText("At 10 cities, 5 zones each, $450K/month avg = $54M/year in revenue", {
    x: 0.8, y: 5.1, w: 8.4, h: 0.4,
    fontSize: 13, fontFace: "Arial", color: GREEN, bold: true, margin: 0
  });

  // ==========================================
  // SLIDE 8: PRICING
  // ==========================================
  let s8 = pres.addSlide();
  s8.background = { color: BLACK };
  s8.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });
  s8.addText("PRICING", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.6,
    fontSize: 14, fontFace: "Arial", color: GREEN, bold: true, charSpacing: 4, margin: 0
  });
  s8.addText("Transparent pricing. Measurable ROI.", {
    x: 0.8, y: 0.8, w: 8.4, h: 0.5,
    fontSize: 24, fontFace: "Arial", color: WHITE, bold: true, margin: 0
  });

  const tiers = [
    { name: "PILOT", price: "$135K", period: "/month", detail: "1 zone  |  2 crews  |  3-month trial", highlight: false },
    { name: "CITY STANDARD", price: "$450K", period: "/month", detail: "3-5 zones  |  6-10 crews  |  Annual", highlight: true },
    { name: "METRO SCALE", price: "Custom", period: "", detail: "10+ zones  |  20+ crews  |  Multi-year", highlight: false },
  ];
  tiers.forEach((t, i) => {
    const tx = 0.8 + i * 3.1;
    s8.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: 1.6, w: 2.8, h: 3.2,
      fill: { color: t.highlight ? "0D1A0D" : DARK_GRAY },
      line: t.highlight ? { color: GREEN, width: 2 } : undefined,
      shadow: makeCardShadow()
    });
    if (t.highlight) {
      s8.addShape(pres.shapes.RECTANGLE, { x: tx, y: 1.6, w: 2.8, h: 0.35, fill: { color: GREEN } });
      s8.addText("MOST POPULAR", {
        x: tx, y: 1.6, w: 2.8, h: 0.35,
        fontSize: 10, fontFace: "Arial", color: BLACK, bold: true, align: "center", valign: "middle", margin: 0
      });
    }
    const topOffset = t.highlight ? 0.4 : 0;
    s8.addText(t.name, {
      x: tx, y: 1.8 + topOffset, w: 2.8, h: 0.4,
      fontSize: 12, fontFace: "Arial", color: LIGHT_GRAY, bold: true, align: "center", charSpacing: 2, margin: 0
    });
    s8.addText([
      { text: t.price, options: { fontSize: 36, fontFace: "Arial Black", color: t.highlight ? GREEN : WHITE } },
      { text: t.period, options: { fontSize: 14, color: LIGHT_GRAY } }
    ], {
      x: tx, y: 2.3 + topOffset, w: 2.8, h: 0.7,
      align: "center", valign: "middle", margin: 0
    });
    s8.addText(t.detail, {
      x: tx + 0.2, y: 3.1 + topOffset, w: 2.4, h: 0.5,
      fontSize: 11, fontFace: "Arial", color: LIGHT_GRAY, align: "center", margin: 0
    });

    // Feature list
    const features = ["Real-time dashboard", "GPS crew tracking", "Before/after photos", "Monthly reports", "Citizen app access"];
    features.forEach((f, fi) => {
      s8.addText("  " + f, {
        x: tx + 0.3, y: 3.6 + topOffset + fi * 0.25, w: 2.2, h: 0.25,
        fontSize: 10, fontFace: "Arial", color: LIGHT_GRAY, bullet: true, margin: 0
      });
    });
  });

  // ==========================================
  // SLIDE 9: DALLAS CASE STUDY
  // ==========================================
  let s9 = pres.addSlide();
  s9.background = { color: BLACK };
  s9.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });
  s9.addText("CASE STUDY: DALLAS PILOT", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.6,
    fontSize: 14, fontFace: "Arial", color: GREEN, bold: true, charSpacing: 4, margin: 0
  });
  s9.addText("90-day pilot program results.", {
    x: 0.8, y: 0.8, w: 8.4, h: 0.5,
    fontSize: 24, fontFace: "Arial", color: WHITE, bold: true, margin: 0
  });

  // Big stat cards
  const pilotStats = [
    { num: "47", unit: "TONS", label: "trash removed", icon: icons.recycle },
    { num: "200+", unit: "JOBS", label: "created", icon: icons.users },
    { num: "12K", unit: "REPORTS", label: "resolved", icon: icons.check },
    { num: "94%", unit: "", label: "citizen satisfaction", icon: icons.star },
  ];
  pilotStats.forEach((ps, i) => {
    const px = 0.8 + i * 2.3;
    s9.addShape(pres.shapes.RECTANGLE, {
      x: px, y: 1.6, w: 2.05, h: 1.8,
      fill: { color: DARK_GRAY }, shadow: makeCardShadow()
    });
    s9.addText(ps.num, {
      x: px, y: 1.75, w: 2.05, h: 0.7,
      fontSize: 36, fontFace: "Arial Black", color: GREEN, align: "center", margin: 0
    });
    s9.addText(ps.unit, {
      x: px, y: 2.4, w: 2.05, h: 0.35,
      fontSize: 11, fontFace: "Arial", color: GREEN, bold: true, align: "center", charSpacing: 3, margin: 0
    });
    s9.addText(ps.label, {
      x: px, y: 2.75, w: 2.05, h: 0.35,
      fontSize: 11, fontFace: "Arial", color: LIGHT_GRAY, align: "center", margin: 0
    });
  });

  // Comparison
  s9.addText("VS. PREVIOUS APPROACH", {
    x: 0.8, y: 3.7, w: 8.4, h: 0.4,
    fontSize: 12, fontFace: "Arial", color: ORANGE, bold: true, charSpacing: 3, margin: 0
  });
  s9.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.2, w: 4.0, h: 1.1, fill: { color: "1A0A0A" } });
  s9.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.2, w: 4.0, h: 0.05, fill: { color: ORANGE } });
  s9.addText("Before Swept", { x: 0.95, y: 4.3, w: 3.7, h: 0.3, fontSize: 13, fontFace: "Arial", color: ORANGE, bold: true, margin: 0 });
  s9.addText("18 workers  |  No tracking  |  No public data\n$20M+ budget with zero accountability", {
    x: 0.95, y: 4.65, w: 3.7, h: 0.55, fontSize: 11, fontFace: "Arial", color: LIGHT_GRAY, margin: 0
  });

  s9.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 4.2, w: 4.0, h: 1.1, fill: { color: "0A1A0A" } });
  s9.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 4.2, w: 4.0, h: 0.05, fill: { color: GREEN } });
  s9.addText("With Swept", { x: 5.35, y: 4.3, w: 3.7, h: 0.3, fontSize: 13, fontFace: "Arial", color: GREEN, bold: true, margin: 0 });
  s9.addText("200+ workers  |  GPS tracked  |  Live dashboard\n34% cost savings vs. prior contractor", {
    x: 5.35, y: 4.65, w: 3.7, h: 0.55, fontSize: 11, fontFace: "Arial", color: LIGHT_GRAY, margin: 0
  });

  // ==========================================
  // SLIDE 10: GO TO MARKET
  // ==========================================
  let s10 = pres.addSlide();
  s10.background = { color: BLACK };
  s10.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });
  s10.addText("GO-TO-MARKET", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.6,
    fontSize: 14, fontFace: "Arial", color: GREEN, bold: true, charSpacing: 4, margin: 0
  });
  s10.addText("Nail one city. Then scale.", {
    x: 0.8, y: 0.8, w: 8.4, h: 0.5,
    fontSize: 24, fontFace: "Arial", color: WHITE, bold: true, margin: 0
  });

  // Timeline
  const phases = [
    { phase: "PHASE 1", title: "Dallas Pilot", detail: "1 zone, 2 crews\n90-day proof of concept\nBuild the case study", time: "Q2 2026" },
    { phase: "PHASE 2", title: "Dallas Full", detail: "5 zones, 10 crews\nFull city contract\nCorporate sponsors", time: "Q4 2026" },
    { phase: "PHASE 3", title: "Texas Expansion", detail: "Houston, Austin, SA\n3 cities in 12 months\nState-level partnerships", time: "2027" },
    { phase: "PHASE 4", title: "National Scale", detail: "Top 50 US cities\nFederal grant programs\n$18M+ ARR target", time: "2028" },
  ];
  phases.forEach((p, i) => {
    const py = 1.6 + i * 0.95;
    // Phase label
    s10.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: py, w: 1.3, h: 0.75,
      fill: { color: i === 0 ? GREEN : MID_GRAY }
    });
    s10.addText(p.phase, {
      x: 0.8, y: py, w: 1.3, h: 0.35,
      fontSize: 9, fontFace: "Arial", color: i === 0 ? BLACK : LIGHT_GRAY, bold: true, align: "center", margin: 0
    });
    s10.addText(p.time, {
      x: 0.8, y: py + 0.35, w: 1.3, h: 0.35,
      fontSize: 11, fontFace: "Arial", color: i === 0 ? BLACK : WHITE, bold: true, align: "center", margin: 0
    });
    // Content
    s10.addShape(pres.shapes.RECTANGLE, {
      x: 2.3, y: py, w: 6.9, h: 0.75,
      fill: { color: DARK_GRAY }
    });
    s10.addText(p.title, {
      x: 2.5, y: py + 0.05, w: 2.5, h: 0.65,
      fontSize: 15, fontFace: "Arial", color: WHITE, bold: true, valign: "middle", margin: 0
    });
    s10.addText(p.detail, {
      x: 5.2, y: py + 0.05, w: 3.8, h: 0.65,
      fontSize: 10, fontFace: "Arial", color: LIGHT_GRAY, valign: "middle", margin: 0
    });
  });

  // ==========================================
  // SLIDE 11: THE MOAT
  // ==========================================
  let s11 = pres.addSlide();
  s11.background = { color: BLACK };
  s11.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });
  s11.addText("COMPETITIVE MOAT", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.6,
    fontSize: 14, fontFace: "Arial", color: GREEN, bold: true, charSpacing: 4, margin: 0
  });
  s11.addText("Why competitors can't just copy this.", {
    x: 0.8, y: 0.8, w: 8.4, h: 0.5,
    fontSize: 24, fontFace: "Arial", color: WHITE, bold: true, margin: 0
  });

  const moats = [
    { title: "Data Network Effect", desc: "Every report and cleanup builds a dataset no competitor has. After one year in Dallas, we have proof of what works, where problems recur, and optimal crew routing." },
    { title: "Citizen Lock-In", desc: "Once 10,000 residents are actively reporting, that's a switching cost for the city. You can't fire the company that 10,000 voters love." },
    { title: "Brand Recognition", desc: "Neon green crews cleaning up your block. Before/after content going viral on social media. That's organic marketing no competitor can buy." },
    { title: "First Mover Advantage", desc: "Government contracts are sticky. Once Dallas works, we walk into Houston with irrefutable proof. Cities are slow to switch vendors." },
  ];
  moats.forEach((m, i) => {
    const my = 1.6 + i * 0.95;
    s11.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: my, w: 8.4, h: 0.8,
      fill: { color: DARK_GRAY }, shadow: makeCardShadow()
    });
    s11.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: my, w: 0.06, h: 0.8, fill: { color: GREEN } });
    s11.addText(m.title, {
      x: 1.1, y: my + 0.05, w: 2.5, h: 0.7,
      fontSize: 15, fontFace: "Arial", color: WHITE, bold: true, valign: "middle", margin: 0
    });
    s11.addText(m.desc, {
      x: 3.6, y: my + 0.05, w: 5.4, h: 0.7,
      fontSize: 11, fontFace: "Arial", color: LIGHT_GRAY, valign: "middle", margin: 0
    });
  });

  // ==========================================
  // SLIDE 12: CLOSING / CTA
  // ==========================================
  let s12 = pres.addSlide();
  s12.background = { color: BLACK };
  s12.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });

  s12.addText("SWEPT", {
    x: 0.8, y: 1.2, w: 8.4, h: 1.0,
    fontSize: 64, fontFace: "Arial Black", color: GREEN, bold: true, align: "center", charSpacing: 8, margin: 0
  });
  s12.addText("Clean Cities. Real Jobs. Total Accountability.", {
    x: 0.8, y: 2.2, w: 8.4, h: 0.6,
    fontSize: 22, fontFace: "Arial", color: WHITE, align: "center", margin: 0
  });
  s12.addShape(pres.shapes.RECTANGLE, { x: 4.0, y: 3.0, w: 2, h: 0.04, fill: { color: GREEN } });

  // 4 bottom stats
  const closingStats = [
    { icon: icons.dollarWhite, num: "$54M+", label: "ARR Target" },
    { icon: icons.usersWhite, num: "200+", label: "Jobs per City" },
    { icon: icons.checkWhite, num: "94%", label: "Satisfaction" },
    { icon: icons.chartWhite, num: "34%", label: "Cost Savings" },
  ];
  closingStats.forEach((cs, i) => {
    const cx = 0.8 + i * 2.3;
    s12.addText(cs.num, {
      x: cx, y: 3.4, w: 2.05, h: 0.6,
      fontSize: 28, fontFace: "Arial Black", color: GREEN, align: "center", margin: 0
    });
    s12.addText(cs.label, {
      x: cx, y: 3.95, w: 2.05, h: 0.35,
      fontSize: 11, fontFace: "Arial", color: LIGHT_GRAY, align: "center", margin: 0
    });
  });

  s12.addText("sweptcity.com", {
    x: 0.8, y: 4.6, w: 8.4, h: 0.5,
    fontSize: 20, fontFace: "Arial", color: GREEN, bold: true, align: "center", margin: 0
  });

  // Write file
  await pres.writeFile({ fileName: "/Users/trent/Desktop/Claude Code/swept/Swept_Pitch_Deck.pptx" });
  console.log("Pitch deck created successfully!");
}

buildDeck().catch(console.error);
