import type { Metadata } from "next";
import { MembersPageClient } from "./MembersPageClient";

export const metadata: Metadata = {
  title: "Membri | Members",
  description:
    "Societatea pentru Cercetare și Inovare în Patologii Infecțioase este o comunitate profesională dedicată tuturor celor implicați în practica clinică, educație și cercetare în domeniul bolilor infecțioase. | SRIID is a professional community for those involved in clinical practice, education, and research in infectious diseases.",
};

export default function MembersPage() {
  return <MembersPageClient />;
}
