import { skipToken, useQuery } from "@repo/trpc";

import NovoPack from "./novo-pack";
import Packs from "./packs";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";

type CaixasDistProps = {
  op: number;
  numeroPecaCaixa: number | "";
  qttTamanhosAJuntar: number | "";
  bostamp: string;
  user: string | undefined;
};
const CaixasDist = ({
  op,
  numeroPecaCaixa,
  qttTamanhosAJuntar,
  bostamp,
  user,
}: CaixasDistProps) => {
  const trpc = useTRPC();

  const input =
    numeroPecaCaixa === "" || qttTamanhosAJuntar === ""
      ? skipToken
      : {
          Obrano: op,
          CaseCapacity: numeroPecaCaixa,
          MaxSizesPerCase: qttTamanhosAJuntar,
        };

  const { data, isLoading, isError } = useQuery(
    trpc.planeamentoLotes.getOpLotesDist.queryOptions(input),
  );

  if (isLoading) return <div>...</div>;
  if (isError) return <div>error...</div>;
  // onClick={() => handleClick(p)}
  return (
    <>
      {data?.dadosSingle.map((p) => {
        const totalTotal = p.totalSingle.reduce((sum, q) => sum + q.qtt, 0);
        return (
          <Card key={p.ref} className="mx-auto">
            <CardContent>
              <CardTitle className="">
                {numeroPecaCaixa !== "" && qttTamanhosAJuntar !== "" && (
                  <NovoPack
                    textoBotao={p.Pais}
                    total={p.totalSingle}
                    ref={p.ref}
                    bostamp={bostamp}
                    op={op}
                    numeroPecaCaixa={numeroPecaCaixa}
                    qttTamanhosAJuntar={qttTamanhosAJuntar}
                    user={user}
                  />
                )}
              </CardTitle>

              {p.packs.length !== 0 &&
                numeroPecaCaixa !== "" &&
                qttTamanhosAJuntar !== "" && (
                  <Packs
                    packs={p.packs}
                    bostamp={bostamp}
                    ref={p.ref}
                    op={op}
                    numeroPecaCaixa={numeroPecaCaixa}
                    qttTamanhosAJuntar={qttTamanhosAJuntar}
                    user={user}
                  />
                )}

              <div className="w-full text-center">
                <span className="font-semibold  ">Singles</span>
              </div>

              <Table className="border border-border rounded-md border-collapse  mx-auto ">
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="border border-border text-center font-semibold min-w-12 max-w-25 h-7 ">
                      <span className="text-xs font-semibold">N. C</span>
                    </TableHead>

                    {p.tamanhos.map((p) => (
                      <TableHead
                        key={p.tam}
                        className="border border-border text-center min-w-12 max-w-25 h-7 "
                      >
                        {p.tam.split(" - ")[0]}
                      </TableHead>
                    ))}
                    <TableHead className="border border-border text-center font-semibold min-w-12 max-w-25 h-7 ">
                      T
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {p.singles.map((t) => {
                    const total = t.quantidades.reduce(
                      (sum, q) => sum + q.qtt,
                      0,
                    );

                    return (
                      <TableRow key={t.case_no}>
                        <TableCell className="text-xs font-semibold text-center">
                          {t.case_no}
                        </TableCell>
                        {t.quantidades.map((p) => (
                          <TableCell
                            key={p.tam}
                            className="border border-border text-center min-w-12 max-w-25 h-2 p-0"
                          >
                            {p.qtt !== 0 && p.qtt}
                          </TableCell>
                        ))}
                        <TableCell className="text-xs font-semibold text-center bg-muted">
                          {total}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  <TableRow>
                    <TableCell className="text-xs font-semibold text-center bg-muted">
                      T
                    </TableCell>
                    {p.totalSingle.map((p) => (
                      <TableCell
                        key={p.tam}
                        className="border border-border text-center min-w-12 max-w-25 h-2 p-0 bg-muted"
                      >
                        {p.qtt !== 0 && p.qtt}
                      </TableCell>
                    ))}
                    <TableCell className="text-xs font-semibold text-center bg-muted">
                      {totalTotal}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

export default CaixasDist;
