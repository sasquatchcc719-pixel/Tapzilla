import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  // Get platform stats (admin has access to all)
  const [companiesResult, leadsResult, , scansResult] = await Promise.all([
    supabase.from("companies").select("id, name, status, created_at"),
    supabase.from("leads").select("id, billed, billed_amount, created_at"),
    supabase.from("qr_codes").select("id"),
    supabase.from("scans").select("id").gte(
      "created_at",
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    ),
  ]);

  const companies = companiesResult.data || [];
  const leads = leadsResult.data || [];
  const monthlyScans = scansResult.data?.length || 0;

  const activeCompanies = companies.filter((c) => c.status === "active").length;
  const totalRevenue = leads
    .filter((l) => l.billed)
    .reduce((sum, l) => sum + (l.billed_amount || 0), 0);
  const pendingRevenue = leads
    .filter((l) => !l.billed)
    .length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Admin Overview</h1>
        <p className="text-neutral-600">Platform-wide statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600">Companies</span>
            <span className="text-2xl">🏢</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{companies.length}</p>
          <p className="text-sm text-neutral-500">{activeCompanies} active</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600">Total Leads</span>
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{leads.length}</p>
          <p className="text-sm text-neutral-500">{pendingRevenue} pending billing</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600">Monthly Scans</span>
            <span className="text-2xl">📱</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{monthlyScans}</p>
          <p className="text-sm text-neutral-500">Last 30 days</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600">Revenue</span>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-green-600">
            ${totalRevenue.toFixed(2)}
          </p>
          <p className="text-sm text-neutral-500">Billed to date</p>
        </div>
      </div>

      {/* Recent Companies */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold text-neutral-900">Recent Companies</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {companies.slice(0, 10).map((company) => (
            <div key={company.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">{company.name}</p>
                <p className="text-sm text-neutral-500">
                  Joined {new Date(company.created_at).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  company.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {company.status}
              </span>
            </div>
          ))}
          {companies.length === 0 && (
            <div className="p-8 text-center text-neutral-500">
              No companies yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
