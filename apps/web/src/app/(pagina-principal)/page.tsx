import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <>
      <div className="flex flex-col justify-center space-y-2 mt-2">
        <Button asChild className="mx-auto h-32.5 w-97.5" variant="ghost">
          <Link href="/dashboard">
            <div className="bg-image h-32.5 w-full bg-contain bg-center bg-no-repeat " />
          </Link>
        </Button>
        <div className="relative w-full max-w-480 aspect-70/45 mx-auto ">
          <Image
            src={"/assets/fmoda.jpg"}
            alt="Fashion"
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover px-2"
          />
        </div>
      </div>
    </>
  );
}
