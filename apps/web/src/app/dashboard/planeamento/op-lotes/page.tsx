import { getSession } from "@repo/authweb/session";
import { Suspense } from "react";

import OpLotesWrapper from "./op-lotes-wrapper";

const OpLotes = async () => {
  const session = await getSession();
  const user = session?.user.name;

  return (
    <Suspense>
      <OpLotesWrapperSuspend user={user} />
    </Suspense>
  );
};

export default OpLotes;

type OpLotesWrapperSuspendProps = {
  user: string | undefined;
};
const OpLotesWrapperSuspend = ({ user }: OpLotesWrapperSuspendProps) => (
  <>
    <OpLotesWrapper user={user} />
    <footer className="w-full px-1 py-3"></footer>
  </>
);
