-- ============================================
-- TAPZILLA DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Industries (pricing tiers)
CREATE TABLE industries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  price_per_lead DECIMAL(10,2) NOT NULL,
  tier TEXT NOT NULL,
  avg_job_value DECIMAL(10,2),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO industries (name, slug, icon, price_per_lead, tier, avg_job_value, sort_order) VALUES
('Roofing', 'roofing', '🏠', 10.00, 'premium', 10000, 1),
('HVAC', 'hvac', '❄️', 10.00, 'premium', 8000, 2),
('Water Restoration', 'water-restoration', '💧', 10.00, 'premium', 5000, 3),
('Solar', 'solar', '☀️', 10.00, 'premium', 15000, 4),
('Plumbing', 'plumbing', '🔧', 5.00, 'standard', 500, 5),
('Electrical', 'electrical', '⚡', 5.00, 'standard', 600, 6),
('Painting', 'painting', '🎨', 5.00, 'standard', 2000, 7),
('General Contractor', 'general-contractor', '🔨', 5.00, 'standard', 5000, 8),
('Carpet Cleaning', 'carpet-cleaning', '🧹', 2.00, 'basic', 300, 9),
('House Cleaning', 'house-cleaning', '🏡', 2.00, 'basic', 150, 10),
('Landscaping', 'landscaping', '🌳', 2.00, 'basic', 400, 11),
('Pest Control', 'pest-control', '🐜', 2.00, 'basic', 200, 12),
('Pet Grooming', 'pet-grooming', '🐕', 1.00, 'starter', 50, 13),
('Auto Detailing', 'auto-detailing', '🚗', 1.00, 'starter', 150, 14),
('Other', 'other', '📦', 2.00, 'basic', 200, 99);

-- Companies (tenants)
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry_id UUID REFERENCES industries(id),
  
  logo_url TEXT,
  primary_color TEXT DEFAULT '#FF6B00',
  secondary_color TEXT DEFAULT '#1a1a1a',
  
  phone TEXT,
  email TEXT,
  website TEXT,
  
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  service_area_zips TEXT[],
  service_area_radius INTEGER DEFAULT 25,
  
  tagline TEXT,
  years_in_business INTEGER,
  owner_name TEXT,
  
  chatbot_tone TEXT DEFAULT 'friendly',
  chatbot_greeting TEXT,
  chatbot_prompt TEXT,
  show_pricing BOOLEAN DEFAULT true,
  require_email BOOLEAN DEFAULT false,
  after_hours_message TEXT,
  
  stripe_customer_id TEXT,
  billing_email TEXT,
  
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company Users
CREATE TABLE company_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'owner',
  is_platform_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, user_id)
);

-- Services
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs
CREATE TABLE company_faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- QR Codes
CREATE TABLE qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  channel TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  partner_contact_name TEXT,
  partner_contact_phone TEXT,
  total_scans INTEGER DEFAULT 0,
  total_leads INTEGER DEFAULT 0,
  last_scan_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  health TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scans
CREATE TABLE scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_code_id UUID REFERENCES qr_codes(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  started_conversation BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  qr_code_id UUID REFERENCES qr_codes(id),
  session_id TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',
  lead_captured BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Leads
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  qr_code_id UUID REFERENCES qr_codes(id),
  conversation_id UUID REFERENCES conversations(id),
  first_name TEXT,
  last_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  service_needed TEXT,
  timeline TEXT,
  notes TEXT,
  estimated_value TEXT,
  conversation_transcript TEXT,
  delivered BOOLEAN DEFAULT false,
  delivered_at TIMESTAMPTZ,
  delivered_email BOOLEAN DEFAULT false,
  delivered_sms BOOLEAN DEFAULT false,
  delivered_webhook BOOLEAN DEFAULT false,
  clicked_website BOOLEAN DEFAULT false,
  clicked_website_at TIMESTAMPTZ,
  status TEXT DEFAULT 'new',
  billed BOOLEAN DEFAULT false,
  billed_at TIMESTAMPTZ,
  billed_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company Settings
CREATE TABLE company_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE UNIQUE,
  lead_email TEXT,
  lead_sms_phone TEXT,
  lead_webhook_url TEXT,
  addon_sms_alerts BOOLEAN DEFAULT false,
  addon_crm_integration BOOLEAN DEFAULT false,
  addon_analytics BOOLEAN DEFAULT false,
  addon_white_label BOOLEAN DEFAULT false,
  notify_new_lead_email BOOLEAN DEFAULT true,
  notify_new_lead_sms BOOLEAN DEFAULT false,
  notify_weekly_digest BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Billing Events
CREATE TABLE billing_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id),
  event_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  stripe_invoice_item_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM company_users WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_platform_admin FROM company_users WHERE user_id = auth.uid() LIMIT 1),
    false
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Policies
CREATE POLICY "Users see own company" ON companies FOR SELECT
  USING (id = get_user_company_id() OR is_platform_admin());

CREATE POLICY "Users update own company" ON companies FOR UPDATE
  USING (id = get_user_company_id() OR is_platform_admin());

CREATE POLICY "Users see own QR codes" ON qr_codes FOR SELECT
  USING (company_id = get_user_company_id() OR is_platform_admin());

CREATE POLICY "Users insert own QR codes" ON qr_codes FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users update own QR codes" ON qr_codes FOR UPDATE
  USING (company_id = get_user_company_id() OR is_platform_admin());

CREATE POLICY "Users delete own QR codes" ON qr_codes FOR DELETE
  USING (company_id = get_user_company_id() OR is_platform_admin());

CREATE POLICY "Users see own leads" ON leads FOR SELECT
  USING (company_id = get_user_company_id() OR is_platform_admin());

CREATE POLICY "Users update own leads" ON leads FOR UPDATE
  USING (company_id = get_user_company_id() OR is_platform_admin());

CREATE POLICY "Users manage own services" ON services FOR ALL
  USING (company_id = get_user_company_id() OR is_platform_admin());

CREATE POLICY "Users manage own FAQs" ON company_faqs FOR ALL
  USING (company_id = get_user_company_id() OR is_platform_admin());

CREATE POLICY "Users manage own settings" ON company_settings FOR ALL
  USING (company_id = get_user_company_id() OR is_platform_admin());

CREATE POLICY "Users see own billing" ON billing_events FOR SELECT
  USING (company_id = get_user_company_id() OR is_platform_admin());

-- Public access (no auth needed)
CREATE POLICY "Public insert scans" ON scans FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert conversations" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update conversations" ON conversations FOR UPDATE USING (true);
CREATE POLICY "Public select conversations" ON conversations FOR SELECT USING (true);
CREATE POLICY "Public insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone view industries" ON industries FOR SELECT USING (true);

-- Public read for QR codes (needed for chatbot)
CREATE POLICY "Public read active QR codes" ON qr_codes FOR SELECT
  USING (status = 'active');

-- Public read for companies (needed for chatbot)
CREATE POLICY "Public read active companies" ON companies FOR SELECT
  USING (status = 'active');

-- Public read for services (needed for chatbot)
CREATE POLICY "Public read services" ON services FOR SELECT
  USING (is_active = true);

-- Public read for FAQs (needed for chatbot)
CREATE POLICY "Public read FAQs" ON company_faqs FOR SELECT USING (true);
