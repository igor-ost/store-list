"use client"

import type React from "react"

import { type ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectUnit } from "../select-unit"

type Accessory = {
  id: string
  name: string
  unit:string
  price:number
  qty: number
}

type AccessoryDialogProps = {
  children: ReactNode
  accessory?: Accessory
  onCreate: (name:string,unit:string,price:number,qty: number) => void
  onUpdate: (id:string,name:string,unit:string,price:number,qty: number) => void
}

export function AccessoryDialog({ children, accessory, onCreate,onUpdate }: AccessoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(
    accessory || {
      id: "",
      name: "",
      unit: "",
      price: 0,
      qty: 0,
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    if (accessory) {
      onUpdate(formData.id,formData.name,formData.unit,formData.price,formData.qty)
    }else{
      onCreate(formData.name,formData.unit,formData.price,formData.qty)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{accessory ? "Редактировать аксессуар" : "Добавить аксессуар"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="qty">Еденица измерения</Label>
            <SelectUnit
              value={formData.unit}
              onValueChange={(value) => setFormData({ ...formData, unit: value })}/>
          </div>
          <div>
            <Label htmlFor="price">Цена</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div>
            <Label htmlFor="qty">Количество</Label>
            <Input
              id="qty"
              type="number"
              value={formData.qty}
              onChange={(e) => setFormData({ ...formData, qty: Number.parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit">{accessory ? "Сохранить" : "Добавить"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
