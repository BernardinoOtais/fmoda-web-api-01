"use client";

import { AutocompleteStringDto } from "@repo/tipos/comuns";
import { ChevronsUpDown, Check } from "lucide-react";
import { useState } from "react";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type AutoCompleteFormFieldStringProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  options: AutocompleteStringDto[];
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  disable?: boolean;
  largura?: string;
  mostraErro?: boolean;
};

export function AutoCompleteFormFieldString<T extends FieldValues>({
  form,
  name,
  options,
  placeholder = "Escolha uma opção...",
  emptyMessage = "Não existe.",
  label,
  disable = false,
  largura = "w-[200px]",
  mostraErro = true,
}: AutoCompleteFormFieldStringProps<T>) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  //elips tambem no lable
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
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={disable}
                  className={cn(
                    "justify-between",
                    !field.value && "text-muted-foreground",
                    disable && "cursor-not-allowed opacity-50", // Styling when disabled
                    largura
                  )}
                >
                  <span className="max-w-[90%] truncate overflow-hidden text-ellipsis">
                    {field.value
                      ? options.find((opt) => opt.value === field.value)?.label
                      : placeholder}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className={cn("p-0 min-w-full")}
              style={{ pointerEvents: "auto" }}
              side="bottom"
              align="start"
              // 👇 this makes it render outside the DialogContent container
              forceMount
            >
              <Command>
                <CommandInput
                  placeholder="Pesquisa..."
                  disabled={disable}
                  className="w-full"
                />
                <CommandList>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        disabled={disable}
                        value={option.label}
                        onSelect={() => {
                          form.setValue(
                            name,
                            option.value as PathValue<T, Path<T>>
                          );
                          setIsPopoverOpen(false);
                        }}
                      >
                        <span className="max-w-[90%] truncate overflow-hidden text-ellipsis">
                          {option.label}
                        </span>
                        <Check
                          className={cn(
                            "ml-auto",
                            option.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
