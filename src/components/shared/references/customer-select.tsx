"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OrdersDialog } from "./orders-dialog"

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
  onCreateCustomer?: (name: string, bin: string) => Promise<void>
  isLoadingCreate?: boolean
}

export function CustomerSelect({
  customers = [],
  value,
  onValueChange,
  placeholder = "Выберите заказчика...",
  disabled = false,
  onCreateCustomer,
  isLoadingCreate = false,
}: CustomerSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [createName, setCreateName] = React.useState("")
  const [createBin, setCreateBin] = React.useState("")

  const safeCustomers = Array.isArray(customers) ? customers : []
  const selectedCustomer = safeCustomers.find((customer) => customer.id === value)

  const filteredCustomers = React.useMemo(() => {
    if (!searchQuery) return safeCustomers

    const query = searchQuery.toLowerCase()
    return safeCustomers.filter(
      (customer) => customer.name.toLowerCase().includes(query) || customer.bin.toLowerCase().includes(query),
    )
  }, [safeCustomers, searchQuery])

  const handleCreateCustomer = async () => {
    if (!createName.trim() || !createBin.trim()) return

    try {
      if (onCreateCustomer) {
        await onCreateCustomer(createName, createBin)
      }
      setCreateName("")
      setCreateBin("")
      setIsCreateDialogOpen(false)
      setSearchQuery("")
    } catch (error) {
      console.error("Failed to create customer:", error)
    }
  }

  return (
    <>
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
            <CommandInput
              placeholder="Поиск по названию или БИН..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {filteredCustomers.length === 0 ? (
                <CommandEmpty>
                  <div className="flex flex-col gap-3 py-2">
                    <p className="text-sm text-muted-foreground">Заказчик не найден.</p>
                    {onCreateCustomer && searchQuery.trim() && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full justify-start gap-2 bg-transparent"
                        onClick={() => {
                          setCreateName(searchQuery)
                          setIsCreateDialogOpen(true)
                        }}
                      >
                        <Plus className="size-4" />
                        Создать {searchQuery}
                      </Button>
                    )}
                  </div>
                </CommandEmpty>
              ) : (
                <>
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
                          {customer.bin && <span className="text-xs text-muted-foreground">БИН: {customer.bin}</span>}
                        </div>
                        <Check className={cn("size-4 shrink-0", value === customer.id ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {onCreateCustomer && (
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => setIsCreateDialogOpen(true)}
                        className="flex items-center justify-start gap-2 cursor-pointer text-primary hover:text-primary"
                      >
                        <Plus className="size-4" />
                        <span>Создать нового заказчика</span>
                      </CommandItem>
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCustomer && (
        <div className="flex gap-2">
          <OrdersDialog customerName={selectedCustomer.name} customerId={selectedCustomer.id}/>
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать нового заказчика</DialogTitle>
            <DialogDescription>Введите информацию нового заказчика</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer-name">Название заказчика</Label>
              <Input
                id="customer-name"
                placeholder="ООО Компания"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateCustomer()
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-bin">БИН</Label>
              <Input
                id="customer-bin"
                placeholder="12345678901234"
                value={createBin}
                onChange={(e) => setCreateBin(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateCustomer()
                }}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleCreateCustomer}
              disabled={!createName.trim() || !createBin.trim() || isLoadingCreate}
            >
              {isLoadingCreate ? "Создание..." : "Создать"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
