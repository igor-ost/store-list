"use client"

import type React from "react"

import { type ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Velcro = {
  id: string
  name: string
}

type VelcroDialogProps = {
  children: ReactNode
  velcro?: Velcro
  onCreate: (name:string) => void
  onUpdate: (id:string,name:string) => void
}

export function VelcroDialog({ children, velcro, onCreate,onUpdate }: VelcroDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Velcro>(
    velcro || {
      id: "",
      name: "",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    if (velcro) {
      onUpdate(formData.id,formData.name)
    }else{
      onCreate(formData.name)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{velcro ? "Редактировать липучку" : "Добавить липучку"}</DialogTitle>
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
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit">{velcro ? "Сохранить" : "Добавить"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
