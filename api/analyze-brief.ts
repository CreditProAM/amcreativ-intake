import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { briefData } = await req.json();
    
    if (!briefData) {
      return new Response(JSON.stringify({ error: 'Brief data is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `
        Analyze this new client brief for A.M. Creativ, a strategic video marketing agency for service-based businesses and brands. The prospect has completed a detailed qualification form.

        **Phase 1: Discovery & Qualification**
        - Business Type: ${briefData.discovery.businessType}
        - Primary Challenge: ${briefData.discovery.primaryChallenge}
        - Previous Investment: ${briefData.discovery.investmentHistory}
        - Stated Urgency (Time thinking): ${briefData.discovery.urgencyTimeline}
        - Catalyst for Action: ${briefData.discovery.catalyst || 'Not specified'}
        - Self-Assessed Value of Leads: ${briefData.discovery.valueAnchor || 'Not specified'}
        - Decision Maker Status: ${briefData.deliverables.decisionMaker}
        - Other Stakeholders: ${briefData.deliverables.stakeholders || 'N/A'}

        **Phase 2: Proposed Strategy**
        - Project Type: ${briefData.strategy.projectType}
        - Main Objectives: ${briefData.strategy.objectives.join(', ')}
        - Desired Tone: ${briefData.strategy.tone.join(', ')}
        - Key Success Metric (90 days): ${briefData.contact.successMetric}

        **Phase 3: Implementation Details**
        - Desired Assets: ${briefData.deliverables.assets.join(', ')}
        - Target Channels: ${briefData.strategy.channels.join(', ')}
        - Estimated Budget: ${briefData.strategy.budget}
        - Timeline: ${briefData.strategy.timeline}
        - Current Lead Sources: ${briefData.deliverables.leadSources.join(', ') || 'Not specified'}

        **Contact Info:**
        - Name: ${briefData.contact.name}
        - Role: ${briefData.contact.role || 'Not specified'}
        - Email: ${briefData.contact.email}

        **Your Task:**
        Structure your response as a concise, actionable pre-call brief for the agency owner. Use Markdown.
        1.  **Lead Qualification Score (Hot, Warm, or Cold):** Based on their urgency, decision-maker status, and defined challenge, give a score and a one-sentence justification.
        2.  **Key Opportunity:** What is the single biggest pain point to solve? How does their desired success metric align with this?
        3.  **Strategic Angle:** Based on their Business Type and Primary Challenge, what's the best strategic angle for the sales call? (e.g., "Focus on ROI for the team lead," or "Build foundational credibility for the new venture.")
        4.  **Potential Red Flags:** Are there any mismatches (e.g., budget vs. assets, timeline vs. scope)? Is their success metric realistic?
        5.  **Conversation Starters:** Suggest 2-3 powerful, open-ended questions for the strategy call that show you've understood their brief and position you as an expert.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: text 
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Error analyzing brief:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze brief',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
