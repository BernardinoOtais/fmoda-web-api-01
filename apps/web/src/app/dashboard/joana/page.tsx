import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import React from "react";

const Joana = async () => {
  await authorizePapelOrRedirect(PAPEL_JOANA);

  const agora = new Date();
  const hora = agora.getHours();

  let saudacao = "Boa noite, Joana 🌙"; // valor por defeito
  if (hora < 12) {
    saudacao = "Bom dia, Joana ☀️";
  } else if (hora < 18) {
    saudacao = "Boa tarde, Joana 🌤️";
  }

  return (
    <div className="text-center text-xl font-semibold mt-6">{saudacao}</div>
  );
};

export default Joana;
