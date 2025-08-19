"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AutocompleteStringDto } from "@repo/tipos/comuns";
import {
  AlteraTipoDeContaDestUserSchema,
  AlteraTipoDeContaSchema,
  AlteraTipoDeContaSchemaDto,
} from "@repo/tipos/user";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@repo/trpc";
import { CircleHelp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconsMenus } from "@/components/ui-personalizado/dashboard/menus/menus-e-seus-tipos";
import { AutoCompleteFormFieldString } from "@/components/ui-personalizado/meus-components/AutoCompleteFormFieldString";
import { MultiSelect } from "@/components/ui-personalizado/meus-components/multi-select";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

const AlteroTipoDeContaForm = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.administrador.getPapeis.queryOptions()
  );
  const papeisKeyValue = data.papeis.map((papel) => ({
    value: papel.idPapel,
    label: papel.descricao,
  }));

  const papeis = papeisKeyValue.map((papel) => ({
    value: papel.value,
    label: papel.label,
    icon: IconsMenus[papel.label as keyof typeof IconsMenus] || CircleHelp,
  }));
  const [name, setName] = useState("");

  const [userState, setUserState] = useState<AutocompleteStringDto[]>([]);

  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);

  const nomeUserDebounce = useDebounce(name, 1250);

  const alteroTipoDeConta = useMutation(
    trpc.administrador.patchPapeisDeUtilizador.mutationOptions({
      onSuccess: () => {
        toast.success("Password alterada com sucesso!");
      },
      onError: (error) => {
        toast.error("Erro ao alterar password: " + error.message);
      },
    })
  );
  const {
    data: userPapeis,
    isLoading,
    error,
  } = useQuery({
    ...trpc.administrador.getUserPapeis.queryOptions({
      name: nomeUserDebounce,
    }),
    enabled: AlteraTipoDeContaDestUserSchema.safeParse({
      name: nomeUserDebounce,
    }).success,
  });

  const form = useForm<AlteraTipoDeContaSchemaDto>({
    resolver: zodResolver(AlteraTipoDeContaSchema),
    defaultValues: {
      id: "",
      papeis: [],
    },
  });
  const {
    formState: { isSubmitting },
    setValue,
    reset,
  } = form;

  const watchedId = form.watch("id");

  useEffect(() => {
    if (watchedId && userPapeis && userPapeis.length > 0) {
      const papeisDesteUser = userPapeis
        .find((userRecebido) => userRecebido.id === watchedId)
        ?.userPapeis.map((p) => p.idPapel);

      setSelectedFrameworks(papeisDesteUser || []);
      setValue("id", watchedId);
      setValue("papeis", papeisDesteUser || [], { shouldValidate: true });
    }
  }, [setValue, userPapeis, watchedId]);

  useEffect(() => {
    if (name !== nomeUserDebounce || name === "") {
      setUserState([]);
      setSelectedFrameworks([]);
    }
  }, [name, nomeUserDebounce]);

  useEffect(() => {
    const users = userPapeis?.map((papeis) => ({
      value: papeis.id,
      label: `User: ${papeis.username} Nome: ${papeis.name}`,
    }));

    if (!users) {
      reset();
      setSelectedFrameworks([]);
      return;
    }

    setUserState(users);
    if (users.length === 1 && users[0]) {
      const papeis = userPapeis
        ?.find((p) => p.id === users[0]?.value)
        ?.userPapeis.map((papel) => papel.idPapel);

      setSelectedFrameworks(papeis || []);
      setValue("id", users[0].value);
      setValue("papeis", papeis || [], { shouldValidate: true });

      return;
    }
  }, [reset, setValue, userPapeis]);

  if (error) return <div>Erro..</div>;

  const onSubmit = async (data: AlteraTipoDeContaSchemaDto) => {
    try {
      await alteroTipoDeConta.mutate(data);
    } catch (error) {
      console.error("Erro ao alterar tipoi de conta...", error);

      toast.error("Error ao alterar tipo de conta...");
    }
    setUserState([]);
    setSelectedFrameworks([]);
    setName("");
    reset();
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <Label id={"user-name"} className="">
        Digitar parte do Nome...
      </Label>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="User Name..."
        disabled={isLoading}
      />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <Form {...form}>
          {userState.length > 1 ? (
            <AutoCompleteFormFieldString
              form={form}
              label="User..."
              name="id"
              options={userState}
              placeholder="Escolhe user..."
              largura="w-full"
              mostraErro={false}
              disable={false}
            />
          ) : (
            <Label className="mx-auto">{userState[0]?.label}</Label>
          )}

          <FormField
            control={form.control}
            name="papeis"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="user-papeis">Papeis...</FormLabel>
                <MultiSelect
                  id="user-papeis"
                  disabled={isSubmitting || userState.length === 0}
                  key={selectedFrameworks.join(",")}
                  options={papeis}
                  onValueChange={(values) => {
                    setSelectedFrameworks(values); // Update local state
                    field.onChange(values, { shouldValidate: true }); // Update form state
                  }}
                  defaultValue={selectedFrameworks}
                  placeholder="Papeis do Utilizador..."
                  variant="inverted"
                  animation={0}
                  maxCount={3}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isSubmitting || userState.length === 0}
          >
            {isSubmitting ? "A Alterar..." : "Altera Tipo de User..."}
          </Button>
        </Form>
      </form>
    </div>
  );
};

export default AlteroTipoDeContaForm;
