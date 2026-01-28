import type { Metadata } from "next";
import { MissionPageClient } from "./MissionPageClient";

export const metadata: Metadata = {
  title: "Misiune | Mission",
  description:
    "Societatea pentru Cercetare și Inovare în Patologii Infecțioase este o organizație profesională non-profit dedicată progresului științific în domeniul bolilor infecțioase. | SRIID is a non-profit professional organization dedicated to advancing scientific progress in infectious diseases.",
};

export default function MissionPage() {
  return <MissionPageClient />;
}
