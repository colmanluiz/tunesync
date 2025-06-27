import { ServiceType } from "@/types/services";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { ReactNode } from "react";

type ServiceCardProps = {
  serviceId: ServiceType;
  name: string;
  connectUrl: string;
  icon: ReactNode;
};

export function ServiceCard(props: ServiceCardProps) {
  return (
    <Link href={props.connectUrl}>
      <Card
        className={`w-64 h-48 flex flex-col items-center justify-center gap-3 p-4 cursor-pointer hover:bg-[var(--${props.serviceId?.toLowerCase()}-primary-hover)] transition-all`}
      >
        <CardContent className="flex flex-col items-center justify-center gap-3 p-0">
          {props.icon}
          <p className="text-md font-medium text-center">{props.name}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
