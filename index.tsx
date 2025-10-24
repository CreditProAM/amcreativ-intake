import React, { useState, useMemo, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { jsPDF } from "jspdf";

// -----------------------------
// Icons
// -----------------------------
const LeadGenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l.892-.893a1 1 0 00.042-.01l6.16-2.464a1 1 0 00.814-1.259l-1.35-5.43a1 1 0 00-.943-.745H4.29l-.305-1.222A1 1 0 003 1z" /><path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>;
const PropertyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg>;
const BrandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg>;
const SocialIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6z" /><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-1.414 1.414a1 1 0 01-1.414-1.414l1.414-1.414a1 1 0 011.414 0zM5.293 16.707a1 1 0 010-1.414l1.414-1.414a1 1 0 111.414 1.414l-1.414 1.414a1 1 0 01-1.414 0zM15 10a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0115 10zM2 10a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 012 10zM12.121 12.121a1 1 0 011.414 0l1.414 1.414a1 1 0 01-1.414 1.414l-1.414-1.414a1 1 0 010-1.414zM8.586 6.172a1 1 0 01-1.414 0L5.757 4.757a1 1 0 111.414-1.414l1.415 1.415a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;
const StrategyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true"><path fillRule="evenodd" d="M15.994 4.006a1 1 0 011.415 1.415l-1.415 1.414a1 1 0 01-1.414-1.414l1.414-1.415zM10 2a1 1 0 00-1 1v1a1 1 0 102 0V3a1 1 0 00-1-1zm-4.006 3.415a1 1 0 011.414-1.414l1.415 1.414a1 1 0 01-1.414 1.415L5.994 5.42zM4.006 15.994a1 1 0 01-1.415-1.415l1.415-1.414a1 1 0 011.414 1.414l-1.414 1.415zM17 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-5.415 4.006a1 1 0 01-1.414 1.414l-1.415-1.414a1 1 0 011.414-1.415l1.414 1.414zM5 10a1 1 0 00-1-1H3a1 1 0 100 2h1a1 1 0 001-1zm5 5a1 1 0 01-1 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" clipRule="evenodd" /><path d="M10 6a4 4 0 100 8 4 4 0 000-8z" /></svg>;

// -----------------------------
// Utilities
// -----------------------------

const normalizePhone = (s:string) => {
  const d = s.replace(/\D/g,'');
  if (!d) return "";
  if (d.length <= 10) return d.replace(/(\d{3})(\d{3})(\d{0,4})/,"($1) $2-$3").trim();
  if (d.length === 11 && d.startsWith('1')) return d.slice(1).replace(/(\d{3})(\d{3})(\d{0,4})/,"($1) $2-$3").trim();
  return `+${d}`;
};

// -----------------------------
// Schema & Initial State
// -----------------------------
const QUESTION_DEFS: Record<string, { 
    label: string; 
    required?: boolean; 
    options: (string | { label: string; icon?: React.ReactNode })[];
    placeholder?: string;
    description?: string;
}> = {
    // Step 1: Discover
    'discovery.businessType': { label: "What best describes your business?", required: true, options: ['Real Estate Agent/Broker', 'Law Firm/Attorney', 'Financial Services', 'Healthcare Practice', 'Consulting/Professional Services', 'Other Service Business'] },
    'discovery.primaryChallenge': { label: "What's your biggest marketing challenge?", required: true, options: ["Not enough visibility in my market", "Can't differentiate from competitors", "Don't know where to start with video marketing", "Inconsistent client acquisition", "Converting inquiries to retained clients", "Building trust and credibility online"] },
    'discovery.investmentHistory': { label: "Have you invested in video or content creation before?", required: true, options: ["Yes, didn't get the results I wanted", "Yes, got some results but want more", "No, this is my first time", "I've tried myself, need professional help"] },
    'discovery.valueAnchor': { label: "What would 5-10 qualified client consultations per month be worth to your business?", placeholder: "$_____ per month in additional revenue", options: [] },
    'discovery.urgencyTimeline': { label: "How long have you been thinking about investing in professional video?", required: true, options: ["Just started researching today", "A few weeks", "1-3 months", "6+ months (ready to make a decision)"] },
    'discovery.catalyst': { label: "What's driving you to explore this right now?", options: ["Slow season, need more leads", "Competitors are outpacing me", "Want to scale to next level", "Launching new service/focus area", "Just curious/exploring"] },

    // Step 2: Strategy
    'strategy.projectType': { 
        label: "What's our mission today?", 
        required: true, 
        options: [
            { label: "Short-Form Video for Leads", icon: <LeadGenIcon /> }, 
            { label: "Product/Service Showcase Video", icon: <PropertyIcon /> }, 
            { label: "Brand Story Video (About You/Your Firm)", icon: <BrandIcon /> },
            { label: "Monthly Social Media Videos", icon: <SocialIcon /> }, 
            { label: "Strategy & Consulting", icon: <StrategyIcon /> }
        ] 
    },
    'strategy.objectives': { label: "What's the main goal?", required: true, options: ["Get More Leads", "Build Trust & Credibility", "Increase Brand Awareness", "Convert Viewers to Clients"] },
    'strategy.timeline': { label: "How soon do you need this?", required: true, options: ["Urgent (Under 2 weeks)", "Within a month", "In 1-2 months", "I'm flexible"] },
    'strategy.budget': { label: "What's your estimated investment level?", required: true, options: ["<$1k", "$1-3k", "$3-5k", "$5-10k", "$10k+", "TBD"], description: "Let's discuss investment. We work with professionals at every stage:" },
    'strategy.channels': { label: "Where will this strategy be deployed?", required: true, options: ["Instagram Reels", "TikTok", "YouTube", "Facebook", "LinkedIn", "Website" ] },
    'strategy.tone': { label: "What's the strategic tone?", required: true, options: ["Clean & Minimal", "Bold & High-Energy", "Luxury & Polished", "Warm & Story-Driven"] },

    // Step 3: Deliverables
    'deliverables.assets': { label: "What strategic assets do you need?", required: true, options: ["30-Second Video", "60-Second Video", "Professional Photos", "Drone Footage", "Scripting & Voiceover", "User-Generated Style Videos", "Different Versions for Ads"] },
    'deliverables.examples': { label: "Share links to brands or videos you admire", options: [] },
    'deliverables.leadSources': { label: "Your current lead sources (check all that apply):", options: ['Referrals (but unpredictable)', 'Cold calling/door knocking', 'Social media (not consistent)', 'Paid ads (expensive)', 'Open houses', 'MLS/Zillow (high competition)', 'Networking events', 'Other'] },
    'deliverables.decisionMaker': { label: "Are you the decision maker for marketing investments?", required: true, options: ['Yes, I make the call', 'I decide with a partner/spouse', 'I need team/broker approval', 'Just exploring options for now'] },
    'deliverables.stakeholders': { label: "Who else should see this blueprint?", placeholder: "e.g., Partner's name, Manager's email", options: [] },

    // Step 4: Partnership
    'contact.name': { label: "Full Name", required: true, placeholder: "So I know what to call you...", options: [] },
    'contact.email': { label: "Best Email", required: true, placeholder: "No spam, pinky swear.", options: [] },
    'contact.phone': { label: "Your phone (optional - for faster strategy call scheduling)", options: [] },
    'contact.role': { label: "Your Role (e.g., Owner, Manager)", options: [] },
    'contact.successMetric': { 
        label: "Beyond vanity metrics, what's our #1 strategic goal in 90 days?", 
        description: "This isn't about gaming algorithms. Think about a strategic win. What outcome moves your brand from invisible to unforgettable?",
        placeholder: "e.g., 'Become the go-to expert for my niche in my local area'",
        required: true,
        options: []
    },
};

const STRATEGIC_RECOMMENDATIONS: Record<string, { deliverables: string[], channels: string[] }> = {
    "Get More Leads": { deliverables: ["30-Second Video", "Different Versions for Ads", "User-Generated Style Videos"], channels: ["Instagram Reels", "TikTok", "Facebook"] },
    "Build Trust & Credibility": { deliverables: ["60-Second Video", "Scripting & Voiceover"], channels: ["Website", "LinkedIn", "YouTube"] },
    "Increase Brand Awareness": { deliverables: ["Drone Footage", "User-Generated Style Videos"], channels: ["TikTok", "Instagram Reels"] },
    "Convert Viewers to Clients": { deliverables: ["60-Second Video", "Professional Photos", "Scripting & Voiceover"], channels: ["Website", "YouTube", "Facebook"] }
};

const BUDGET_TIPS: Record<string, string> = {
    "<$1k": "Ideal for a focused strategy call or a single, simple creative asset.",
    "$1-3k": "Perfect for a core brand video or a small batch of high-impact social content.",
    "$3-5k": "Enables a polished brand story or a multi-asset social media campaign.",
    "$5-10k": "For comprehensive projects, brand films, or strategic monthly retainers.",
    "$10k+": "For major campaigns, long-term growth partnerships, and significant ad strategies.",
    "TBD": "No problem. We'll define the investment based on the strategy we build together.",
};

const DYNAMIC_TIPS: Record<string, Record<string, string>> = {
    'discovery.businessType': { 
        'Solo Service Provider (e.g., consultant, agent)': "Tip: 73% of clients are more likely to hire professionals who use video.", 
        'Small Business / Team (2-10 people)': "Tip: Top teams produce 4-6 strategic videos/month for a consistent client pipeline.", 
        'Startup / New Venture': "Tip: Video helps new ventures compete by building instant credibility." 
    },
    'discovery.primaryChallenge': { 
        "Can't stand out from competitors": "Opportunity: In many industries, less than 40% of businesses use video consistentlyâ€”this is your advantage.", 
        "Inconsistent lead flow": "Fact: Our clients see 3-5x more consistent inbound leads within 60 days." 
    },
    'discovery.investmentHistory': { 
        "Yes, didn't get the results I wanted": "Insight: Most video efforts fail not because of quality, but because there's no strategic framework behind them. Let's fix that.", 
        "I've tried myself, need professional help": "Smart move. Your time is worth $200-500/hr. Spend it closing deals." 
    },
    'discovery.urgencyTimeline': { 
        '6+ months (ready to make a decision)': "Urgency Alert: Every month without strategic visibility means potential clients lost to competitors who ARE showing up consistently." 
    }
};

const STEPS = [
  { id: "discovery", name: "1. Discover" },
  { id: "strategy", name: "2. Strategy" },
  { id: "deliverables", name: "3. Details" },
  { id: "contact", name: "4. Contact" },
  { id: "review", name: "5. Blueprint" },
] as const;

type StepID = typeof STEPS[number]["id"];

const initialData = {
  discovery: { businessType: "", primaryChallenge: "", investmentHistory: "", valueAnchor: "", urgencyTimeline: "", catalyst: "" },
  strategy: { projectType: "", objectives: [] as string[], channels: [] as string[], tone: [] as string[], timeline: "", budget: "TBD" },
  deliverables: { assets: [] as string[], examples: "", leadSources: [] as string[], decisionMaker: "", stakeholders: "" },
  contact: { name: "", email: "", phone: "", role: "", successMetric: "" },
};
type Data = typeof initialData;

const LS_KEY = "amcreativ_brief_v5";

// -----------------------------
// Main App Component
// -----------------------------
const App = () => {
  const [data, setData] = useState<Data>(initialData);
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [hp, setHp] = useState(""); // Honeypot state
  const [activeTip, setActiveTip] = useState<{group: string, text: string} | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const step = STEPS[stepIndex];

  useEffect(() => {
      let restored: Partial<Data> = {};
      try {
          const raw = localStorage.getItem(LS_KEY);
          if (raw) restored = JSON.parse(raw);
      } catch {}

      const q = new URLSearchParams(window.location.search);
      const prefill: any = {
          contact: { name: q.get("name"), email: q.get("email"), phone: q.get("phone") ? normalizePhone(q.get("phone")!) : undefined, },
          strategy: { projectType: q.get("type"), },
      };
      
      // Cleanup undefined values
      Object.keys(prefill).forEach(key => {
        Object.keys(prefill[key]).forEach(field => {
            if (prefill[key][field] === null || prefill[key][field] === undefined) {
                delete prefill[key][field];
            }
        });
        if (Object.keys(prefill[key]).length === 0) {
            delete prefill[key];
        }
    });

      if (Object.keys(restored).length > 0 || Object.keys(prefill).length > 0) {
        setData(current => {
            let merged = JSON.parse(JSON.stringify(current));
            const updates = [restored, prefill];
            for (const update of updates) {
                if (!update) continue;
                for (const key of Object.keys(update)) {
                    if (update[key] && typeof update[key] === 'object' && !Array.isArray(update[key])) {
                        merged[key] = { ...merged[key], ...update[key] };
                    } else if (update[key] !== undefined) {
                        merged[key] = update[key];
                    }
                }
            }
            return merged;
        });
      }
  }, []);
  
  useEffect(() => {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (sectionRef.current) {
        sectionRef.current.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [stepIndex]);

  const set = (path: string, value: any) => {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let cur = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const toggleIn = (path: string, value: string) => {
      setData(prev => {
          const keys = path.split('.');
          const arr: string[] = (keys.reduce((acc, key) => acc?.[key], prev as any) as string[]) || [];
          const exists = arr.includes(value);
          
          let nextData = JSON.parse(JSON.stringify(prev));
          let parent = nextData;
          for (let i = 0; i < keys.length - 1; i++) { parent = parent[keys[i]]; }
          
          parent[keys[keys.length - 1]] = exists ? arr.filter((v: any) => v !== value) : [...arr, value];

          if (path === 'strategy.objectives') {
              const recommendations = STRATEGIC_RECOMMENDATIONS[value];
              if (recommendations && !exists) {
                  const currentDeliverables = new Set(nextData.deliverables.assets);
                  const currentChannels = new Set(nextData.strategy.channels);
                  recommendations.deliverables.forEach(d => currentDeliverables.add(d));
                  recommendations.channels.forEach(c => currentChannels.add(c));
                  nextData.deliverables.assets = Array.from(currentDeliverables);
                  nextData.strategy.channels = Array.from(currentChannels);
              }
          }
          return nextData;
      });
  };

  const handleChipToggle = (path: string, value: string, isSingle?: boolean) => {
    if (isSingle) {
        const currentVal = path.split('.').reduce((acc, key) => acc[key], data as any);
        set(path, currentVal === value ? "" : value);
    } else {
        toggleIn(path, value);
    }
    const tips = DYNAMIC_TIPS[path];
    if (tips && tips[value]) {
        setActiveTip({ group: path, text: tips[value] });
    } else if (activeTip && activeTip.group === path) {
        setActiveTip(null);
    }
  };
  
  const canNext = useMemo(() => validate(step.id, data).ok, [step.id, data]);
  const next = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));
  
  const handleSubmit = async () => {
    if (loading || !validate('review', data).ok || hp) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ briefData: data }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setResponse(result.analysis);
        setIsSubmitted(true);
        localStorage.removeItem(LS_KEY);
      } else {
        throw new Error(result.error || 'Failed to analyze brief');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while analyzing your brief. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;

    const addTextWithWrap = (text: string, options: { isBold?: boolean, fontSize?: number, xOffset?: number, color?: number | [number, number, number] } = {}) => {
        if (y > 270) { doc.addPage(); y = 20; }
        const { isBold = false, fontSize = 11, xOffset = 0, color = 0 } = options;
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        if (Array.isArray(color)) {
            doc.setTextColor(color[0], color[1], color[2]);
        } else {
            doc.setTextColor(color);
        }
        const lines: string[] = doc.splitTextToSize(text, contentWidth - xOffset);
        doc.text(lines, margin + xOffset, y);
        y += (lines.length * (fontSize * 0.35)) + 3;
    };

    addTextWithWrap("A.M Creativ Strategic Blueprint", { isBold: true, fontSize: 22 });
    y -= 5;
    addTextWithWrap(`Prepared for: ${data.contact.name}`, { fontSize: 14, color: 100 });
    y += 10;
    addTextWithWrap("Preliminary Strategic Analysis", { isBold: true, fontSize: 16 });
    doc.setDrawColor(220);
    doc.line(margin, y - 2, pageWidth - margin, y - 2);
    y += 6;

    const analysisLines = response.replace(/---/g, '').trim().split('\n');
    analysisLines.forEach(line => {
        if (line.trim() === '') { y += 4; return; }
        const trimmedLine = line.trim();
        if (/^\d+\..*\*\*$/.test(trimmedLine) || /^\d+\.\s.*:/.test(trimmedLine)) {
            addTextWithWrap(trimmedLine.replace(/\*\*/g, ''), { isBold: true, fontSize: 12 });
        } else if (trimmedLine.startsWith('* **')) {
            addTextWithWrap(`â€¢ ${trimmedLine.substring(2).replace(/\*\*/g, '')}`, { fontSize: 11, xOffset: 5 });
        } else {
            addTextWithWrap(trimmedLine.replace(/\*\*/g, ''), { fontSize: 11 });
        }
    });
    y += 10;

    addTextWithWrap("Your Submitted Blueprint Details", { isBold: true, fontSize: 16 });
    doc.setDrawColor(220);
    doc.line(margin, y - 2, pageWidth - margin, y - 2);
    y += 8;

    const sections = [
        { title: "Discovery", step: "discovery", data: data.discovery },
        { title: "Strategy", step: "strategy", data: data.strategy },
        { title: "Details", step: "deliverables", data: data.deliverables },
        { title: "Partnership", step: "contact", data: data.contact },
    ];
    
    sections.forEach(section => {
        if (y > 250) { doc.addPage(); y = 20; }
        addTextWithWrap(section.title, { isBold: true, fontSize: 14 });
        Object.keys(section.data).forEach(key => {
            const path = `${section.step}.${key}`;
            const value = section.data[key as keyof typeof section.data];
            const def = QUESTION_DEFS[path];
            if (!def || !value || (Array.isArray(value) && value.length === 0)) return;
            const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
            addTextWithWrap(`${def.label}: ${displayValue}`, {fontSize: 11});
        });
        y += 5;
    });

    doc.save(`AM-Creativ-Blueprint-${data.contact.name.replace(/\s/g, '_')}.pdf`);
  };

  const recommendedDeliverables = useMemo(() => {
    const recs = new Set<string>();
    data.strategy.objectives.forEach(obj => STRATEGIC_RECOMMENDATIONS[obj]?.deliverables.forEach(d => recs.add(d)));
    return recs;
  }, [data.strategy.objectives]);

  const recommendedChannels = useMemo(() => {
    const recs = new Set<string>();
    data.strategy.objectives.forEach(obj => STRATEGIC_RECOMMENDATIONS[obj]?.channels.forEach(c => recs.add(c)));
    return recs;
  }, [data.strategy.objectives]);

  if (loading) return <div className="status-container"><div className="loader"></div><p>Analyzing Your Blueprint...</p></div>;
  if (error) return <div className="status-container"><div className="icon">âš ï¸</div><h2>Error</h2><p>{error}</p></div>;

  if (isSubmitted) return (
      <div className="status-container">
          <div className="icon">âœ“</div>
          <h2>Your Blueprint is Being Prepared</h2>
          <p>Thank you. I'll personally review this blueprint and reach out to schedule our strategy call. Here is your preliminary analysis, and you can download the full document for your records.</p>
          <div className="review-box response-box"><MarkdownRenderer content={response} /></div>
          <button onClick={handleDownloadPdf} className="download-btn">Download Your Blueprint (PDF)</button>
      </div>
  );
  
  const isExploring = data.deliverables.decisionMaker === "Just exploring options for now";
  const finalButtonText = isExploring ? "Get Free Strategy Guide" : "Claim My Personalized Blueprint";

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-text">A.M Creativ</div>
      </header>
      <div className="header-text">
        <h1>Helping Brands Grow with Purpose</h1>
        <p>From Invisible → Unforgettable</p>
      </div>
      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
        <input type="text" name="b_name" tabIndex={-1} value={hp} onChange={(e) => setHp(e.target.value)} autoComplete="off" />
      </div>
      <Progress steps={STEPS} active={stepIndex} onNavigate={(i) => { if(i < stepIndex) setStepIndex(i) }} />
      <div className="wizard-container">
        {step.id === 'discovery' && (
            <section key={step.id} ref={sectionRef} tabIndex={-1} className="wizard-section">
                <h2>Phase 1: Discover the Opportunity</h2><p className="subtitle">Let's diagnose your current situation and identify the exact opportunity for growth.</p>
                <div className="fields-grid">
                    <Card title={QUESTION_DEFS['discovery.businessType'].label} required><ChipGroup options={QUESTION_DEFS['discovery.businessType'].options} value={[data.discovery.businessType]} onToggle={(v) => handleChipToggle('discovery.businessType', v, true)} /></Card>
                    <Card title={QUESTION_DEFS['discovery.primaryChallenge'].label} required>
                        <ChipGroup options={QUESTION_DEFS['discovery.primaryChallenge'].options} value={[data.discovery.primaryChallenge]} onToggle={(v) => handleChipToggle('discovery.primaryChallenge', v, true)} />
        <p className="micro-testimonial">
          <span className="stars">★★★★★</span>
          <span className="quote">"Our business went from 3-4 consultations per month to 15+ qualified leads. The professional video content has transformed our client acquisition."</span>
          <span className="author">- Michael R., Real Estate Broker</span>
        </p>
                    </Card>
                    <Card title={QUESTION_DEFS['discovery.investmentHistory'].label} required><ChipGroup options={QUESTION_DEFS['discovery.investmentHistory'].options} value={[data.discovery.investmentHistory]} onToggle={(v) => handleChipToggle('discovery.investmentHistory', v, true)} /></Card>
                    <Card title={QUESTION_DEFS['discovery.urgencyTimeline'].label} required><ChipGroup options={QUESTION_DEFS['discovery.urgencyTimeline'].options} value={[data.discovery.urgencyTimeline]} onToggle={(v) => handleChipToggle('discovery.urgencyTimeline', v, true)} /></Card>
                    <Card title={QUESTION_DEFS['discovery.catalyst'].label}><ChipGroup options={QUESTION_DEFS['discovery.catalyst'].options} value={[data.discovery.catalyst]} onToggle={(v) => set('discovery.catalyst', v)} single /></Card>
                    <Card title={QUESTION_DEFS['discovery.valueAnchor'].label}><TextInput placeholder={QUESTION_DEFS['discovery.valueAnchor'].placeholder} value={data.discovery.valueAnchor} onChange={(e) => set("discovery.valueAnchor", e.target.value)} /></Card>
                </div>
            </section>
        )}
        {step.id === 'strategy' && (
             <section key={step.id} ref={sectionRef} tabIndex={-1} className="wizard-section">
                <h2>Phase 2: Define the Strategy</h2><p className="subtitle">Now we'll craft the creative strategy that will convert viewers to clients.</p>
                <div className="fields-grid md-grid-cols-2">
                    <Card title={QUESTION_DEFS['strategy.projectType'].label} required><ChipGroup options={QUESTION_DEFS['strategy.projectType'].options} value={[data.strategy.projectType]} onToggle={(v) => set("strategy.projectType", v)} single /></Card>
                    <Card title={QUESTION_DEFS['strategy.objectives'].label} required><ChipGroup options={QUESTION_DEFS['strategy.objectives'].options} value={data.strategy.objectives} onToggle={(v) => toggleIn("strategy.objectives", v)} /></Card>
                    <Card title={QUESTION_DEFS['strategy.timeline'].label} required><ChipGroup options={QUESTION_DEFS['strategy.timeline'].options} value={[data.strategy.timeline]} onToggle={(v) => set("strategy.timeline", v)} single /></Card>
                    <Card title={QUESTION_DEFS['strategy.budget'].label} required>
                      {QUESTION_DEFS['strategy.budget'].description && <p className="field-description">{QUESTION_DEFS['strategy.budget'].description}</p>}
                      <ChipGroup options={QUESTION_DEFS['strategy.budget'].options} value={[data.strategy.budget]} onToggle={(v) => set("strategy.budget", v)} single />
                      {data.strategy.budget && BUDGET_TIPS[data.strategy.budget] && <p className="budget-tip">{BUDGET_TIPS[data.strategy.budget]}</p>}
                    </Card>
                    <Card title={QUESTION_DEFS['strategy.channels'].label} required className="md-col-span-2"><ChipGroup options={QUESTION_DEFS['strategy.channels'].options} value={data.strategy.channels} onToggle={(v) => toggleIn("strategy.channels", v)} recommendations={recommendedChannels} /></Card>
                    <Card title={QUESTION_DEFS['strategy.tone'].label} required className="md-col-span-2"><ChipGroup options={QUESTION_DEFS['strategy.tone'].options} value={data.strategy.tone} onToggle={(v) => toggleIn("strategy.tone", v)} /></Card>
                    <p className="social-proof md-col-span-2">🎯 Professional video content generates 3-5x more qualified leads than traditional marketing for service-based businesses.</p>
                </div>
            </section>
        )}
        {step.id === "deliverables" && (
            <section key={step.id} ref={sectionRef} tabIndex={-1} className="wizard-section">
                <h2>Phase 3: Craft the Details</h2><p className="subtitle">Let's get into the specifics of your project and business.</p>
                <div className="fields-grid">
                    <Card title={QUESTION_DEFS['deliverables.assets'].label} required className="md-col-span-2"><ChipGroup options={QUESTION_DEFS['deliverables.assets'].options} value={data.deliverables.assets} onToggle={(v) => toggleIn("deliverables.assets", v)} recommendations={recommendedDeliverables} /></Card>
                    <Card title={QUESTION_DEFS['deliverables.examples'].label}><TextArea placeholder="https://instagram.com/..., https://tiktok.com/..." value={data.deliverables.examples} onChange={(e) => set("deliverables.examples", e.target.value)} /></Card>
                    <Card title={QUESTION_DEFS['deliverables.leadSources'].label}><ChipGroup options={QUESTION_DEFS['deliverables.leadSources'].options} value={data.deliverables.leadSources} onToggle={(v) => toggleIn("deliverables.leadSources", v)} /></Card>
                    <Card title={QUESTION_DEFS['deliverables.decisionMaker'].label} required><ChipGroup options={QUESTION_DEFS['deliverables.decisionMaker'].options} value={[data.deliverables.decisionMaker]} onToggle={(v) => set("deliverables.decisionMaker", v)} single /></Card>
                    {data.deliverables.decisionMaker === 'I need team/broker approval' && (
                        <Card title={QUESTION_DEFS['deliverables.stakeholders'].label}><TextInput placeholder={QUESTION_DEFS['deliverables.stakeholders'].placeholder} value={data.deliverables.stakeholders} onChange={(e) => set("deliverables.stakeholders", e.target.value)} /></Card>
                    )}
                     <p className="social-proof md-col-span-2">🏆 Trusted by 50+ brands and professionals in South Florida.</p>
                </div>
            </section>
        )}
        {step.id === "contact" && (
            <section key={step.id} ref={sectionRef} tabIndex={-1} className="wizard-section">
                <h2>Phase 4: From Invisible to Unforgettable</h2><p className="subtitle">This is where we formalize your path to market dominance. Let's get your contact details so I can finalize your blueprint.</p>
                <ReciprocityPreview data={data} />
                <div className="fields-grid md-grid-cols-2">
                    <Field title={QUESTION_DEFS['contact.name'].label} required><TextInput placeholder={QUESTION_DEFS['contact.name'].placeholder} value={data.contact.name} onChange={(e) => set("contact.name", e.target.value)} /></Field>
                    <Field title={QUESTION_DEFS['contact.email'].label} required><TextInput type="email" placeholder={QUESTION_DEFS['contact.email'].placeholder} value={data.contact.email} onChange={(e) => set("contact.email", e.target.value)} /></Field>
                    <Field title={QUESTION_DEFS['contact.phone'].label}><TextInput placeholder="(305) ..." value={data.contact.phone} onChange={(e) => set("contact.phone", normalizePhone(e.target.value))} /></Field>
                    <Field title={QUESTION_DEFS['contact.role'].label}><TextInput placeholder="Agent / Broker / Owner" value={data.contact.role} onChange={(e) => set("contact.role", e.target.value)} /></Field>
                    <Card title={QUESTION_DEFS['contact.successMetric'].label} required className="md-col-span-2">
                        {QUESTION_DEFS['contact.successMetric'].description && <p className="field-description">{QUESTION_DEFS['contact.successMetric'].description}</p>}
                        <TextArea placeholder={QUESTION_DEFS['contact.successMetric'].placeholder} value={data.contact.successMetric} onChange={(e) => set("contact.successMetric", e.target.value)} />
                    </Card>
                </div>
            </section>
        )}
        {step.id === "review" && (
            <section key={step.id} ref={sectionRef} tabIndex={-1} className="wizard-section">
                <h2>Review Your Path to Dominance</h2><p className="subtitle">One final look at the blueprint we've co-created. When you're ready, claim your personalized analysis.</p>
                <ReviewSummary data={data} onEdit={(stepId) => { const index = STEPS.findIndex(s => s.id === stepId); if (index !== -1) setStepIndex(index); }} />
            </section>
        )}
        <FooterNav stepIndex={stepIndex} onBack={back} onNext={stepIndex === STEPS.length - 1 ? handleSubmit : next} canNext={canNext} nextText={isLastStep(stepIndex) ? finalButtonText : "Next"} />
      </div>
      {activeTip && <p className="dynamic-tip">{activeTip.text}</p>}
      <p className="footer">Â© {new Date().getFullYear()} A.M Creativ â€” From Invisible to Unforgettable</p>
    </div>
  );
}

