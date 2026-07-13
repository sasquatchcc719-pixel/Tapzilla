import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeParsePageConfig } from "@/lib/page-config/schema";

export const dynamic = "force-dynamic";

/** Serve the business vCard inline so phones open "Add Contact" instead of
 * downloading a file (the trick proven on the Sasquatch card). */
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("card_pages")
    .select("config, status")
    .eq("slug", params.slug)
    .single();

  if (!page) return new NextResponse("Not found", { status: 404 });
  const parsed = safeParsePageConfig(page.config);
  if (!parsed.success) return new NextResponse("Not found", { status: 404 });
  const b = parsed.data.business;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${b.name}`,
    `ORG:${b.name}`,
    b.phone ? `TEL;TYPE=WORK,VOICE:${b.phone}` : null,
    b.email ? `EMAIL;TYPE=WORK:${b.email}` : null,
    b.website ? `URL:${b.website}` : null,
    b.address ? `ADR;TYPE=WORK:;;${b.address};;;;` : null,
    b.coupon ? `NOTE:${b.coupon.code} — ${b.coupon.label}` : null,
    "END:VCARD",
  ].filter(Boolean);

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `inline; filename="${params.slug}.vcf"`,
    },
  });
}
