"use client"

import type React from "react"

import { type ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Fabric = {
  id: string
  type: string
  name: string
  color: string
  unit: string
  price: number
  qty: number
}

type FabricDialogProps = {
  children: ReactNode
  fabric?: Fabric
  onCreate: (type:string,name:string,color:string,unit:string,price:number,qty:number) => void
  onUpdate: (id:string,type:string,name:string,color:string,unit:string,price:number,qty:number) => void
}

export function FabricDialog({ children, fabric, onCreate,onUpdate }: FabricDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Fabric>(
    fabric || {
      id: "",
      type: "",
      name: "",
      color: "",
      unit: "м",
      price: 0,
      qty: 0,
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    if (fabric) {
      onUpdate(formData.id,formData.type,formData.name,formData.color,formData.unit,formData.price,formData.qty)
    }else{
      onCreate(formData.type,formData.name,formData.color,formData.unit,formData.price,formData.qty)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fabric ? "Редактировать ткань" : "Добавить ткань"}</DialogTitle>
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
            <Label htmlFor="type">Тип</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="color">Цвет</Label>
            <Input
              id="color"
              value={formData.color || ""}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="unit">Единица измерения</Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Цена</Label>
            <Input
              id="price"
              type="number"
              value={formData.price || ""}
              onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="qty">Количество</Label>
            <Input
              id="qty"
              type="number"
              value={formData.qty || ""}
              onChange={(e) => setFormData({ ...formData, qty: Number.parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit">{fabric ? "Сохранить" : "Добавить"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
