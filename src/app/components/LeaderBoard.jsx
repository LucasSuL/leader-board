import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { invoices } from "../config/data";
import { Input } from "@/components/ui/input";

export function LeaderBoard() {
  return (
    <Table className="text-xl">
      <TableCaption>Leader board</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Player&apos;s Name</TableHead>
          {/* <TableHead>Status</TableHead> */}
          <TableHead>Session Change</TableHead>
          <TableHead>S2 Income</TableHead>
          <TableHead>S1 Income</TableHead>
          <TableHead className="text-right">Total Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.name}>
            <TableCell className="font-medium">{invoice.name}</TableCell>
            <TableCell>
               <Input type="number" placeholder="e.g. +50" />
            </TableCell>
            <TableCell>{invoice.s2}</TableCell>
            <TableCell>{invoice.s1}</TableCell>
            <TableCell className="text-right">
              {invoice.s1 + invoice.s2}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
}
