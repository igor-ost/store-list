"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type CustomerGeneral = {
  id: string
  name: string
  bin: string
  createdAt: string
  updatedAt: string
}

interface CustomerSelectProps {
  customers: CustomerGeneral[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function CustomerSelect({
  customers,
  value,
  onValueChange,
  placeholder = "Выберите заказчика...",
  disabled = false,
}: CustomerSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedCustomer = customers.find((customer) => customer.id === value)

  const filteredCustomers = React.useMemo(() => {
    if (!searchQuery) return customers

    const query = searchQuery.toLowerCase()
    return customers.filter(
      (customer) => customer.name.toLowerCase().includes(query) || customer.bin.toLowerCase().includes(query),
    )
  }, [customers, searchQuery])

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
          {selectedCustomer ? (
            <div className="flex flex-col items-start gap-0.5 text-left">
              <span className="font-medium">{selectedCustomer.name}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Поиск по названию или БИН..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            <CommandEmpty>Заказчик не найден.</CommandEmpty>
            <CommandGroup>
              {filteredCustomers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="font-medium truncate">{customer.name}</span>
                    {customer.bin && (
                      <span className="text-xs text-muted-foreground">БИН: {customer.bin}</span>
                    )}
                  </div>
                  <Check className={cn("size-4 shrink-0", value === customer.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
