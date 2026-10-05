export const dynamic = "force-dynamic";
import { CreditCard, History, Sparkles } from "lucide-react";
import { getUserPurchases } from "~/actions/purchases";
import Upgrade from "~/components/sidebar/upgrade";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

function formatPrice(amount: number | null, currency: string | null) {
  if (amount === null || currency === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-CH", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default async function BillingPage() {
  const result = await getUserPurchases();
  const purchases = result.success ? result.purchases : [];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-violet-600" />
            <h1 className="text-2xl font-bold tracking-tight">
              Billing & Credits
            </h1>
          </div>

          <p className="text-sm text-muted-foreground">
            View your credit purchase history and buy more credits.
          </p>
        </div>

        <div className="w-full sm:w-44">
          <Upgrade />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5" />
            Purchase History
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!result.success ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Could not load your purchase history.
            </div>
          ) : purchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                <Sparkles className="h-5 w-5 text-violet-600" />
              </div>

              <h2 className="text-base font-semibold">No purchases yet</h2>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Your credit purchases will appear here after a successful payment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="px-3 py-3 font-medium">Package</th>
                    <th className="px-3 py-3 font-medium">Credits</th>
                    <th className="px-3 py-3 font-medium">Price</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Order ID</th>
                  </tr>
                </thead>

                <tbody>
                  {purchases.map((purchase) => (
                    <tr
                      key={purchase.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-3 py-4 whitespace-nowrap">
                        {purchase.createdAt.toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="px-3 py-4 font-medium">
                        {purchase.packageName ?? "Legacy purchase"}
                      </td>

                      <td className="px-3 py-4">
                        <span className="inline-flex rounded-full bg-violet-100 px-2.5 py-1 font-semibold text-violet-700">
                          +{purchase.credits}
                        </span>
                      </td>

                      <td className="px-3 py-4 font-medium">
                        {formatPrice(purchase.amount, purchase.currency)}
                      </td>

                      <td className="px-3 py-4">
                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">
                          {formatStatus(purchase.status)}
                        </span>
                      </td>

                      <td className="px-3 py-4 font-mono text-xs text-muted-foreground">
                        {purchase.polarOrderId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}