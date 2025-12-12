"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, ChevronDown, ChevronUp, ArrowLeft, Package } from "lucide-react"
import * as XLSX from "xlsx"
import { Api } from "@/service/api-clients"
import type { OrderReport } from "@/@types/orders-report-types"

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

  const fetchOrders = useCallback(async (month?: string, status?: string) => {
    try {
      setLoading(true)
      const response = await Api.ordersReport.getList({ status, month })
      if (response) {
        setOrders(response)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleFilter = useCallback(() => {
    fetchOrders(selectedMonth, selectedStatus)
  }, [selectedMonth, selectedStatus, fetchOrders])

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

  const handleExcelExport = useCallback(() => {
    try {
      const wb = XLSX.utils.book_new()

      const simpleData: (string | number)[][] = []

      simpleData.push(["УПРОЩЁННЫЙ ОТЧЁТ ПО ЗАКАЗАМ"])
      simpleData.push(["Дата генерации:", new Date().toLocaleDateString("ru-RU")])
      simpleData.push([])

      simpleData.push([
        "Номер заказа",
        "Продукт",
        "Требуется изделий",
        "Требуется пуговок",
        "Пошив по заказу",
        "Крой по заказу",
        "Пуговицы",
        "Статус",
      ])

      orders.forEach((order) => {
        simpleData.push([
          order.orderNumber,
          order.productName,
          order.quantity,
          order.quantityButtons,
          order.totalSewing,
          order.totalCutting,
          order.totalButtons,
          getStatusText(order.status),
        ])
      })

      simpleData.push([])
      simpleData.push(["ИТОГОВАЯ СТАТИСТИКА"])
      simpleData.push(["Всего заказов:", statistics.totalOrders])
      simpleData.push(["Завершено:", statistics.completedCount])
      simpleData.push(["В работе:", statistics.inProgressCount])
      simpleData.push(["Ожидает:", statistics.pendingCount])
      simpleData.push(["Изделий произведено:", statistics.totalItemsProduced])
      simpleData.push(["Изделий требуется:", statistics.totalItemsRequired])

      const wsSimple = XLSX.utils.aoa_to_sheet(simpleData)
      wsSimple["!cols"] = [{ wch: 18 }, { wch: 30 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 15 }]
      XLSX.utils.book_append_sheet(wb, wsSimple, "Простой отчёт")

      const detailedData: (string | number | boolean)[][] = []

      detailedData.push(["ПОЛНЫЙ ДЕТАЛЬНЫЙ ОТЧЁТ ПО ЗАКАЗАМ"])
      detailedData.push(["Дата генерации:", new Date().toLocaleDateString("ru-RU")])
      detailedData.push([])

      detailedData.push(["ИТОГОВАЯ СТАТИСТИКА"])
      detailedData.push(["Общая выручка (₸):", statistics.totalRevenue.toFixed(2)])
      detailedData.push(["Всего заказов:", statistics.totalOrders])
      detailedData.push(["Завершено:", statistics.completedCount])
      detailedData.push(["В работе:", statistics.inProgressCount])
      detailedData.push(["Ожидает:", statistics.pendingCount])
      detailedData.push(["Перепроизведено:", statistics.overproducedCount])
      detailedData.push(["Изделий произведено:", statistics.totalItemsProduced])
      detailedData.push(["Изделий требуется:", statistics.totalItemsRequired])
      detailedData.push([])

      detailedData.push([
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
        detailedData.push([
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

        if (
          order.zippers.length > 0 ||
          order.threads.length > 0 ||
          order.buttons.length > 0 ||
          order.fabrics.length > 0 ||
          order.accessories.length > 0 ||
          order.velcro.length > 0
        ) {
          detailedData.push(["МАТЕРИАЛЫ ДЛЯ " + order.orderNumber])
          if (order.zippers.length > 0) {
            detailedData.push(["Молнии:"])
            order.zippers.forEach((z) => {
              detailedData.push(["", z.type, z.color || "", z.qty, z.price || ""])
            })
          }
          if (order.threads.length > 0) {
            detailedData.push(["Нитки:"])
            order.threads.forEach((t) => {
              detailedData.push(["", t.type, t.color || "", t.qty, t.price || ""])
            })
          }
          if (order.fabrics.length > 0) {
            detailedData.push(["Ткани:"])
            order.fabrics.forEach((f) => {
              detailedData.push(["", f.type, f.color || "", f.qty, f.price || ""])
            })
          }
          if (order.buttons.length > 0) {
            detailedData.push(["Пуговицы:"])
            order.buttons.forEach((b) => {
              detailedData.push(["", b.type, b.color || "", b.qty, b.price || ""])
            })
          }
          if (order.accessories.length > 0) {
            detailedData.push(["Аксессуары:"])
            order.accessories.forEach((a) => {
              detailedData.push(["", "", a.qty, a.price || ""])
            })
          }
          if (order.velcro.length > 0) {
            detailedData.push(["Липучки:"])
            order.velcro.forEach((v) => {
              detailedData.push(["", "", v.qty, v.price || ""])
            })
          }
          detailedData.push([])
        }

        if (order.workLogs.length > 0) {
          detailedData.push(["ИСТОРИЯ РАБОТ ДЛЯ " + order.orderNumber])
          detailedData.push(["Дата", "Тип работы", "Количество", "Работник"])
          order.workLogs.forEach((log) => {
            detailedData.push([
              new Date(log.createdAt).toLocaleString("ru-RU"),
              getWorkTypeText(log.workType),
              log.quantity,
              log.workerName,
            ])
          })
          detailedData.push([])
        }
      })

      const wsDetailed = XLSX.utils.aoa_to_sheet(detailedData)
      wsDetailed["!cols"] = [
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
      XLSX.utils.book_append_sheet(wb, wsDetailed, "Полный отчёт")

      XLSX.writeFile(wb, `order-report-${new Date().toISOString().split("T")[0]}.xlsx`)
    } catch (error) {
      console.error("Error exporting Excel:", error)
    }
  }, [orders, statistics])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={onBack} className="mb-4 text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к выбору отчётов
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Отчёт по заказам</h1>
          <p className="text-orange-100">Детальная информация о заказах, материалах и производстве</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
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
            <Button variant="outline" onClick={handleExcelExport} className="gap-2 bg-orange-50 hover:bg-orange-100">
              <Download className="w-4 h-4" />
              Скачать Отчёт
            </Button>
          </div>
        </Card>

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
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Номер заказа</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Продукт</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Требуется изделий</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Пошив</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Крой</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Пуговицы</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Статус</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <>
                      <tr
                        key={order.id}
                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      >
                        <td className="px-6 py-4">
                          <span className="font-semibold text-foreground">{order.orderNumber}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">{order.productName}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-foreground">{order.quantity}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-blue-600">{order.totalSewing}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-orange-600">
                          {order.totalCutting}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                          {order.totalButtons}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {expandedOrder === order.id ? (
                            <ChevronUp className="w-5 h-5 inline" />
                          ) : (
                            <ChevronDown className="w-5 h-5 inline" />
                          )}
                        </td>
                      </tr>
                      {expandedOrder === order.id && (
                        <tr>
                          <td colSpan={8} className="bg-slate-50">
                            <div className="p-6 space-y-6">
                              <div>
                                <h4 className="font-semibold text-foreground mb-4">Основная информация</h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Клиент</p>
                                    <p className="font-medium text-foreground">{order.clientName}</p>
                                  </div>
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

                              <div className="border-t pt-4">
                                <h4 className="font-semibold text-foreground mb-4">Финансовая информация</h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Цена крой (₸)</p>
                                    <p className="text-xl font-bold text-orange-600">
                                      {order.cuttingPrice.toLocaleString("ru-RU")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Цена пошив (₸)</p>
                                    <p className="text-xl font-bold text-blue-600">
                                      {order.sewingPrice.toLocaleString("ru-RU")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Общая стоимость (₸)</p>
                                    <p className="text-xl font-bold text-green-600">
                                      {order.totalCost.toLocaleString("ru-RU")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Прогресс производства</p>
                                    <p className="text-xl font-bold text-foreground">
                                      {order.productionProgress.toFixed(1)}%
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {order.workLogs.length > 0 && (
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold text-foreground mb-4">История работ</h4>
                                  <div className="overflow-x-auto">
                                    <table className="w-full">
                                      <thead className="bg-muted">
                                        <tr>
                                          <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">
                                            Дата
                                          </th>
                                          <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">
                                            Работник
                                          </th>
                                          <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">
                                            Тип работы
                                          </th>
                                          <th className="px-4 py-2 text-right text-xs font-semibold text-foreground">
                                            Количество
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-border">
                                        {order.workLogs.map((log, idx) => (
                                          <tr key={idx} className="hover:bg-muted/50">
                                            <td className="px-4 py-2 text-sm text-foreground">
                                              {new Date(log.createdAt).toLocaleString("ru-RU")}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-foreground">{log.workerName}</td>
                                            <td className="px-4 py-2 text-sm text-foreground">
                                              {getWorkTypeText(log.workType)}
                                            </td>
                                            <td className="px-4 py-2 text-sm font-medium text-foreground text-right">
                                              {log.quantity}
                                            </td>
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
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
