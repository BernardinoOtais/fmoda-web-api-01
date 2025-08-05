import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <>
      <div className="flex flex-col justify-center">
        <Button
          asChild
          className="m-10 mx-auto h-[130px] w-[390px]"
          variant="ghost"
        >
          <Link href="/dashboard">
            <div className="bg-image h-[130px] w-full bg-contain bg-center bg-no-repeat" />
          </Link>
        </Button>
        <Image
          src={"/assets/fmoda.jpg"}
          alt="Fashion"
          width={1920} // Use the actual width of your image
          height={1080} // Use the actual height of your image
          className="mx-auto h-[770px] w-[1156px] object-contain"
        />
      </div>
    </>
  );
}
