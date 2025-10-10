"use client"

import type React from "react"

import { type ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectUnit } from "../select-unit"

type Thread = {
  id: string
  color: string
  type: string
  unit: string
  price: number
  qty: number
}

type ThreadDialogProps = {
  children: ReactNode
  thread?: Thread
  onCreate: (type: string, color: string, unit: string, price: number, qty: number) => void
  onUpdate: (id: string, type: string, color: string, unit: string, price: number, qty: number) => void
}

export function ThreadDialog({ children, thread, onCreate, onUpdate }: ThreadDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Thread>(
    thread || {
      id: "",
      color: "",
      type: "",
      unit: "",
      price: 0,
      qty: 0
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    if (thread) {
      onUpdate(formData.id, formData.type, formData.color, formData.unit, formData.price, formData.qty)
    } else {
      onCreate(formData.type, formData.color, formData.unit, formData.price, formData.qty)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{thread ? "Редактировать нитку" : "Добавить нитку"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="color">Цвет</Label>
            <Input
              id="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
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
            <Label htmlFor="qty">Еденица измерения</Label>
            <SelectUnit
              value={formData.unit}
              onValueChange={(value) => setFormData({ ...formData, unit: value })} />
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
            <Button type="submit">{thread ? "Сохранить" : "Добавить"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
