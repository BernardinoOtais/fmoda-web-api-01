"use client";

import { useRouter, usePathname } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type SwitchFechadoProps = {
  titulo?: string;
  fechado: boolean;
  className?: string;
  param?: string;
};

const SwitchFechado = ({
  titulo,
  fechado,
  className,
  param,
}: SwitchFechadoProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const toggleFechado = () => {
    const newFechado = !fechado;
    const params = new URLSearchParams();
    params.set(param ?? "fechado", newFechado ? "true" : "false");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn("ml-auto flex flex-row space-x-1", className)}>
      <Switch
        id="envio-fechado"
        checked={fechado}
        onCheckedChange={toggleFechado}
        className=" cursor-pointer"
      />
      <Label className="mr-auto">{titulo ?? "Envios fechados"}</Label>
    </div>
  );
};
export default SwitchFechado;
