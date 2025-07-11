import { Rows4, Tags } from "lucide-react";
import Link from "next/link";
import React from "react";

import BoataoActualizaAndroid from "./botao-actualiza-android";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Android = () => {
  return (
    <main className="relative grow">
      <div className="absolute top-0 bottom-0 flex w-full">
        <BoataoActualizaAndroid />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="m-1 mx-auto">
              Insere Itens
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="m-1 mx-auto w-56">
            <DropdownMenuLabel>Dados a Inserir...</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/embarques/configurar?tipo=ma">
                  <Rows4 className="mr-2" />
                  <span>Insere Malha</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/embarques/configurar?tipo=ac">
                  <Tags className="mr-2" />
                  <span>Insere Itens</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="m-1 mx-auto">
          Preços Embarque
        </Button>
      </div>
    </main>
  );
};

export default Android;
