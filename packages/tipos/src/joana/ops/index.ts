import z from "zod";

const OpSchema = z.object({
  bostamp: z.string(),
  obrano: z.number(),
  modelo: z.string(),
  pCliente: z.string(),
  cliente: z.string(),
});

//                                                                                                                                                                  design                                                       cor                       foto                                                                                                                                                                                                                                                             qttPedida                               qttFaturada                             valorFaturada                           pedido                                                                                                                                                                                                                                                           pedidoT                                                                                                                                                                                                                                                          faturdado                                                                                                                                                                                                                                                        faturdado

export const OpsSchema = z.array(OpSchema);

export type OpsDto = z.infer<typeof OpsSchema>;
