import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/AppShell";
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

export const Route = createFileRoute("/organization/payments")({
  head: () => ({
    meta: [
      { title: "Payment records · KindQuest" },
      {
        name: "description",
        content: "A transparent record of stipends, reimbursements and donations linked to your opportunities.",
      },
      { property: "og:title", content: "Payment records · KindQuest" },
      { property: "og:description", content: "Money moves stay on the record." },
    ],
  }),
  component: OrgPayments,
});

function OrgPayments() {
  const total = paymentRecords.reduce((sum, p) => sum + p.amount, 0);

  return (
    <AppShell role="organization" title="Payment records" subtitle="Transparent, read-only history.">
      <div className="card-surface rounded-2xl p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Total recorded
        </p>
        <p className="mt-2 text-2xl font-bold">₹{total.toLocaleString("en-IN")}</p>
      </div>

      <div className="card-surface mt-6 overflow-x-auto rounded-2xl p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Opportunity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentRecords.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.date}</TableCell>
                <TableCell className="font-medium">{p.opportunityTitle}</TableCell>
                <TableCell>{p.type}</TableCell>
                <TableCell>₹{p.amount.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{p.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppShell>
  );
}
