import CreateCustomerForm from "./create-customer-form";
import { requireUserId } from "@/lib/auth/session";

export default async function NewCustomerPage() {
    await requireUserId();
    return <CreateCustomerForm />;
}
