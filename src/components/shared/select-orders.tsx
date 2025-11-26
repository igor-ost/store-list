"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { OrdersListSuccessResponse } from "@/@types/orders-types"


interface SelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  orders: OrdersListSuccessResponse
}


export function SelectOrders({
  value,
  orders,
  onValueChange,
  placeholder = "Выберите заказ...",
  disabled = false,
}: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedOrders = orders.find((order) => order.id === value)

  const filteredOrders = React.useMemo(() => {
    if (!searchQuery) return orders

    const query = searchQuery.toLowerCase()
    return orders.filter(
      (order) =>
        order.product_name.toLowerCase().includes(query) ||
        order.order_number.toLowerCase().includes(query)
    )
  }, [searchQuery,orders])

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
          {selectedOrders ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedOrders.order_number}</span>
              {selectedOrders.product_name && (
                <span className="text-xs text-muted-foreground">({selectedOrders.product_name})</span>
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
          <CommandInput placeholder="Поиск заказа..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            <CommandEmpty>Заказ не найден.</CommandEmpty>
            <CommandGroup>
              {filteredOrders.map((order) => (
                <CommandItem
                  key={order.id}
                  value={order.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-medium">{order.order_number}</span>
                    {order.product_name && <span className="text-xs text-muted-foreground">({order.product_name})</span>}
                  </div>
                  <Check className={cn("size-4 shrink-0", value === order.order_number ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
