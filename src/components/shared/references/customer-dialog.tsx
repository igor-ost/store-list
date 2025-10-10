"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit } from "lucide-react"

type Customer = {
  id: string
  name: string
  bin: string
}


interface CustomerDialogProps {
    customer?: Customer
    onCreate: (name:string,bin:string) => void
    onUpdate: (id:string,name:string,bin:string) => void
    children?: React.ReactNode;
}

export function CustomerDialog({ customer, onCreate, onUpdate,children }: CustomerDialogProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState<Customer>(
        customer || {
        id: "",
        name: "",
        bin: ""
        },
    )


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setOpen(false)
        if (customer) {
            onUpdate(formData.id,formData.name,formData.bin)
        }else{
            onCreate(formData.name,formData.bin)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="flex items-center gap-2">
                        {customer ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {customer ? "Редактировать" : "Добавить заказчика"}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{customer ? "Редактировать заказчика" : "Добавить заказчика"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Название</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Введите название заказчика"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bin">БИН</Label>
                        <Input
                            id="bin"
                            value={formData.bin}
                            onChange={(e) => setFormData({ ...formData, bin: e.target.value.replace(/\D/g, "").slice(0, 12) })}
                            placeholder="123456789012"
                            maxLength={12}
                        />
                        <div className="text-xs text-muted-foreground">БИН должен содержать 12 цифр</div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Отмена
                        </Button>
                        <Button type="submit" >
                            { customer ? "Обновить" : "Создать"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
