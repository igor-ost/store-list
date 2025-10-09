"use client"

import type React from "react"

import { type ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Thread = {
  id: string
  color: string
  type: string
}

type ThreadDialogProps = {
  children: ReactNode
  thread?: Thread
  onCreate: (type:string,color:string) => void
  onUpdate: (id:string,type:string,color:string) => void
}

export function ThreadDialog({ children, thread, onCreate,onUpdate }: ThreadDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Thread>(
    thread || {
      id: "",
      color: "",
      type: "",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    if (thread) {
      onUpdate(formData.id,formData.type,formData.color)
    }else{
      onCreate(formData.type,formData.color)
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
