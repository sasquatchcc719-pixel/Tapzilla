import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function QRCodesPage() {
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

  // Get QR codes
  const { data: qrCodes } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("company_id", companyUser?.company_id)
    .order("created_at", { ascending: false });

  const channelIcons: Record<string, string> = {
    vehicle: "🚐",
    job_site: "🏠",
    partner: "📍",
    handout: "💳",
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">QR Codes</h1>
          <p className="text-neutral-600">Manage your QR codes and track performance</p>
        </div>
        <Link
          href="/dashboard/qr-codes/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          + New QR Code
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrCodes?.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No QR codes yet
            </h3>
            <p className="text-neutral-600 mb-6">
              Create your first QR code to start collecting leads
            </p>
            <Link
              href="/dashboard/qr-codes/new"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700"
            >
              Create QR Code
            </Link>
          </div>
        ) : (
          qrCodes?.map((qr) => (
            <div
              key={qr.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {channelIcons[qr.channel] || "📱"}
                    </span>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{qr.name}</h3>
                      <p className="text-sm text-neutral-500 capitalize">
                        {qr.channel.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`w-3 h-3 rounded-full ${
                      qr.status === "active" ? "bg-green-500" : "bg-neutral-300"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-neutral-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-neutral-900">
                      {qr.total_scans || 0}
                    </p>
                    <p className="text-xs text-neutral-500">Scans</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-neutral-900">
                      {qr.total_leads || 0}
                    </p>
                    <p className="text-xs text-neutral-500">Leads</p>
                  </div>
                </div>

                {qr.last_scan_at && (
                  <p className="text-xs text-neutral-500 mb-4">
                    Last scan: {new Date(qr.last_scan_at).toLocaleDateString()}
                  </p>
                )}

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/qr-codes/${qr.id}`}
                    className="flex-1 text-center py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 text-sm font-medium"
                  >
                    View Details
                  </Link>
                  <a
                    href={`/c/${qr.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                  >
                    Test Chat
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
