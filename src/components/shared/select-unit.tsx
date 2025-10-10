"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type Unit = {
  id: string
  name: string
  description?: string
}

interface UnitSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const units: Unit[] = [
    { id: "pcs", name: "шт.", description: "штуки" },
    { id: "m", name: "м", description: "метры" },
    { id: "cm", name: "см", description: "сантиметры" },
    { id: "mm", name: "мм", description: "миллиметры" },
    { id: "kg", name: "кг", description: "килограммы" },
    { id: "g", name: "г", description: "граммы" },
    { id: "l", name: "л", description: "литры" },
    { id: "ml", name: "мл", description: "миллилитры" },
    { id: "m2", name: "м²", description: "квадратные метры" },
    { id: "m3", name: "м³", description: "кубические метры" },
    { id: "pack", name: "упак.", description: "упаковка" },
    { id: "set", name: "компл.", description: "комплект" },
]


export function SelectUnit({
  value,
  onValueChange,
  placeholder = "Выберите единицу измерения...",
  disabled = false,
}: UnitSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedUnit = units.find((unit) => unit.name === value)

  const filteredUnits = React.useMemo(() => {
    if (!searchQuery) return units

    const query = searchQuery.toLowerCase()
    return units.filter(
      (unit) =>
        unit.name.toLowerCase().includes(query) ||
        unit.description?.toLowerCase().includes(query)
    )
  }, [searchQuery])

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
          {selectedUnit ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedUnit.name}</span>
              {selectedUnit.description && (
                <span className="text-xs text-muted-foreground">({selectedUnit.description})</span>
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
          <CommandInput placeholder="Поиск единицы измерения..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            <CommandEmpty>Единица измерения не найдена.</CommandEmpty>
            <CommandGroup>
              {filteredUnits.map((unit) => (
                <CommandItem
                  key={unit.name}
                  value={unit.name}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-medium">{unit.name}</span>
                    {unit.description && <span className="text-xs text-muted-foreground">({unit.description})</span>}
                  </div>
                  <Check className={cn("size-4 shrink-0", value === unit.name ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
