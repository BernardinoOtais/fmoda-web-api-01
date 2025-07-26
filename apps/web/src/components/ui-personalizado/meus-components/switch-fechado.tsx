"use client";

import { useRouter, usePathname } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type SwitchFechadoProps = {
  titulo?: string;
  fechado: boolean;
};

const SwitchFechado = ({ titulo, fechado }: SwitchFechadoProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const toggleFechado = () => {
    const newFechado = !fechado;
    const params = new URLSearchParams();
    params.set("fechado", newFechado ? "true" : "false");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Switch
        id="envio-fechado"
        checked={fechado}
        onCheckedChange={toggleFechado}
        className="ml-auto cursor-pointer"
      />
      <Label className="mr-auto">{titulo ?? "Envios fechados"}</Label>
    </>
  );
};

export default SwitchFechado;
