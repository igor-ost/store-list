"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface OrderMaterialItemProps {
  name?: string
  type?: string
  color?: string
  qty: number
  unit?: string
  price?: number
  onQtyChange: (newQty: number) => void
  onDelete: () => void
}

export function OrderMaterialItem({
  name,
  type,
  color,
  qty,
  unit = "шт",
  price,
  onQtyChange,
  onDelete,
}: OrderMaterialItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 border rounded-lg">
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-slate-600">
          {type && `Тип: ${type}`}
          {color && ` • Цвет: ${color}`}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24">
          <Label htmlFor={`qty-${name}`} className="sr-only">
            Количество
          </Label>
          <Input
            id={`qty-${name}`}
            type="number"
            min="0"
            step="1"
            value={qty}
            onChange={(e) => onQtyChange(Number.parseFloat(e.target.value) || 0)}
            className="text-center"
          />
        </div>
        <div className="text-right min-w-20">
          <p className="text-sm font-medium">{unit}</p>
          {price && <p className="text-sm text-slate-600">{price} тг</p>}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
