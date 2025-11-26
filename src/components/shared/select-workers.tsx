"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { WorkersListSuccessResponse } from "@/@types/workers-types"


interface SelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  workers: WorkersListSuccessResponse
}


export function SelectWorkers({
  value,
  workers,
  onValueChange,
  placeholder = "Выберите исполнителя...",
  disabled = false,
}: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedWorker = workers.find((worker) => worker.id === value)

  const filteredWorkers = React.useMemo(() => {
    if (!searchQuery) return workers

    const query = searchQuery.toLowerCase()
    return workers.filter(
      (worker) =>
        worker.name.toLowerCase().includes(query) ||
        worker.role.toLowerCase().includes(query)
    )
  }, [searchQuery,workers])

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
          {selectedWorker ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedWorker.name}</span>
              {selectedWorker.role && (
                <span className="text-xs text-muted-foreground">({selectedWorker.role})</span>
              )}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Поиск работника..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            <CommandEmpty>Работник не найден.</CommandEmpty>
            <CommandGroup>
              {filteredWorkers.map((worker) => (
                <CommandItem
                  key={worker.id}
                  value={worker.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-medium">{worker.name}</span>
                    {worker.role && <span className="text-xs text-muted-foreground">({worker.role})</span>}
                  </div>
                  <Check className={cn("size-4 shrink-0", value === worker.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
