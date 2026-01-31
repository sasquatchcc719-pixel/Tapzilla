export interface Industry {
  slug: string;
  name: string;
  icon: string;
  tier: "Premium" | "Standard" | "Basic" | "Starter";
  pricePerLead: number;
  description: string;
  tagline: string;
  problems: string[];
  qrPlacements: string[];
  exampleConversation: {
    service: string;
    questions: string[];
  };
}

export const industries: Industry[] = [
  {
    slug: "roofing",
    name: "Roofing",
    icon: "🏠",
    tier: "Premium",
    pricePerLead: 10,
    description: "Qualified roofing leads delivered to your phone, not shared with competitors.",
    tagline: "Stop Competing for Shared Leads",
    problems: [
      "Storm chasers flooding the market after every hail storm",
      "HomeAdvisor sending the same lead to 5 roofers",
      "Spending $100+ per lead that ghosts you",
      "Competing on price instead of reputation",
    ],
    qrPlacements: [
      "Work trucks and trailers",
      "Job site signs with 'Your neighbor chose us'",
      "Insurance agent offices",
      "Real estate offices for new homeowners",
    ],
    exampleConversation: {
      service: "roof inspection",
      questions: ["What type of issue are you seeing?", "When was your last inspection?", "Is this an insurance claim?"],
    },
  },
  {
    slug: "hvac",
    name: "HVAC",
    icon: "❄️",
    tier: "Premium",
    pricePerLead: 10,
    description: "Hot leads for heating and cooling services, year-round.",
    tagline: "Cool Leads, Hot Results",
    problems: [
      "Seasonal demand fluctuations",
      "Expensive Google Ads during peak season",
      "Competitors undercutting on maintenance contracts",
      "Emergency calls that don't convert to long-term customers",
    ],
    qrPlacements: [
      "Service vans and trucks",
      "Thermostat or unit stickers after service",
      "Property management offices",
      "New construction sites",
    ],
    exampleConversation: {
      service: "AC repair",
      questions: ["Is your system cooling at all?", "What type of system do you have?", "How old is your unit?"],
    },
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    icon: "🔧",
    tier: "Standard",
    pricePerLead: 5,
    description: "Plumbing leads that flow right to you.",
    tagline: "Stop the Lead Leak",
    problems: [
      "Emergency calls with unrealistic expectations",
      "Price shoppers comparing 5 quotes",
      "Hard to differentiate from competitors",
      "Expensive PPC during peak demand",
    ],
    qrPlacements: [
      "Service vans",
      "Bathroom renovation showrooms",
      "Property management offices",
      "Real estate closing gift partnerships",
    ],
    exampleConversation: {
      service: "plumbing repair",
      questions: ["What type of plumbing issue?", "Is it an emergency?", "Is there active water damage?"],
    },
  },
  {
    slug: "carpet-cleaning",
    name: "Carpet Cleaning",
    icon: "🧹",
    tier: "Basic",
    pricePerLead: 2,
    description: "Fill your schedule with carpet cleaning jobs.",
    tagline: "Clean Up Your Lead Generation",
    problems: [
      "Low margins mean you can't afford expensive leads",
      "Groupon customers who never come back",
      "Seasonal slowdowns between moves",
      "Hard to stand out from franchises",
    ],
    qrPlacements: [
      "Wrapped vans",
      "Property management offices (turnover cleaning)",
      "Real estate agent partnerships",
      "Laundromats and dry cleaners",
    ],
    exampleConversation: {
      service: "carpet cleaning",
      questions: ["How many rooms?", "Any pet stains or odors?", "When do you need this done?"],
    },
  },
  {
    slug: "house-cleaning",
    name: "House Cleaning",
    icon: "🏡",
    tier: "Basic",
    pricePerLead: 2,
    description: "Recurring cleaning clients start with a conversation.",
    tagline: "Sweep Away Lead Generation Problems",
    problems: [
      "One-time cleanings don't build a business",
      "Clients canceling last minute",
      "Race to the bottom on pricing",
      "Thumbtack taking a cut of every job",
    ],
    qrPlacements: [
      "Company vehicles",
      "Gym and yoga studio partnerships",
      "Real estate staging companies",
      "Luxury apartment buildings",
    ],
    exampleConversation: {
      service: "house cleaning",
      questions: ["How many bedrooms/bathrooms?", "One-time or recurring?", "Any pets in the home?"],
    },
  },
  {
    slug: "landscaping",
    name: "Landscaping",
    icon: "🌿",
    tier: "Basic",
    pricePerLead: 2,
    description: "Grow your landscaping business with qualified leads.",
    tagline: "Cultivate Better Leads",
    problems: [
      "Seasonal revenue swings",
      "Tire-kickers wanting free consultations",
      "HOAs with slow payment cycles",
      "Competing with national franchises",
    ],
    qrPlacements: [
      "Trucks and trailers",
      "Job site signs in visible yards",
      "Garden centers and nurseries",
      "HOA management offices",
    ],
    exampleConversation: {
      service: "landscaping",
      questions: ["What services are you looking for?", "Approximate yard size?", "Ongoing maintenance or one-time project?"],
    },
  },
  {
    slug: "pest-control",
    name: "Pest Control",
    icon: "🐜",
    tier: "Basic",
    pricePerLead: 2,
    description: "Exterminate your lead generation problems.",
    tagline: "Bug-Free Lead Generation",
    problems: [
      "Seasonal spikes overwhelming capacity",
      "Customers only calling for emergencies",
      "Low retention on preventive contracts",
      "National brands dominating online",
    ],
    qrPlacements: [
      "Service vehicles",
      "Property management offices",
      "Real estate offices (pre-sale inspections)",
      "Neighborhood association boards",
    ],
    exampleConversation: {
      service: "pest control",
      questions: ["What type of pest issue?", "How severe is the infestation?", "Do you have children or pets?"],
    },
  },
  {
    slug: "electrical",
    name: "Electrical",
    icon: "⚡",
    tier: "Standard",
    pricePerLead: 5,
    description: "Power up your electrical business with qualified leads.",
    tagline: "Electrify Your Lead Flow",
    problems: [
      "Customers afraid of electrician pricing",
      "Small jobs not worth the trip",
      "Competing with handymen on simple work",
      "Seasonal lulls between projects",
    ],
    qrPlacements: [
      "Work vans",
      "EV charger installation sites",
      "Solar company partnerships",
      "New construction walkways",
    ],
    exampleConversation: {
      service: "electrical work",
      questions: ["What electrical work do you need?", "Is this a repair or new installation?", "How old is your home's wiring?"],
    },
  },
  {
    slug: "painting",
    name: "Painting",
    icon: "🎨",
    tier: "Standard",
    pricePerLead: 5,
    description: "Paint a better picture of your pipeline.",
    tagline: "Brush Up Your Lead Generation",
    problems: [
      "Estimate no-shows wasting your time",
      "Lowballers undercutting quality work",
      "Seasonal slowdowns in winter",
      "Commercial jobs with long sales cycles",
    ],
    qrPlacements: [
      "Work trucks with before/after photos",
      "Paint store partnerships",
      "Real estate staging companies",
      "Property management offices",
    ],
    exampleConversation: {
      service: "painting",
      questions: ["Interior or exterior?", "How many rooms/square footage?", "When are you looking to have this done?"],
    },
  },
  {
    slug: "auto-detailing",
    name: "Auto Detailing",
    icon: "🚗",
    tier: "Starter",
    pricePerLead: 1,
    description: "Detail your way to more customers.",
    tagline: "Shine Up Your Client List",
    problems: [
      "Low average ticket means thin margins",
      "Mobile vs shop location confusion",
      "Seasonal slowdowns",
      "Customers expecting car wash prices",
    ],
    qrPlacements: [
      "Mobile unit or work vehicle",
      "Auto dealership partnerships",
      "Corporate office parking lots",
      "Gym and country club parking",
    ],
    exampleConversation: {
      service: "auto detailing",
      questions: ["What type of vehicle?", "Interior, exterior, or full detail?", "Any specific problem areas?"],
    },
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

export function getAllIndustrySlugs(): string[] {
  return industries.map((i) => i.slug);
}
