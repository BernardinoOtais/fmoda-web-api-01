import { BmOpDto } from "@repo/tipos/qualidade_balancom";
import Link from "next/link";
import React from "react";

import FotoClient from "../fotos/foto-client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type OpProps = { bmOp: BmOpDto };

const Op = ({ bmOp }: OpProps) => {
  const tamanho = bmOp?.length;

  return (
    <div className="space-y-2">
      {bmOp?.map((op) => {
        //console.log(op.foto);
        return (
          <Card
            key={op.op}
            className={cn(
              "transition-colors hover:bg-muted",
              tamanho !== 1 && "border border-dashed"
            )}
          >
            <CardContent className="flex  flex-col items-center justify-between px-4 py-2">
              <Link
                href={`/dashboard/qualidade/balancom/${op.op}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {op.op}
              </Link>

              <FotoClient
                src={op.foto}
                alt="Foto Modelo"
                cssImage="w-24 mx-auto m-2"
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Op;