// -----------------------------
// Validation
// -----------------------------
function validate(stepId: StepID, data: Data) {
  const errors: string[] = [];
  const req = (ok: any, msg: string) => { if (!ok || (typeof ok === 'string' && !ok.trim())) errors.push(msg); };
  const reqArr = (arr: any[], msg: string) => { if (arr.length === 0) errors.push(msg); };

  switch(stepId) {
    case "discovery":
      req(data.discovery.businessType, "Select your business type");
      req(data.discovery.primaryChallenge, "Select your primary challenge");
      req(data.discovery.investmentHistory, "Select your investment history");
      req(data.discovery.urgencyTimeline, "Select your urgency");
      break;
    case "strategy":
      req(data.strategy.projectType, "Select a project type");
      reqArr(data.strategy.objectives, "Pick at least one objective");
      req(data.strategy.timeline, "Choose a timeline");
      req(data.strategy.budget, "Choose a budget");
      reqArr(data.strategy.channels, "Pick at least one channel");
      reqArr(data.strategy.tone, "Pick at least one creative tone");
      break;
    case "deliverables":
      reqArr(data.deliverables.assets, "Pick at least one asset");
      req(data.deliverables.decisionMaker, "Select decision maker status");
      break;
    case "contact":
      req(data.contact.name, "Name is required");
      req(/.+@.+\..+/.test(data.contact.email), "Valid email is required");
      req(data.contact.successMetric, "Define your #1 desired outcome");
      break;
    case "review":
      const allValid = ['discovery', 'strategy', 'deliverables', 'contact'].every(id => validate(id as StepID, data).ok);
      return { ok: allValid, errors: allValid ? [] : ['Please complete all required fields.']};
  }
  return { ok: errors.length === 0, errors };
}

