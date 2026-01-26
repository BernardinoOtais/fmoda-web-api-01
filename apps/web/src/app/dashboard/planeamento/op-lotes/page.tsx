import { getSession } from "@repo/authweb/session";

import OpLotesWrapper from "./op-lotes-wrapper";

const OpLotes = async () => {
  const session = await getSession();
  const user = session?.user.name;

  return (
    <>
      <OpLotesWrapper user={user} />
      <footer className="w-full px-1 py-3"></footer>
    </>
  );
};

export default OpLotes;
