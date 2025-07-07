"use client";

import { AutocompleteDto } from "@repo/tipos/comuns";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SelectFormFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  options: AutocompleteDto[];
  placeholder?: string;
  label?: string;
  disable?: boolean;
  largura?: string;
  mostraErro?: boolean;
};

export function SelectFormField<T extends FieldValues>({
  form,
  name,
  options,
  placeholder = "Escolha uma opção...",
  label,
  disable = false,
  largura = "w-[200px]",
  mostraErro = true,
}: SelectFormFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: { field: ControllerRenderProps<T, Path<T>> }) => (
        <FormItem className="flex flex-col">
          {label && (
            <FormLabel
              className={cn(
                disable && "cursor-not-allowed opacity-50" // Styling when disabled
              )}
            >
              {label}
            </FormLabel>
          )}
          <Select
            value={field.value?.toString()} // Ensure it's a string
            onValueChange={(value) =>
              form.setValue(name, Number(value) as PathValue<T, Path<T>>)
            }
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "justify-between",
                  !field.value && "text-muted-foreground",
                  disable && "cursor-not-allowed opacity-50", // Styling when disabled
                  largura
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    disabled={disable}
                    value={option.value.toString()} // Ensure it's a string
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {mostraErro && (
            <div className="h-5">
              <FormMessage />
            </div>
          )}
        </FormItem>
      )}
    />
  );
}
