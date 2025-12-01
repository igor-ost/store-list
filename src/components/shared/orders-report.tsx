"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, ChevronDown, ChevronUp, ArrowLeft, Package } from "lucide-react"
import * as XLSX from "xlsx"
import { Api } from "@/service/api-clients"
import { OrderReport } from "@/@types/orders-report-types"



interface OrdersReportProps {
  onBack: () => void
}

export function OrdersReport({ onBack }: OrdersReportProps) {
  const [orders, setOrders] = useState<OrderReport[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async (month?: string, status?: string) => {
    try {
      setLoading(true);
      const response = await Api.ordersReport.getList({ status, month })
      if (response){
        setOrders(response)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    fetchOrders(selectedMonth, selectedStatus)
  }

  const statistics = useMemo(() => {
    return {
      totalRevenue: orders.reduce((sum, order) => sum + order.totalCost, 0),
      totalOrders: orders.length,
      completedCount: orders.filter((o) => o.status === "completed").length,
      inProgressCount: orders.filter((o) => o.status === "in-progress").length,
      pendingCount: orders.filter((o) => o.status === "pending").length,
      overproducedCount: orders.filter((o) => o.status === "overproduced").length,
      totalItemsProduced: orders.reduce((sum, order) => sum + order.completedProducts, 0),
      totalItemsRequired: orders.reduce((sum, order) => sum + order.quantity, 0),
    }
  }, [orders])

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Ожидает",
      "in-progress": "В работе",
      completed: "Завершён",
      overproduced: "Перепроизведено",
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      overproduced: "bg-purple-100 text-purple-800",
    }
    return colorMap[status] || "bg-gray-100 text-gray-800"
  }

  const getWorkTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      cutting: "Крой",
      sewing: "Пошив",
      buttons: "Пуговицы",
    }
    return typeMap[type] || type
  }

  const handleExcelExport = () => {
    try {
      const workbookData: (string | number | boolean)[][] = []

      workbookData.push(["ПОЛНЫЙ ОТЧЁТ ПО ЗАКАЗАМ"])
      workbookData.push(["Дата генерации:", new Date().toLocaleDateString("ru-RU")])
      workbookData.push([])

      workbookData.push(["ИТОГОВАЯ СТАТИСТИКА"])
      workbookData.push(["Общая выручка (₸):", statistics.totalRevenue.toFixed(2)])
      workbookData.push(["Всего заказов:", statistics.totalOrders])
      workbookData.push(["Завершено:", statistics.completedCount])
      workbookData.push(["В работе:", statistics.inProgressCount])
      workbookData.push(["Ожидает:", statistics.pendingCount])
      workbookData.push(["Перепроизведено:", statistics.overproducedCount])
      workbookData.push(["Изделий произведено:", statistics.totalItemsProduced])
      workbookData.push(["Изделий требуется:", statistics.totalItemsRequired])
      workbookData.push([])

      // Main orders table
      workbookData.push([
        "Номер заказа",
        "Клиент",
        "БИН",
        "Дата создания",
        "Продукт",
        "Требуется",
        "Произведено",
        "Прогресс %",
        "Цена крой",
        "Цена пошив",
        "Итого (₸)",
        "Статус",
        "Всего пошивов",
        "Всего кроев",
        "Всего пуговок",
        "Требуемых пуговок",
      ])

      orders.forEach((order) => {
        workbookData.push([
          order.orderNumber,
          order.clientName,
          order.clientBin,
          new Date(order.createdAt).toLocaleDateString("ru-RU"),
          order.productName,
          order.quantity,
          order.completedProducts,
          order.productionProgress.toFixed(2),
          order.cuttingPrice,
          order.sewingPrice,
          order.totalCost,
          getStatusText(order.status),
          order.totalSewing,
          order.totalCutting,
          order.totalButtons,
          order.quantityButtons,
        ])

        // Add materials section
        if (
          order.zippers.length > 0 ||
          order.threads.length > 0 ||
          order.buttons.length > 0 ||
          order.fabrics.length > 0 ||
          order.accessories.length > 0 ||
          order.velcro.length > 0
        ) {
          workbookData.push(["МАТЕРИАЛЫ ДЛЯ " + order.orderNumber])
          if (order.zippers.length > 0) {
            workbookData.push(["Молнии:"])
            order.zippers.forEach((z) => {
              workbookData.push(["", z.type, z.color || "", z.qty, z.price || ""])
            })
          }
          if (order.threads.length > 0) {
            workbookData.push(["Нитки:"])
            order.threads.forEach((t) => {
              workbookData.push(["", t.type, t.color || "", t.qty, t.price || ""])
            })
          }
          if (order.fabrics.length > 0) {
            workbookData.push(["Ткани:"])
            order.fabrics.forEach((f) => {
              workbookData.push(["", f.type, f.color || "", f.qty, f.price || ""])
            })
          }
          workbookData.push([])
        }

        // Add work logs
        if (order.workLogs.length > 0) {
          workbookData.push(["ИСТОРИЯ РАБОТ ДЛЯ " + order.orderNumber])
          workbookData.push(["Дата", "Тип работы", "Количество", "Работник"])
          order.workLogs.forEach((log) => {
            workbookData.push([
              new Date(log.createdAt).toLocaleString("ru-RU"),
              getWorkTypeText(log.workType),
              log.quantity,
              log.workerName,
            ])
          })
          workbookData.push([])
        }
      })

      const ws = XLSX.utils.aoa_to_sheet(workbookData)
      ws["!cols"] = [
        { wch: 18 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
      ]
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Отчёт")
      XLSX.writeFile(wb, `order-report-${new Date().toISOString().split("T")[0]}.xlsx`)
    } catch (error) {
      console.error("Error exporting Excel:", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={onBack} className="mb-4 text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к выбору отчётов
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Полный отчёт по заказам</h1>
          <p className="text-orange-100">Детальная информация о заказах, материалах и производстве</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Фильтры */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Месяц</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Статус</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Все статусы</option>
                <option value="pending">Ожидает</option>
                <option value="in-progress">В работе</option>
                <option value="completed">Завершён</option>
                <option value="overproduced">Перепроизведено</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleFilter} className="gap-2">
                <Filter className="w-4 h-4" />
                Применить
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedMonth("")
                  setSelectedStatus("")
                  fetchOrders()
                }}
              >
                Сбросить
              </Button>
            </div>
            <Button variant="outline" onClick={handleExcelExport} className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Скачать Отчёт
            </Button>
          </div>
        </Card>

        {/* Основная статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <p className="text-sm text-green-700 font-medium mb-2">Общая выручка</p>
            <p className="text-3xl font-bold text-green-900">
              {statistics.totalRevenue.toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₸
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <p className="text-sm text-blue-700 font-medium mb-2">Всего заказов</p>
            <p className="text-3xl font-bold text-blue-900">{statistics.totalOrders}</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <p className="text-sm text-purple-700 font-medium mb-2">Произведено / Требуется</p>
            <p className="text-3xl font-bold text-purple-900">
              {statistics.totalItemsProduced} / {statistics.totalItemsRequired}
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <p className="text-sm text-orange-700 font-medium mb-2">Статус выполнения</p>
            <p className="text-3xl font-bold text-orange-900">
              {statistics.totalOrders > 0
                ? ((statistics.completedCount / statistics.totalOrders) * 100).toFixed(0)
                : "0"}
              %
            </p>
          </Card>
        </div>

        {/* Детальный отчет */}
        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Загрузка...</p>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Нет данных для отображения</p>
          </Card>
        ) : (
          <div className="overflow-x-auto">

                {orders.map((order,index) => (
                  <div key={index} className="w-full bg-white p-2">
                    <tr
                      key={order.id}
                      className="hover:bg-muted/50 transition-colors cursor-pointer w-full"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{order.clientName}</td>
                      <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">{order.productName}</td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-foreground">{order.quantity}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                        {order.completedProducts}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                        {order.productionProgress.toFixed(0)}%
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                        {order.cuttingPrice.toLocaleString("ru-RU")} ₸
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                        {order.sewingPrice.toLocaleString("ru-RU")} ₸
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
                        {order.totalCost.toLocaleString("ru-RU")} ₸
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan={12}>
                          <div className="bg-white p-6 space-y-6">
                            {/* Basic info */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-4">Основная информация</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">БИН клиента</p>
                                  <p className="font-medium text-foreground">{order.clientBin}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Требуемых пуговок</p>
                                  <p className="font-medium text-foreground">{order.quantityButtons}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Дата создания</p>
                                  <p className="font-medium text-foreground">
                                    {new Date(order.createdAt).toLocaleString("ru-RU")}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Production stats */}
                            <div className="border-t pt-4">
                              <h4 className="font-semibold text-foreground mb-4">Статистика производства</h4>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Всего пошивов</p>
                                  <p className="text-xl font-bold text-blue-600">{order.totalSewing}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Всего кроев</p>
                                  <p className="text-xl font-bold text-orange-600">{order.totalCutting}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Всего пуговок</p>
                                  <p className="text-xl font-bold text-green-600">{order.totalButtons}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">% Выполнения</p>
                                  <p className="text-xl font-bold text-purple-600">
                                    {order.productionProgress.toFixed(0)}%
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Materials */}
                            {(order.zippers.length > 0 ||
                              order.threads.length > 0 ||
                              order.buttons.length > 0 ||
                              order.fabrics.length > 0 ||
                              order.accessories.length > 0 ||
                              order.velcro.length > 0) && (
                              <div className="border-t pt-4">
                                <h4 className="font-semibold text-foreground mb-4">Материалы</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {order.zippers.length > 0 && (
                                    <div className="bg-slate-50 p-4 rounded-md">
                                      <p className="text-sm font-semibold text-foreground mb-2">Молнии</p>
                                      {order.zippers.map((z) => (
                                        <p key={z.id} className="text-xs text-muted-foreground">
                                          {z.type} {z.color ? `(${z.color})` : ""} - {z.qty} шт.{" "}
                                          {z.price ? `(${z.price} ₸)` : ""}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                  {order.threads.length > 0 && (
                                    <div className="bg-slate-50 p-4 rounded-md">
                                      <p className="text-sm font-semibold text-foreground mb-2">Нитки</p>
                                      {order.threads.map((t) => (
                                        <p key={t.id} className="text-xs text-muted-foreground">
                                          {t.type} {t.color ? `(${t.color})` : ""} - {t.qty} шт.{" "}
                                          {t.price ? `(${t.price} ₸)` : ""}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                  {order.fabrics.length > 0 && (
                                    <div className="bg-slate-50 p-4 rounded-md">
                                      <p className="text-sm font-semibold text-foreground mb-2">Ткани</p>
                                      {order.fabrics.map((f) => (
                                        <p key={f.id} className="text-xs text-muted-foreground">
                                          {f.name} {f.color ? `(${f.color})` : ""} - {f.qty} шт.{" "}
                                          {f.price ? `(${f.price} ₸)` : ""}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                  {order.buttons.length > 0 && (
                                    <div className="bg-slate-50 p-4 rounded-md">
                                      <p className="text-sm font-semibold text-foreground mb-2">Пуговицы</p>
                                      {order.buttons.map((b) => (
                                        <p key={b.id} className="text-xs text-muted-foreground">
                                          {b.type} {b.color ? `(${b.color})` : ""} - {b.qty} шт.{" "}
                                          {b.price ? `(${b.price} ₸)` : ""}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                  {order.accessories.length > 0 && (
                                    <div className="bg-slate-50 p-4 rounded-md">
                                      <p className="text-sm font-semibold text-foreground mb-2">Аксессуары</p>
                                      {order.accessories.map((a) => (
                                        <p key={a.id} className="text-xs text-muted-foreground">
                                          {a.name} - {a.qty} шт. {a.price ? `(${a.price} ₸)` : ""}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                  {order.velcro.length > 0 && (
                                    <div className="bg-slate-50 p-4 rounded-md">
                                      <p className="text-sm font-semibold text-foreground mb-2">Велкро</p>
                                      {order.velcro.map((v) => (
                                        <p key={v.id} className="text-xs text-muted-foreground">
                                          {v.name} - {v.qty} шт. {v.price ? `(${v.price} ₸)` : ""}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Work logs */}
                            {order.workLogs.length > 0 && (
                              <div className="border-t pt-4">
                                <h4 className="font-semibold text-foreground mb-4">
                                  История работ ({order.workLogs.length})
                                </h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead className="bg-muted/50 border-b border-border">
                                      <tr>
                                        <th className="px-4 py-2 text-left font-medium text-foreground">Дата</th>
                                        <th className="px-4 py-2 text-left font-medium text-foreground">Тип работы</th>
                                        <th className="px-4 py-2 text-left font-medium text-foreground">Количество</th>
                                        <th className="px-4 py-2 text-left font-medium text-foreground">Работник</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                      {order.workLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-muted/30">
                                          <td className="px-4 py-2 text-foreground">
                                            {new Date(log.createdAt).toLocaleString("ru-RU")}
                                          </td>
                                          <td className="px-4 py-2">
                                            <Badge
                                              className={
                                                log.workType === "sewing"
                                                  ? "bg-blue-100 text-blue-800"
                                                  : log.workType === "cutting"
                                                    ? "bg-orange-100 text-orange-800"
                                                    : "bg-green-100 text-green-800"
                                              }
                                            >
                                              {getWorkTypeText(log.workType)}
                                            </Badge>
                                          </td>
                                          <td className="px-4 py-2 font-medium text-foreground">{log.quantity} шт.</td>
                                          <td className="px-4 py-2 text-foreground">{log.workerName}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </div>
                ))}

          </div>
        )}
      </main>
    </div>
  )
}
