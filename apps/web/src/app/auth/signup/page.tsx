"use client";

import { authClient } from "@/better-auth/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [apelido, setApelido] = useState("");
  const [password, setpassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email(
      {
        email,
        name,
        password,
        username,
        apelido,
      },
      {
        onError: () => {
          window.alert("erro...");
        },
        onSuccess: () => {
          window.alert("Sucesso crrrr");
        },
      }
    );
  };
  return (
    <div className="p-4 flex flex-col gap-y-4">
      <Input placeholder="Nome" onChange={(e) => setName(e.target.value)} />
      <Input
        placeholder="Apelido"
        onChange={(e) => setApelido(e.target.value)}
      />
      <Input
        placeholder="User name"
        onChange={(e) => setUserName(e.target.value)}
      />
      <Input
        placeholder="email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        onChange={(e) => setpassword(e.target.value)}
      />
      <Button onClick={onSubmit}>Create user</Button>
    </div>
  );
}