const isLastStep = (index: number) => index === STEPS.length - 1;

// -----------------------------
// Layout Components
// -----------------------------
const MarkdownRenderer = ({ content }: { content: string }) => {
    const sanitizedContent = content.replace(/---/g, '').trim();
    const lines = sanitizedContent.split('\n');
    return (
        <div>
            {lines.map((line, index) => {
                if (line.trim() === '') return <br key={index} />;
                const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
                return (
                    <p key={index}>
                        {parts.map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.substring(2, part.length - 2)}</strong>;
                            if (part.startsWith('* ')) return <span key={i}><br/>&bull; {part.substring(2)}</span>
                            return part;
                        })}
                    </p>
                );
            })}
        </div>
    );
};

const ReciprocityPreview = ({ data }: { data: Data }) => {
    const getFirst = (arr: string[]) => arr.length > 0 ? arr[0] : 'To be determined';
    return (
        <div className="reciprocity-preview">
            <h3>Your Instant Strategy Snapshot</h3>
            <p className="field-description">Based on your answers, here's the initial strategic direction we're seeing:</p>
            <ul>
                <li><strong>Your #1 Opportunity:</strong> <span>{data.discovery.primaryChallenge || 'To be determined'}</span></li>
                <li><strong>Recommended Video Type:</strong> <span>{data.strategy.projectType || 'To be determined'}</span></li>
                <li><strong>Best Channels for You:</strong> <span>{getFirst(data.strategy.channels)}</span></li>
                <li><strong>Investment Range:</strong> <span>{data.strategy.budget}</span></li>
            </ul>
        </div>
    );
};

