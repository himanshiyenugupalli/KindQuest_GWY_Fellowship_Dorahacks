import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/shared/StateBlocks";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { paymentRecords } from "@/data/volunteer";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payment records · KindQuest" },
      {
        name: "description",
        content: "Stipends, reimbursements and recorded transfers linked to your volunteering.",
      },
      { property: "og:title", content: "Payment records · KindQuest" },
      { property: "og:description", content: "A clear record of any money involved in your volunteering." },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const total = paymentRecords.reduce((sum, r) => sum + r.amount, 0);

  return (
    <AppShell title="Payment records" subtitle="Transparency on stipends and reimbursements.">
      {paymentRecords.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No payment records"
          description="Most volunteering is unpaid. Any stipend or reimbursement will appear here."
        />
      ) : (
        <>
          <div className="card-surface rounded-2xl p-5">
            <p className="text-sm font-semibold">Total recorded</p>
            <p className="mt-2 text-3xl font-bold">₹{total.toLocaleString()}</p>
          </div>

          <div className="card-surface mt-6 overflow-x-auto rounded-2xl p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Opportunity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentRecords.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.date}</TableCell>
                    <TableCell className="font-medium">{r.organizationName}</TableCell>
                    <TableCell>{r.opportunityTitle}</TableCell>
                    <TableCell>{r.type}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{r.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{r.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </AppShell>
  );
}
