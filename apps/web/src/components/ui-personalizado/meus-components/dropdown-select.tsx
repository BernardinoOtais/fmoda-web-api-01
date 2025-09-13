"use client";

import { AutocompleteStringDto } from "@repo/tipos/comuns";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DropdownSelectProps = {
  valorOriginal: string;
  setValue: Dispatch<SetStateAction<string>>;
  dados: AutocompleteStringDto[];
  posting: boolean;
};

const DropdownSelect = ({
  valorOriginal,
  setValue,
  dados,
  posting,
}: DropdownSelectProps) => {
  const [open, setOpen] = useState(false);
  const selectedLabel =
    dados.find((item) => item.value === valorOriginal)?.label ??
    "Select framework...";
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={posting}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {selectedLabel}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Search by label..." />
          <CommandList
            className="max-h-60 "
            onWheel={(e) => {
              // stop parent listeners from hijacking the wheel
              e.stopPropagation();
            }}
          >
            <CommandEmpty>No matches found.</CommandEmpty>
            <CommandGroup>
              {dados.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.label}
                  onSelect={() => {
                    setValue(framework.value);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      valorOriginal === framework.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DropdownSelect;
