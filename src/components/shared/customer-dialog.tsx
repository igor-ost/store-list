"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus, Edit } from "lucide-react"
import { GetListSuccessResponse } from "@/@types/customer-types"
import { Api } from "@/service/api-clients"



interface CustomerDialogProps {
    customer?: GetListSuccessResponse
    onCustomerSaved: (customer: GetListSuccessResponse) => void
    children?: React.ReactNode;
}

export function CustomerDialog({ customer, onCustomerSaved, children }: CustomerDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: customer?.name || "",
        bin: customer?.bin || "",
    })

    const isEditing = !!customer

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await Api.customers.create(formData)
            onCustomerSaved(response)
            setOpen(false)
            setFormData({ name: "", bin: "" })
            toast.success(`Заказчик ${formData.name}, создан`)
        } catch (error) {
            toast.error(`Ошибка: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            setFormData({
                name: customer?.name || "",
                bin: customer?.bin || "",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="flex items-center gap-2">
                        {isEditing ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isEditing ? "Редактировать" : "Добавить заказчика"}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Редактировать заказчика" : "Добавить заказчика"}</DialogTitle>
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
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            Отмена
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Сохранение..." : isEditing ? "Обновить" : "Создать"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
