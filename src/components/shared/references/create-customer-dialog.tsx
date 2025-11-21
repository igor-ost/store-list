// Alternative: Standalone dialog component for more flexibility
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (name: string, bin: string) => Promise<void>
  isLoading?: boolean
  initialName?: string
}

export function CreateCustomerDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  initialName = "",
}: CreateCustomerDialogProps) {
  const [name, setName] = React.useState(initialName)
  const [bin, setBin] = React.useState("")

  React.useEffect(() => {
    setName(initialName)
  }, [initialName, open])

  const handleSubmit = async () => {
    if (!name.trim() || !bin.trim()) return
    try {
      await onSubmit(name, bin)
      setName("")
      setBin("")
    } catch (error) {
      console.error("Failed to create customer:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать нового заказчика</DialogTitle>
          <DialogDescription>Введите информацию нового заказчика</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Название заказчика</Label>
            <Input
              id="name"
              placeholder="ООО Компания"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bin">БИН</Label>
            <Input
              id="bin"
              placeholder="12345678901234"
              value={bin}
              onChange={(e) => setBin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || !bin.trim() || isLoading}>
            {isLoading ? "Создание..." : "Создать"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
