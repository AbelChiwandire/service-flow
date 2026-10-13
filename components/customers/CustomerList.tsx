import type { Customer } from "@/lib/db/customer/repository";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import CustomerItem from "./CustomerItem";

const columns: DataTableColumn[] = [
  { label: "Customer", className: "col-span-3" },
  { label: "Email", className: "col-span-3" },
  { label: "Phone", className: "col-span-2" },
  { label: "Address", className: "col-span-4" },
];

export default function CustomerList({ customers }: { customers: Customer[] }) {
  return (
    <DataTable columns={columns}>
      {customers.map((customer) => (
        <CustomerItem key={customer.id} customer={customer} />
      ))}
    </DataTable>
  );
}