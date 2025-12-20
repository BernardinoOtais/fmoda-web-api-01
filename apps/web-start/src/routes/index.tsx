import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <>
      <div className="flex flex-col justify-center space-y-2 mt-2">
        <Button asChild className="mx-auto h-32.5 w-97.5" variant="ghost">
          <Link to="/info">
            <div className="bg-image h-32.5 w-full bg-contain bg-center bg-no-repeat " />
          </Link>
        </Button>
        <div className="relative w-full h-full">
          <img
            src="/assets/fmoda.jpg"
            alt="Fmoda"
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover mx-auto px-2"
          />
        </div>
      </div>
    </>
  );
}
