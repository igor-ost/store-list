"use client"

import type React from "react"

import { type ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Zipper = {
  id: string
  color: string
  type: string
  qty: number
}

type ZipperDialogProps = {
  children: ReactNode
  zipper?: Zipper
  onCreate: (color:string,type:string,qty:number) => void
  onUpdate: (id:string,color:string,type:string,qty:number) => void
}

export function ZipperDialog({ children, zipper, onCreate,onUpdate }: ZipperDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Zipper>(
    zipper || {
      id: "",
      color: "",
      type: "",
      qty: 0,
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    if (zipper) {
      onUpdate(formData.id,formData.color,formData.type,formData.qty)
    }else{
      onCreate(formData.color,formData.type,formData.qty)
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{zipper ? "Редактировать молнию" : "Добавить молнию"}</DialogTitle>
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
            <Button type="submit">{zipper ? "Сохранить" : "Добавить"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
