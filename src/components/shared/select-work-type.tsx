"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface SelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  workType: {
    name: string;
    type: string;
}[]
}



export function SelectWorkType({
  value,
  onValueChange,
  placeholder = "Выберите тип работы...",
  disabled = false,
  workType
}: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedWorkType = workType.find((worker) => worker.type === value)

  const filteredWorkType = React.useMemo(() => {
    if (!searchQuery) return workType

    const query = searchQuery.toLowerCase()
    return workType.filter(
      (worker) =>
        worker.name.toLowerCase().includes(query) ||
        worker.type.toLowerCase().includes(query)
    )
  }, [searchQuery,workType])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between font-normal", !value && "text-muted-foreground")}
        >
          {selectedWorkType ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedWorkType.name}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Поиск тип работы..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            <CommandEmpty>Тип работы не найден.</CommandEmpty>
            <CommandGroup>
              {filteredWorkType.map((worker) => (
                <CommandItem
                  key={worker.type}
                  value={worker.type}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-medium">{worker.name}</span>
                  </div>
                  <Check className={cn("size-4 shrink-0", value === worker.type ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
