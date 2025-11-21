"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ProductDialog } from "./product-dialog"
import type { Materials } from "@/app/reference-books/page"

export type ProductsGeneral = {
  id: string
  name: string
  description: string
}

interface ProductSelectProps {
  products: ProductsGeneral[]
  materials?: Materials
  value?: string
  onValueChange: (value: string) => void
  onCreateProduct?: (name: string, description: string, materials: Materials) => void
  isLoadingCreate?: boolean
  placeholder?: string
  disabled?: boolean
}

export function ProductSelect({
  products,
  materials,
  value,
  onValueChange,
  onCreateProduct,
  isLoadingCreate = false,
  placeholder = "Выберите изделие...",
  disabled = false,
}: ProductSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)

  const selectedProduct = products.find((product) => product.id === value)

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery) return products

    const query = searchQuery.toLowerCase()
    return products.filter(
      (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
    )
  }, [products, searchQuery])

  const hasNoResults = filteredProducts.length === 0 && searchQuery

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
            {selectedProduct ? (
              <div className="flex flex-col items-start gap-0.5 text-left">
                <span className="font-medium">{selectedProduct.name}</span>
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
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {hasNoResults ? (
                <CommandEmpty className="flex flex-col gap-2 p-4">
                  <p>Изделие не найдено.</p>
                  {onCreateProduct && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-center gap-2 bg-transparent"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowCreateDialog(true)
                        setOpen(false)
                      }}
                    >
                      <Plus className="size-4" />
                      Создать {searchQuery}
                    </Button>
                  )}
                </CommandEmpty>
              ) : (
                <>
                  <CommandGroup>
                    {filteredProducts.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.id}
                        onSelect={(currentValue) => {
                          onValueChange(currentValue === value ? "" : currentValue)
                          setOpen(false)
                          setSearchQuery("")
                        }}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <span className="font-medium truncate">{product.name}</span>
                          {product.description && (
                            <span className="text-xs text-muted-foreground">{product.description}</span>
                          )}
                        </div>
                        <Check className={cn("size-4 shrink-0", value === product.id ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  {onCreateProduct && (
                    <CommandGroup>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 rounded-none border-t h-10"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setShowCreateDialog(true)
                          setOpen(false)
                        }}
                        disabled={isLoadingCreate}
                      >
                        <Plus className="size-4" />
                        Создать новое изделие
                      </Button>
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {onCreateProduct && materials && (
        <ProductDialog
          materials={materials}
          onCreate={(name, description, productMaterials) => {
            onCreateProduct(name, description, productMaterials)
            setShowCreateDialog(false)
          }}
          onUpdate={() => {}}
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          prefilledName={searchQuery}
        />
      )}
    </>
  )
}
