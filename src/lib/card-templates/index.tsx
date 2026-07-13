/**
 * Physical card artwork templates — CR80 (3.375" × 2.125"), the hotel-key
 * format proven at Sasquatch. Slot-based and deterministic: slots physically
 * cannot leave the safe area, so every render is print-safe by construction.
 *
 * Same components render the builder preview (browser) and the print files
 * (server → SVG/PNG at 300 DPI), so what you see is literally what prints.
 */

export const CARD = {
  // 300 DPI pixel space
  W: 1013, // 3.375in
  H: 638, // 2.125in
  BLEED: 38, // 0.125in on each side (print files add this)
  SAFE: 57, // 0.19in inset — keep content inside
};

export type CardSlots = {
  name: string;
  tagline?: string;
  phone?: string;
  logoUrl?: string;
  couponCode?: string;
  couponLabel?: string;
  primary: string; // hex
  accent: string; // hex
  /** Pre-rendered QR path data (via lib/card-templates/qr) + its viewport size */
  qr?: { path: string; size: number };
  siteHost?: string; // printed under the QR
};

export type CardTemplateId = "voltage" | "clean" | "bold";

export const CARD_TEMPLATES: { id: CardTemplateId; name: string; blurb: string }[] = [
  { id: "voltage", name: "Voltage", blurb: "Dark + electric — the Tapzilla look" },
  { id: "clean", name: "Clean", blurb: "White, sharp, professional" },
  { id: "bold", name: "Bold", blurb: "Your color, full bleed, huge name" },
];

/* Shared bits ------------------------------------------------------------ */

function NfcMark({ x, y, color, scale = 1 }: { x: number; y: number; color: string; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="none" stroke={color} strokeLinecap="round">
      <path d="M22 44a22 22 0 0 1 0-28" strokeWidth="7" />
      <path d="M10 56a38 38 0 0 1 0-52" strokeWidth="7" opacity="0.65" />
      <circle cx="34" cy="30" r="6" fill={color} stroke="none" />
    </g>
  );
}

function QrBlock({
  slots,
  x,
  y,
  size,
  dark,
  light,
}: {
  slots: CardSlots;
  x: number;
  y: number;
  size: number;
  dark: string;
  light: string;
}) {
  if (!slots.qr) return null;
  const s = size / slots.qr.size;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-10} y={-10} width={size + 20} height={size + 20} rx={12} fill={light} />
      <g transform={`scale(${s})`}>
        <path d={slots.qr.path} fill={dark} />
      </g>
    </g>
  );
}

const FD = "'Unbounded','Arial Black',sans-serif"; // display
const FB = "'Arial','Helvetica',sans-serif"; // body fallback (print-safe)

function fit(text: string, max: number, base: number): number {
  // crude but reliable auto-shrink for long business names
  return text.length <= max ? base : Math.max(Math.floor((base * max) / text.length), Math.floor(base * 0.55));
}

/* ── VOLTAGE ─────────────────────────────────────────────────────────── */

function VoltageFront({ s }: { s: CardSlots }) {
  const nameSize = fit(s.name, 16, 88);
  return (
    <>
      <rect width={CARD.W} height={CARD.H} fill="#0a0d0d" />
      {/* circuit corner traces */}
      <g stroke={s.primary} strokeWidth="3" opacity="0.35" fill="none">
        <path d={`M0 ${CARD.H - 90} H140 L190 ${CARD.H - 140} H320`} />
        <path d={`M${CARD.W} 80 H${CARD.W - 170} L${CARD.W - 220} 130 H${CARD.W - 380}`} />
        <circle cx="320" cy={CARD.H - 140} r="7" fill={s.primary} stroke="none" />
        <circle cx={CARD.W - 380} cy="130" r="7" fill={s.primary} stroke="none" />
      </g>
      <text x={CARD.SAFE} y={225} fontFamily={FD} fontWeight="700" fontSize={nameSize} fill="#ffffff">
        {s.name}
      </text>
      {s.tagline ? (
        <text x={CARD.SAFE} y={285} fontFamily={FB} fontSize="30" fill="#ffffffaa">
          {s.tagline}
        </text>
      ) : null}
      {s.phone ? (
        <text x={CARD.SAFE} y={CARD.H - 120} fontFamily={FD} fontWeight="600" fontSize="54" fill={s.primary}>
          {s.phone}
        </text>
      ) : null}
      <text x={CARD.SAFE} y={CARD.H - CARD.SAFE} fontFamily={FB} fontWeight="700" fontSize="26" letterSpacing="6" fill={s.accent}>
        TAP PHONE TO CARD
      </text>
      <NfcMark x={CARD.W - 150} y={CARD.H - 170} color={s.accent} scale={1.6} />
    </>
  );
}

