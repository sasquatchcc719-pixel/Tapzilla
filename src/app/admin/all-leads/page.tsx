import { createClient } from "@/lib/supabase/server";

export default async function AdminAllLeadsPage() {
  const supabase = await createClient();

  // Get all leads with company info
  const { data: leads } = await supabase
    .from("leads")
    .select("*, companies(name), qr_codes(name, channel)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">All Leads</h1>
        <p className="text-neutral-600">Platform-wide lead overview</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left p-4 font-semibold text-neutral-700">Lead</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Company</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Source</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Status</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Billed</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {leads?.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-500">
                  No leads yet
                </td>
              </tr>
            ) : (
              leads?.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-neutral-900">
                        {lead.first_name} {lead.last_name}
                      </p>
                      <p className="text-sm text-neutral-500">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-700">
                    {(lead.companies as { name: string } | null)?.name || "-"}
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-neutral-600">
                      {(lead.qr_codes as { name: string } | null)?.name || "Unknown"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === "new"
                          ? "bg-green-100 text-green-700"
                          : lead.status === "contacted"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {lead.billed ? (
                      <span className="text-green-600 font-medium">
                        ${lead.billed_amount?.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-neutral-400">Pending</span>
                    )}
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
