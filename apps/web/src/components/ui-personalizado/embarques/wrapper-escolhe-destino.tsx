import { useSuspenseQuery } from "@repo/trpc";
import React from "react";
import { FieldValues, UseFormReturn, Path } from "react-hook-form";

import { AutoCompleteFormFieldString } from "@/components/ui-personalizado/meus-components/AutoCompleteFormFieldString";
import { useTRPC } from "@/trpc/client";

type WrapperEscolheDestinoProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  largura?: string;
  isSaving?: boolean;
  label?: string;
};

export function WrapperEscolheDestino<T extends FieldValues>({
  form,
  name,
  largura,
  isSaving,
  label,
}: WrapperEscolheDestinoProps<T>) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.embarques.getDestinosDisponiveis.queryOptions()
  );

  return (
    <AutoCompleteFormFieldString
      form={form}
      label={label}
      name={name}
      options={data}
      placeholder="Destino..."
      largura={largura ?? "w-[450px]"}
      mostraErro={false}
      disable={isSaving !== undefined ? isSaving : false}
    />
  );
}

export default WrapperEscolheDestino;