function VoltageBack({ s }: { s: CardSlots }) {
  return (
    <>
      <rect width={CARD.W} height={CARD.H} fill="#0a0d0d" />
      <rect x="0" y="0" width={CARD.W} height="16" fill={s.primary} />
      <rect x="0" y={CARD.H - 16} width={CARD.W} height="16" fill={s.accent} />
      {s.couponCode ? (
        <>
          <text x={CARD.SAFE} y={170} fontFamily={FB} fontWeight="700" fontSize="30" letterSpacing="5" fill="#ffffff88">
            EXCLUSIVE TAP DEAL
          </text>
          <rect x={CARD.SAFE} y={205} width={430} height={110} rx="16" fill="none" stroke={s.accent} strokeWidth="4" strokeDasharray="14 10" />
          <text x={CARD.SAFE + 215} y={280} textAnchor="middle" fontFamily={FD} fontWeight="700" fontSize="64" fill={s.accent}>
            {s.couponCode}
          </text>
          {s.couponLabel ? (
            <text x={CARD.SAFE} y={370} fontFamily={FB} fontSize="30" fill="#ffffffaa">
              {s.couponLabel}
            </text>
          ) : null}
        </>
      ) : (
        <text x={CARD.SAFE} y={250} fontFamily={FD} fontWeight="600" fontSize="52" fill="#ffffff">
          {s.name}
        </text>
      )}
      <text x={CARD.SAFE} y={CARD.H - 95} fontFamily={FB} fontSize="28" fill="#ffffff77">
        No phone tap? Scan the code →
      </text>
      <QrBlock slots={s} x={CARD.W - 285} y={CARD.H - 350} size={220} dark="#0a0d0d" light="#ffffff" />
      {s.siteHost ? (
        <text x={CARD.W - 175} y={CARD.H - 70} textAnchor="middle" fontFamily={FB} fontSize="24" fill="#ffffff77">
          {s.siteHost}
        </text>
      ) : null}
    </>
  );
}

/* ── CLEAN ───────────────────────────────────────────────────────────── */

function CleanFront({ s }: { s: CardSlots }) {
  const nameSize = fit(s.name, 18, 76);
  return (
    <>
      <rect width={CARD.W} height={CARD.H} fill="#ffffff" />
      <rect x="0" y="0" width="22" height={CARD.H} fill={s.primary} />
      <text x={CARD.SAFE + 20} y={215} fontFamily={FD} fontWeight="700" fontSize={nameSize} fill="#101413">
        {s.name}
      </text>
      {s.tagline ? (
        <text x={CARD.SAFE + 20} y={272} fontFamily={FB} fontSize="30" fill="#10141399">
          {s.tagline}
        </text>
      ) : null}
      {s.phone ? (
        <text x={CARD.SAFE + 20} y={CARD.H - 130} fontFamily={FD} fontWeight="600" fontSize="50" fill={s.primary}>
          {s.phone}
        </text>
      ) : null}
      <text x={CARD.SAFE + 20} y={CARD.H - CARD.SAFE} fontFamily={FB} fontWeight="700" fontSize="24" letterSpacing="5" fill="#10141366">
        TAP PHONE TO CARD
      </text>
      <NfcMark x={CARD.W - 145} y={CARD.H - 165} color={s.primary} scale={1.5} />
    </>
  );
}

function CleanBack({ s }: { s: CardSlots }) {
  return (
    <>
      <rect width={CARD.W} height={CARD.H} fill="#ffffff" />
      <rect x="0" y="0" width={CARD.W} height="14" fill={s.primary} />
      {s.couponCode ? (
        <>
          <text x={CARD.SAFE} y={165} fontFamily={FB} fontWeight="700" fontSize="28" letterSpacing="5" fill="#10141366">
            BRING THIS CARD BACK FOR
          </text>
          <text x={CARD.SAFE} y={265} fontFamily={FD} fontWeight="700" fontSize="72" fill={s.primary}>
            {s.couponCode}
          </text>
          {s.couponLabel ? (
            <text x={CARD.SAFE} y={330} fontFamily={FB} fontSize="30" fill="#101413aa">
              {s.couponLabel}
            </text>
          ) : null}
        </>
      ) : (
        <text x={CARD.SAFE} y={240} fontFamily={FD} fontWeight="600" fontSize="50" fill="#101413">
          {s.name}
        </text>
      )}
      <text x={CARD.SAFE} y={CARD.H - 95} fontFamily={FB} fontSize="27" fill="#10141388">
        No phone tap? Scan the code →
      </text>
      <QrBlock slots={s} x={CARD.W - 285} y={CARD.H - 350} size={220} dark="#101413" light="#f2f4f4" />
      {s.siteHost ? (
        <text x={CARD.W - 175} y={CARD.H - 70} textAnchor="middle" fontFamily={FB} fontSize="23" fill="#10141377">
          {s.siteHost}
        </text>
      ) : null}
    </>
  );
}

