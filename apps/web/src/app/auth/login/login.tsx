"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@repo/authweb/authClient";
import { LoginDto, LoginSchema } from "@repo/tipos/user";
import { OctagonAlertIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertTitle } from "@/components/ui/alert";
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

const Login = () => {
  //const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      nomeUser: "",
      password: "",
    },
  });

  const { errors, isSubmitting } = form.formState;

  const onSubmit = async (data: LoginDto) => {
    setError(null);
    await authClient.signIn.username(
      {
        username: data.nomeUser,
        password: data.password,
      },
      {
        onSuccess: () => {
          console.log("Login", callbackUrl || "/dashboard");
          //router.push(callbackUrl || "/dashboard");
          window.location.href = callbackUrl || "/dashboard";
        },
        onError: ({ error }) => {
          console.log("O tais error :", error.message);
          setError(error.message);
        },
      }
    );
  };

  return (
    // The HTML form element wraps the `Form` component
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        {errors.message && (
          <FormMessage className="text-red-500">
            {errors.message.message}
          </FormMessage>
        )}
        <FormField
          control={form.control}
          name="nomeUser"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Utilizador...</FormLabel>
              <FormControl>
                <Input {...field} placeholder="User Name..." autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password...</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Password..." type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!!error && (
          <Alert className="bg-destructive/10 border-none">
            <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Login..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default Login;
