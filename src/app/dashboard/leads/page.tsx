import { createClient } from "@/lib/supabase/server";

export default async function LeadsPage() {
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

  // Get leads
  const { data: leads } = await supabase
    .from("leads")
    .select("*, qr_codes(name, channel)")
    .eq("company_id", companyUser?.company_id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Leads</h1>
        <p className="text-neutral-600">All your captured leads</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left p-4 font-semibold text-neutral-700">Name</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Phone</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Service</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Source</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Status</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {leads?.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-500">
                  No leads yet. Create a QR code and start collecting!
                </td>
              </tr>
            ) : (
              leads?.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-50">
                  <td className="p-4">
                    <div className="font-medium text-neutral-900">
                      {lead.first_name} {lead.last_name}
                    </div>
                    {lead.email && (
                      <div className="text-sm text-neutral-500">{lead.email}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {lead.phone}
                    </a>
                  </td>
                  <td className="p-4 text-neutral-700">{lead.service_needed || "-"}</td>
                  <td className="p-4">
                    <span className="text-sm text-neutral-600">
                      {(lead.qr_codes as { name: string; channel: string } | null)?.name || "Unknown"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === "new"
                          ? "bg-green-100 text-green-700"
                          : lead.status === "contacted"
                          ? "bg-blue-100 text-blue-700"
                          : lead.status === "booked"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-500 text-sm">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
