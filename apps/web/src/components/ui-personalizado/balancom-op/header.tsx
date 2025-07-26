import Link from "next/link";
import React from "react";

import TCsss from "./tc-sss";

import { Button } from "@/components/ui/button";

type HeaderProps = { idBm: string; op: number; composicao: string };

const Header = ({ idBm, op, composicao }: HeaderProps) => {
  return (
    <header className="x-1 space-y-1.5 border-b py-3 text-center flex">
      <div className="mx-auto flex">
        <div className="border rounded-lg p-2 select-none self-end">
          <h4 className="text-xl leading-none font-medium">Composição</h4>
          <Button variant="link" asChild>
            <Link href={`/dashboard/qualidade/balancom/${op}/ccomposicao`}>
              {composicao}
            </Link>
          </Button>
        </div>
      </div>
      <div className="mx-auto">
        <div className="border rounded-lg p-2 select-none ">
          <h4 className="text-xl leading-none font-medium">TCs</h4>
          <TCsss idBm={idBm} />
        </div>
      </div>
    </header>
  );
};
export default Header;
