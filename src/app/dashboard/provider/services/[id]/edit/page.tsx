"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { services } from "@/lib/data";
import { Eyebrow } from "@/components/ui";
import { ServiceForm, type ServiceFormValues } from "@/components/service-form";

export default function EditServicePage() {
  const params = useParams<{ id: string }>();
  const service = services.find((s) => s.id === params.id);

  if (!service) notFound();

  const initial: ServiceFormValues = {
    title: service.title,
    category: service.category,
    shortDescription: service.shortDescription,
    description: service.description,
    price: service.price,
    priceUnit: service.priceUnit,
    location: service.location,
    available: service.available,
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Eyebrow>Provider dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Edit service</h1>
      <p className="mt-2 text-sm text-muted">{service.title}</p>
      <ServiceForm mode="edit" initial={initial} />
    </div>
  );
}