/* ── BOLD ────────────────────────────────────────────────────────────── */

function BoldFront({ s }: { s: CardSlots }) {
  const nameSize = fit(s.name, 13, 104);
  return (
    <>
      <rect width={CARD.W} height={CARD.H} fill={s.primary} />
      <rect x="0" y={CARD.H - 150} width={CARD.W} height="150" fill="#000000" opacity="0.22" />
      <text x={CARD.SAFE} y={250} fontFamily={FD} fontWeight="700" fontSize={nameSize} fill="#0b0e0e">
        {s.name}
      </text>
      {s.tagline ? (
        <text x={CARD.SAFE} y={315} fontFamily={FB} fontWeight="600" fontSize="32" fill="#0b0e0ecc">
          {s.tagline}
        </text>
      ) : null}
      {s.phone ? (
        <text x={CARD.SAFE} y={CARD.H - 55} fontFamily={FD} fontWeight="600" fontSize="56" fill="#ffffff">
          {s.phone}
        </text>
      ) : null}
      <NfcMark x={CARD.W - 150} y={CARD.H - 125} color="#ffffff" scale={1.4} />
    </>
  );
}

function BoldBack({ s }: { s: CardSlots }) {
  return (
    <>
      <rect width={CARD.W} height={CARD.H} fill="#0b0e0e" />
      <text x={CARD.SAFE} y={150} fontFamily={FD} fontWeight="700" fontSize="46" fill={s.primary}>
        {s.name}
      </text>
      {s.couponCode ? (
        <>
          <rect x={CARD.SAFE} y={195} width={430} height={105} rx="14" fill={s.primary} />
          <text x={CARD.SAFE + 215} y={266} textAnchor="middle" fontFamily={FD} fontWeight="700" fontSize="58" fill="#0b0e0e">
            {s.couponCode}
          </text>
          {s.couponLabel ? (
            <text x={CARD.SAFE} y={352} fontFamily={FB} fontSize="30" fill="#ffffffaa">
              {s.couponLabel}
            </text>
          ) : null}
        </>
      ) : null}
      <text x={CARD.SAFE} y={CARD.H - 95} fontFamily={FB} fontWeight="700" fontSize="26" letterSpacing="5" fill="#ffffff88">
        TAP THE CARD · OR SCAN →
      </text>
      <QrBlock slots={s} x={CARD.W - 285} y={CARD.H - 350} size={220} dark="#0b0e0e" light="#ffffff" />
      {s.siteHost ? (
        <text x={CARD.W - 175} y={CARD.H - 70} textAnchor="middle" fontFamily={FB} fontSize="24" fill="#ffffff77">
          {s.siteHost}
        </text>
      ) : null}
    </>
  );
}

/* ── Renderer ────────────────────────────────────────────────────────── */

const TEMPLATES: Record<CardTemplateId, { Front: React.FC<{ s: CardSlots }>; Back: React.FC<{ s: CardSlots }> }> = {
  voltage: { Front: VoltageFront, Back: VoltageBack },
  clean: { Front: CleanFront, Back: CleanBack },
  bold: { Front: BoldFront, Back: BoldBack },
};

export function CardArt({
  template,
  side,
  slots,
  bleed = false,
  className,
}: {
  template: CardTemplateId;
  side: "front" | "back";
  slots: CardSlots;
  /** print files extend the background into the bleed area */
  bleed?: boolean;
  className?: string;
}) {
  const t = TEMPLATES[template] ?? TEMPLATES.voltage;
  const Side = side === "front" ? t.Front : t.Back;
  const b = bleed ? CARD.BLEED : 0;
  return (
    <svg
      viewBox={`${-b} ${-b} ${CARD.W + b * 2} ${CARD.H + b * 2}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`${slots.name} card ${side}`}
    >
      {bleed ? (
        <rect x={-b} y={-b} width={CARD.W + b * 2} height={CARD.H + b * 2} fill={template === "clean" ? "#ffffff" : template === "bold" && side === "front" ? slots.primary : "#0a0d0d"} />
      ) : null}
      <Side s={slots} />
    </svg>
  );
}

/** Derive card slots from a page config (single source of truth). */
export function slotsFromConfig(config: {
  business: {
    name: string;
    tagline?: string;
    phone?: string;
    logoUrl?: string;
    coupon?: { code: string; label: string };
  };
  theme: { primary: string; accent: string };
}): Omit<CardSlots, "qr" | "siteHost"> {
  return {
    name: config.business.name,
    tagline: config.business.tagline,
    phone: config.business.phone,
    logoUrl: config.business.logoUrl,
    couponCode: config.business.coupon?.code,
    couponLabel: config.business.coupon?.label,
    primary: config.theme.primary,
    accent: config.theme.accent,
  };
}