const ReviewSummary = ({ data, onEdit }: { data: Data; onEdit: (step: StepID) => void }) => {
    const renderValue = (value: any) => {
        if (Array.isArray(value) && value.length > 0) {
            return (
                <div className="review-value-list">
                    {value.map((item: string) => <span key={item} className="review-value-item">{item}</span>)}
                </div>
            );
        }
        if (typeof value === 'string' && value.trim() !== '') return value;
        return <span className="review-value-empty">Not specified</span>;
    };

    const sections = [
        { title: "Discovery", step: "discovery" as StepID, data: data.discovery },
        { title: "Strategy", step: "strategy" as StepID, data: data.strategy },
        { title: "Details", step: "deliverables" as StepID, data: data.deliverables },
        { title: "Partnership", step: "contact" as StepID, data: data.contact },
    ];

    return (
        <div className="review-summary">
            {sections.map(section => (
                <div key={section.step} className="review-section">
                    <div className="review-section-header">
                        <h3>{section.title}</h3>
                        <button className="edit-btn" onClick={() => onEdit(section.step)}>Edit</button>
                    </div>
                    <ul>
                        {/* FIX: Use Object.entries to safely iterate over section data. This correctly infers `value` as `string | string[]` and allows the `Array.isArray` type guard to work, preventing a "property 'length' does not exist on type 'never'" error. */}
                        {Object.entries(section.data).map(([key, value]) => {
                            const path = `${section.step}.${key}`;
                            const def = QUESTION_DEFS[path];
                            if (!def || !value || (Array.isArray(value) && value.length === 0)) return null;
                            return (
                                <li key={path}>
                                    <span className="review-label">{def.label}</span>
                                    <span className="review-value">{renderValue(value)}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
};


const Progress = ({ steps, active, onNavigate }: { steps: readonly { id: string; name: string }[]; active: number; onNavigate: (index: number) => void; }) => {
    const progressPercentage = active > 0 ? (active / (steps.length - 1)) * 100 : 0;
    return (
        <ol className="progress-bar">
            <div className="progress-bar-line progress-bar-track" />
            <div className="progress-bar-line progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
            {steps.map((s, i) => {
                const isDone = i < active;
                const isActive = i === active;
                return (
                    <li key={s.id} className={`progress-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`} onClick={() => isDone && onNavigate(i)} aria-current={isActive ? 'step' : undefined}>
                        <div className="progress-step-circle"></div>
                        <span className="progress-step-name">{s.name}</span>
                    </li>
                );
            })}
        </ol>
    );
};

// FIX: Update component prop types to use React.PropsWithChildren for better type safety and to resolve "missing children" errors.
const Card = ({ title, required, className, children }: React.PropsWithChildren<{ title: string; required?: boolean; className?: string; }>) => (
    <div className={`card ${className || ''}`}>
        <FieldLabel required={required}>{title}</FieldLabel>
        {children}
    </div>
);

// FIX: Update component prop types to use React.PropsWithChildren for better type safety and to resolve "missing children" errors.
const Field = ({ title, required, children }: React.PropsWithChildren<{ title: string; required?: boolean; }>) => (
    <div className="field">
        <FieldLabel required={required}>{title}</FieldLabel>
        {children}
    </div>
);

// FIX: Update component prop types to use React.PropsWithChildren for better type safety and to resolve "missing children" errors.
const FieldLabel = ({ children, required }: React.PropsWithChildren<{ required?: boolean }>) => (
    <label className="field-label">{children}{required && <span className="required-star"> *</span>}</label>
);

const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className="text-input" />;
const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} className="text-area" />;

const ChipGroup = ({ options, value, onToggle, single, recommendations }: { options: (string | { label: string; icon?: React.ReactNode })[]; value: string[]; onToggle: (v: string) => void; single?: boolean; recommendations?: Set<string> }) => (
    <div className="chip-group">
        {options.map((opt) => {
            const label = typeof opt === 'string' ? opt : opt.label;
            const icon = typeof opt === 'string' ? null : opt.icon;
            const isSelected = value.includes(label);
            const isRecommended = recommendations?.has(label) && !isSelected;
            return (
                <button type="button" key={label} className={`chip ${isSelected ? 'selected' : ''} ${isRecommended ? 'recommended' : ''}`} onClick={() => onToggle(single ? (isSelected ? "" : label) : label)}>
                    {isRecommended && <span className="chip-recommend-badge">Recommended</span>}
                    {icon && <span className="chip-icon">{icon}</span>}
                    {label}
                </button>
            )
        })}
    </div>
);

const FooterNav = ({ stepIndex, onBack, onNext, canNext, nextText }: { stepIndex: number; onBack: () => void; onNext: () => void; canNext: boolean; nextText: string; }) => {
    const isFirst = stepIndex === 0;
    return (
        <div className="footer-nav">
            <button onClick={onBack} disabled={isFirst} className="nav-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
                <span>Back</span>
            </button>
            <button onClick={onNext} disabled={!canNext} className="nav-btn primary">
                <span>{nextText}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
            </button>
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
