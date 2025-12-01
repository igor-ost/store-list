"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { SelectWorkers } from "../select-workers"
import { SelectWorkType } from "../select-work-type"
import { Api } from "@/service/api-clients"
import { WorkersListSuccessResponse } from "@/@types/workers-types"
import { GetListSuccessResponse } from "@/@types/worklog-types"


interface AddWorkLogForOrderProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  onSuccess: (log: GetListSuccessResponse) => void
}

const workType = [
  {name: "Пошив",type: "sewing"},
  {name: "Крой",type: "cutting"},
  {name: "Пуговицы",type: "buttons"},
]


export default function AddWorkLogForOrder({ isOpen, onClose, orderId, onSuccess }: AddWorkLogForOrderProps) {
  const [workers, setWorkers] = useState<WorkersListSuccessResponse>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    workerId: "",
    workType: "sewing",
    quantity: "",
  })

  useEffect(() => {
    if (isOpen) {
      fetchWorkers()
    }
  }, [isOpen])

  const fetchWorkers = async () => {
      setLoading(true)
      try {
        const response = await Api.workers.getList();
        if(response){
          setWorkers(response)
        }
      } catch (error) {
        console.log(error)
        toast.error(`Не удалось загрузить заказы: ${error}`)
      }finally{
        setLoading(false)
      }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.workerId || !formData.quantity) {
      toast.error("Заполните все поля")
      return
    }

    try {
      setSubmitting(true)
      const data = {
          orderId,
          workerId: formData.workerId,
          workType: formData.workType,
          quantity: Number.parseFloat(formData.quantity),
      }
      const response = await Api.worklog.create(data)
      if (response) {
        onSuccess(response)
        setFormData({
          workerId: "",
          workType: "sewing",
          quantity: "",
        })
        toast.success("Запись добавлена")
        onClose()
      } else {
        toast.error("Ошибка при добавлении записи")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Ошибка при добавлении записи")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить запись в журнал</DialogTitle>
          <DialogDescription>Укажите, кто и что сделал по этому заказу</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="worker">Работник</Label>
            <SelectWorkers value={formData.workerId} workers={workers}  onValueChange={(value) => setFormData({ ...formData, workerId: value })}/>
          </div>

          <div>
            <Label htmlFor="workType">Тип работы</Label>
            <SelectWorkType workType={workType} value={formData.workType} onValueChange={(value) => setFormData({ ...formData, workType: value })}/>
          </div>
          
          <div>
            <Label htmlFor="quantity">Количество</Label>
            <Input
              id="quantity"
              type="number"
              step="0.1"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Введите количество"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Добавление..." : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
