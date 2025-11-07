"use client";
import { useQuery } from "@repo/trpc";
import { Loader2 } from "lucide-react";
import Image, { ImageProps } from "next/image";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type FotoClientProps = {
  src: string;
  alt: string;
  cssImage?: string;
} & ImageProps;

const FotoClient = ({ src, alt, cssImage, ...rest }: FotoClientProps) => {
  const trpc = useTRPC();

  const fotoParaGet = src.replace(/\\/g, /* "%2F"*/ "/");

  const { data, isLoading, error } = useQuery(
    trpc.fotosGeraisFmoda.getFoto.queryOptions({ id: fotoParaGet })
  );
  if (isLoading)
    return (
      <div className="flex items-center justify-center text-sm text-muted-foreground w-15 h-15">
        <Loader2 className="absolute animate-spin" />
      </div>
    );
  if (error) return <div>erro...</div>;

  if (!data) {
    return (
      <Image
        src={"/assets/placeholder.png"}
        alt={"..."}
        width="0"
        height="0"
        sizes="100vw"
        className={cn("h-auto w-full", cssImage)}
        {...rest}
      />
    );
  }
  const { fotoString, contentType } = data;
  return (
    <Image
      src={`data:${contentType};base64,${fotoString}`}
      alt={alt}
      width="0"
      height="0"
      sizes="100vw"
      className={cn("h-auto w-full ", cssImage)}
      {...rest}
    />
  );
};

export default FotoClient;
