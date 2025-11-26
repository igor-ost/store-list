"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { GetListSuccessResponse } from "@/@types/worklog-types"


interface Props {
  logs: GetListSuccessResponse[]
  loading?: boolean

}


export default function WorkLogTable({ logs, loading = false }: Props) {
  const workTypeLabel = (type: string) => {
    return type === "sewing" ? "Пошив" : "Крой"
  }

  const workTypeColor = (type: string) => {
    return type === "sewing" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
  }

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </Card>
    )
  }

  if (logs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Записей не найдено</p>
      </Card>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Дата</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Заказ</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Продукт</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Клиент</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Работник</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Тип работы</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Количество</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Время</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm text-foreground">
                  {format(new Date(log.createdAt), "dd.MM.yyyy", { locale: ru })}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">{log.order.order_number}</td>
                <td className="px-6 py-4 text-sm text-foreground">{log.order.product_name}</td>
                <td className="px-6 py-4 text-sm text-foreground">{log.order.customer.name}</td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">{log.worker.name}</td>
                <td className="px-6 py-4 text-sm">
                  <Badge className={workTypeColor(log.workType)}>{workTypeLabel(log.workType)}</Badge>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground">{log.quantity}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {log.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
