import { Eyebrow } from "@/components/ui";
import { ServiceForm } from "@/components/service-form";

export default function NewServicePage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Eyebrow>Provider dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Add a new service</h1>
      <p className="mt-2 text-sm text-muted">This will appear on Explore once you save it.</p>
      <ServiceForm mode="create" />
    </div>
  );
}
