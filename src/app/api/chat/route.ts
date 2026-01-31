import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

// Initialize OpenAI only when API is called (not at build time)
function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
  });
}

function buildSystemPrompt(
  company: {
    name: string;
    chatbot_tone: string;
    show_pricing: boolean;
    require_email: boolean;
    chatbot_prompt: string;
    industries: { name: string } | null;
  },
  services: { name: string; price_min: number; price_max: number }[],
  faqs: { question: string; answer: string }[]
) {
  const servicesList = services.length
    ? services
        .map((s) => `- ${s.name}: $${s.price_min || "?"}-${s.price_max || "?"}`)
        .join("\n")
    : "- Various services available";

  const faqsList = faqs.length
    ? faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
    : "";

  return `
You are the AI assistant for ${company.name}, a ${company.industries?.name || "service"} company.

TONE: ${company.chatbot_tone || "friendly"} - Keep it conversational and warm, like talking to a helpful neighbor.

SERVICES:
${servicesList}

${faqsList ? `FAQS:\n${faqsList}` : ""}

YOUR JOB:
1. Greet warmly and ask what service they need
2. Ask about their specific situation/job details
3. ${company.show_pricing ? "Give a price estimate based on SERVICES above" : "Let them know someone will provide a personalized quote"}
4. Ask when they need this done (urgent, this week, this month, just getting quotes)
5. Collect their contact info in this order:
   - First name
   - Phone number (required)
   - Email (${company.require_email ? "required" : "optional - ask but don't push"})
   - Service address (city/zip at minimum)
6. Confirm the info and let them know someone will call soon

CRITICAL RULES:
- Keep responses SHORT (2-3 sentences max)
- Ask ONE question at a time
- Be helpful, not pushy or salesy
- Don't make up information not in SERVICES or FAQS
- When you have name + phone + service needed, you've captured the lead
- After capturing lead, thank them and mention they'll get a call soon

LEAD CAPTURE:
When you have collected: first name, phone number, and service needed - include this EXACT text at the END of your message:
[LEAD_CAPTURED]

${company.chatbot_prompt || ""}
`.trim();
}

export async function POST(request: Request) {
  try {
    const { messages, companyId, qrCodeId, sessionId, services, faqs } =
      await request.json();

    const supabase = await createClient();

    // Get company data
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("*, industries(*)")
      .eq("id", companyId)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const systemPrompt = buildSystemPrompt(
      company as {
        name: string;
        chatbot_tone: string;
        show_pricing: boolean;
        require_email: boolean;
        chatbot_prompt: string;
        industries: { name: string } | null;
      },
      services,
      faqs
    );

    // Call OpenAI
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    let assistantMessage = completion.choices[0].message.content || "";
    let leadCaptured = false;

    // Check if lead was captured
    if (assistantMessage.includes("[LEAD_CAPTURED]")) {
      leadCaptured = true;
      assistantMessage = assistantMessage.replace("[LEAD_CAPTURED]", "").trim();

      // Save conversation to database
      await supabase.from("conversations").upsert({
        company_id: companyId,
        qr_code_id: qrCodeId,
        session_id: sessionId,
        messages: [...messages, { role: "assistant", content: assistantMessage }],
        status: "completed",
        lead_captured: true,
        last_message_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      });

      // TODO: Parse conversation to extract lead details and save to leads table
      // TODO: Send notification email to company
      // TODO: Increment QR code lead count
    } else {
      // Update conversation in progress
      await supabase.from("conversations").upsert({
        company_id: companyId,
        qr_code_id: qrCodeId,
        session_id: sessionId,
        messages: [...messages, { role: "assistant", content: assistantMessage }],
        status: "active",
        lead_captured: false,
        last_message_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      message: assistantMessage,
      leadCaptured,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
