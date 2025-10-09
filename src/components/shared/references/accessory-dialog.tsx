"use client"

import type React from "react"

import { type ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Accessory = {
  id: string
  name: string
  qty: number
}

type AccessoryDialogProps = {
  children: ReactNode
  accessory?: Accessory
  onCreate: (name:string,qty:number) => void
  onUpdate: (id:string,name:string,qty:number) => void
}

export function AccessoryDialog({ children, accessory, onCreate,onUpdate }: AccessoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(
    accessory || {
      id: "",
      name: "",
      qty: 0,
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    if (accessory) {
      onUpdate(formData.id,formData.name,formData.qty)
    }else{
      onCreate(formData.name,formData.qty)
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
