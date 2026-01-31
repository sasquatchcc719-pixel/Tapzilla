import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user's company
  const { data: companyUser } = await supabase
    .from("company_users")
    .select("company_id")
    .eq("user_id", user!.id)
    .single();

  const companyId = companyUser?.company_id;

  // Get stats
  const [leadsResult, qrCodesResult] = await Promise.all([
    supabase
      .from("leads")
      .select("id, created_at, status")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("qr_codes")
      .select("id, name, total_scans, total_leads, status")
      .eq("company_id", companyId),
  ]);

  const recentLeads = leadsResult.data || [];
  const qrCodes = qrCodesResult.data || [];
  const totalLeads = qrCodes.reduce((sum, qr) => sum + (qr.total_leads || 0), 0);
  const totalScans = qrCodes.reduce((sum, qr) => sum + (qr.total_scans || 0), 0);
  const conversionRate = totalScans > 0 ? ((totalLeads / totalScans) * 100).toFixed(1) : "0";

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600">Welcome back! Here's your overview.</p>
        </div>
        <Link
          href="/dashboard/qr-codes/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          + New QR Code
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600">Total Leads</span>
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{totalLeads}</p>
          <p className="text-sm text-neutral-500">All time</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600">Total Scans</span>
            <span className="text-2xl">📱</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{totalScans}</p>
          <p className="text-sm text-neutral-500">All time</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600">Conversion Rate</span>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{conversionRate}%</p>
          <p className="text-sm text-neutral-500">Scans to leads</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600">Active QR Codes</span>
            <span className="text-2xl">📍</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">
            {qrCodes.filter((qr) => qr.status === "active").length}
          </p>
          <p className="text-sm text-neutral-500">
            of {qrCodes.length} total
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-neutral-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-neutral-900">Recent Leads</h2>
              <Link
                href="/dashboard/leads"
                className="text-primary-600 text-sm font-medium hover:text-primary-700"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentLeads.length === 0 ? (
              <div className="p-6 text-center text-neutral-500">
                <p className="mb-2">No leads yet</p>
                <p className="text-sm">
                  Create a QR code and start collecting leads!
                </p>
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">New Lead</p>
                    <p className="text-sm text-neutral-500">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lead.status === "new"
                        ? "bg-green-100 text-green-700"
                        : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* QR Codes */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-neutral-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-neutral-900">Your QR Codes</h2>
              <Link
                href="/dashboard/qr-codes"
                className="text-primary-600 text-sm font-medium hover:text-primary-700"
              >
                Manage →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-neutral-100">
            {qrCodes.length === 0 ? (
              <div className="p-6 text-center text-neutral-500">
                <p className="mb-4">No QR codes yet</p>
                <Link
                  href="/dashboard/qr-codes/new"
                  className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700"
                >
                  Create your first QR code
                </Link>
              </div>
            ) : (
              qrCodes.slice(0, 5).map((qr) => (
                <div key={qr.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">{qr.name}</p>
                    <p className="text-sm text-neutral-500">
                      {qr.total_scans} scans · {qr.total_leads} leads
                    </p>
                  </div>
                  <span
                    className={`w-3 h-3 rounded-full ${
                      qr.status === "active" ? "bg-green-500" : "bg-neutral-300"
                    }`}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
