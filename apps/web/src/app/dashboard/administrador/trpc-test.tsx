"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@repo/trpc";
import React from "react";

export const TrpcTest = () => {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.hello.queryOptions({ text: "Bernardino o tais" })
  );
  return <div>{data?.greeting}</div>;
};
