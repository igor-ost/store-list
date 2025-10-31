"use client"

import { useState, useMemo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Scissors, Shirt, Circle, Palette, Grip, StickyNote, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Materials } from "@/app/reference-books/page"

interface LoadedMaterial {
  id: string
  qty: number
  name: string
  color?: string
  type?: string
  unit?: string
  price?: number
}

interface LoadedProductMaterials {
  zippers: LoadedMaterial[]
  threads: LoadedMaterial[]
  buttons: LoadedMaterial[]
  fabrics: LoadedMaterial[]
  accessories: LoadedMaterial[]
  velcro: LoadedMaterial[]
}

export function ProductMaterialDialog({
  materials,
  children,
  handleAdd,
}: { materials: Materials;children?:ReactNode; handleAdd: (id: string, qty: number,type: keyof LoadedProductMaterials) => void }) {
  const [open, setOpen] = useState(false)
  const [typePopoverOpen, setTypePopoverOpen] = useState(false)
  const [materialPopoverOpen, setMaterialPopoverOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<keyof Materials>("zippers")
  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [qty, setQty] = useState<number>(0)

  const materialTypes = [
    { value: "zippers", label: "Молния", icon: Scissors },
    { value: "threads", label: "Нитки", icon: Grip },
    { value: "buttons", label: "Пуговицы", icon: Circle },
    { value: "fabrics", label: "Ткань", icon: Shirt },
    { value: "accessories", label: "Фурнитура", icon: Palette },
    { value: "velcro", label: "Велкро", icon: StickyNote },
  ] as const

  const filteredMaterials = useMemo(() => {
    const results: Array<{ id: string; label: string; type: string; typeLabel: string }> = []

    
    const addMaterials = (
      items: any[] | undefined,  // eslint-disable-line @typescript-eslint/no-explicit-any
      type: string,
      typeLabel: string,
      formatter: (item: any) => string,  // eslint-disable-line @typescript-eslint/no-explicit-any
    ) => {
      if (!items) return
      items.forEach((item) => {
        const label = formatter(item)
        results.push({ id: String(item.id), label, type, typeLabel })
      })
    }
    // ...

    if (selectedType === "zippers") {
      addMaterials(materials.zippers, "zippers", "Молния", (item) => `${item.color} ${item.type}`)
    }
    if (selectedType === "threads") {
      addMaterials(materials.threads, "threads", "Нитки", (item) => `${item.color} ${item.type}`)
    }
    if (selectedType === "buttons") {
      addMaterials(materials.buttons, "buttons", "Пуговицы", (item) => `${item.color} ${item.type}`)
    }
    if (selectedType === "fabrics") {
      addMaterials(materials.fabrics, "fabrics", "Ткань", (item) => `${item.name} ${item.color}`)
    }
    if (selectedType === "accessories") {
      addMaterials(materials.accessories, "accessories", "Фурнитура", (item) => item.name)
    }
    if (selectedType === "velcro") {
      addMaterials(materials.velcro, "velcro", "Велкро", (item) => item.name)
    }

    return results
  }, [materials, selectedType])

  const getCurrentTypeIcon = () => {
    const type = materialTypes.find((t) => t.value === selectedType)
    return type?.icon || Palette
  }

  const getCurrentTypeLabel = () => {
    const type = materialTypes.find((t) => t.value === selectedType)
    return type?.label || "Выберите тип"
  }

  const getSelectedMaterialLabel = () => {
    const material = filteredMaterials.find((m) => m.id === selectedMaterial)
    return material ? material.label : "Выберите материал"
  }

  const CurrentIcon = getCurrentTypeIcon()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          {children ? children : <Button>Добавить</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl">Добавить материал</DialogTitle>
          <DialogDescription className="text-base">
            Выберите тип материала, название и укажите количество
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="material-type" className="text-sm font-medium">
              Тип материала
            </Label>
            <Popover open={typePopoverOpen} onOpenChange={setTypePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={typePopoverOpen}
                  className="w-full justify-between font-normal bg-transparent"
                >
                  <div className="flex items-center gap-2">
                    <CurrentIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{getCurrentTypeLabel()}</span>
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Поиск типа материала..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Тип не найден</CommandEmpty>
                    <CommandGroup>
                      {materialTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <CommandItem
                            key={type.value}
                            value={type.value}
                            onSelect={(value) => {
                              const currentValue = value as keyof Materials
                              setSelectedType(currentValue)
                              setSelectedMaterial("")
                              setTypePopoverOpen(false)
                            }}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span>{type.label}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedType === type.value ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="material-select" className="text-sm font-medium">
              Выбор материала
            </Label>
            <Popover open={materialPopoverOpen} onOpenChange={setMaterialPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={materialPopoverOpen}
                  className="w-full justify-between text-base font-normal bg-transparent"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CurrentIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{getSelectedMaterialLabel()}</span>
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Поиск материала..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Материал не найден</CommandEmpty>
                    <CommandGroup>
                      {filteredMaterials.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={`${item.id}-${item.label}`}
                          onSelect={() => {
                            setSelectedMaterial(item.id)
                            setMaterialPopoverOpen(false)
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-2 flex-1 min-w-0">
                            <span className="truncate">{item.label}</span>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4 shrink-0",
                              selectedMaterial === item.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="material-qty" className="text-sm font-medium">
              Количество 
            </Label>
            <div className="relative">
              <Input
                id="material-qty"
                type="number"
                min="0"
                step="0.01"
                value={qty || ""}
                onChange={(e) => setQty(Number.parseFloat(e.target.value) || 0)}
                placeholder="Введите количество"
                className="text-base"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => {
                handleAdd(selectedMaterial, qty, selectedType)
                setOpen(false)
                setSelectedMaterial("")
                setQty(0)
              }}
              className="w-full h-11 text-base font-medium"
              disabled={!selectedMaterial || qty <= 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              Добавить материал
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
