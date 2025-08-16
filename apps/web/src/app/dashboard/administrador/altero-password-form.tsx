"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlteroUserPasswordSchema,
  AlteroUserPasswordSchemaDto,
} from "@repo/tipos/user";
import { useMutation, useSuspenseQuery } from "@repo/trpc";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AutoCompleteFormFieldString } from "@/components/ui-personalizado/meus-components/AutoCompleteFormFieldString";
import { useTRPC } from "@/trpc/client";

const AlteroPassWordForm = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.administrador.getUsers.queryOptions());
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const alteroPassword = useMutation(
    trpc.administrador.postAlteroPassword.mutationOptions({
      onSuccess: () => {
        toast.success("Password alterada com sucesso!");
      },
      onError: (error) => {
        toast.error("Erro ao alterar password: " + error.message);
      },
    })
  );

  const form = useForm<AlteroUserPasswordSchemaDto>({
    resolver: zodResolver(AlteroUserPasswordSchema),
    defaultValues: {
      value: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  const onSubmit = async (data: AlteroUserPasswordSchemaDto) => {
    try {
      await alteroPassword.mutate(data);
    } catch (error) {
      console.error("Failed to cleanup user:", error);

      toast.error("Error ao alterar Password...");
    }
    reset();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col space-y-4"
    >
      <Form {...form}>
        <AutoCompleteFormFieldString
          form={form}
          label="User..."
          name="value"
          options={data}
          placeholder="Escolhe user..."
          largura="w-full"
          mostraErro={false}
          disable={false}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password...</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Password..."
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirma Password...</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Confirma Password..."
                    type={showPasswordConfirm ? "text" : "password"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPasswordConfirm((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "A Alterar..." : "Altera Password"}
        </Button>
      </Form>
    </form>
  );
};

export default AlteroPassWordForm;
