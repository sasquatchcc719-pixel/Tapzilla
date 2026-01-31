import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminCompaniesPage() {
  const supabase = await createClient();

  // Get all companies with stats
  const { data: companies } = await supabase
    .from("companies")
    .select("*, industries(name, icon)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">All Companies</h1>
        <p className="text-neutral-600">Manage platform companies</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left p-4 font-semibold text-neutral-700">Company</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Industry</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Contact</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Status</th>
              <th className="text-left p-4 font-semibold text-neutral-700">Created</th>
              <th className="text-left p-4 font-semibold text-neutral-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {companies?.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-500">
                  No companies yet
                </td>
              </tr>
            ) : (
              companies?.map((company) => (
                <tr key={company.id} className="hover:bg-neutral-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {company.logo_url ? (
                        <img
                          src={company.logo_url}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: company.primary_color }}
                        >
                          {company.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-neutral-900">{company.name}</p>
                        <p className="text-sm text-neutral-500">{company.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1">
                      <span>{(company.industries as { icon: string } | null)?.icon}</span>
                      <span className="text-neutral-700">
                        {(company.industries as { name: string } | null)?.name || "-"}
                      </span>
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-neutral-700">{company.email || "-"}</p>
                      <p className="text-sm text-neutral-500">{company.phone}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        company.status === "active"
                          ? "bg-green-100 text-green-700"
                          : company.status === "suspended"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-500 text-sm">
                    {new Date(company.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/companies/${company.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View →
                    </Link>
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
