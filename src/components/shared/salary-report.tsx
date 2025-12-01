"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import { Api } from "@/service/api-clients"
import { toast } from "sonner"
import { SelectWorkers } from "@/components/shared/select-workers"
import type { WorkersListSuccessResponse } from "@/@types/workers-types"
import * as XLSX from "xlsx"
import type { GetListSuccessResponse } from "@/@types/salary-report-types"

interface SalaryReportProps {
  onBack: () => void
}

export function SalaryReport({ onBack }: SalaryReportProps) {
  const [workLogs, setWorkLogs] = useState<GetListSuccessResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedWorker, setSelectedWorker] = useState<string>("")
  const [workers, setWorkers] = useState<WorkersListSuccessResponse>([])
  const [expandedWorker, setExpandedWorker] = useState<string | null>(null)

  useEffect(() => {
    fetchReports()
    fetchWorkers()
  }, [])

  const fetchWorkers = async () => {
    setLoading(true)
    try {
      const response = await Api.workers.getList()
      if (response) {
        setWorkers(response)
      }
    } catch (error) {
      console.log(error)
      toast.error(`Не удалось загрузить заказы: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchReports = async (month?: string, workerId?: string) => {
    try {
      setLoading(true)
      const response = await Api.salaryReport.getList({ month, workerId })
      if (response) {
        setWorkLogs(response)
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    fetchReports(selectedMonth, selectedWorker)
  }

  const getOrderStatus = (log: GetListSuccessResponse): string => {
    const { requiredProducts, totalSewing, totalCutting } = log
    // Check if any work exceeds required amount
    if (totalSewing > requiredProducts || totalCutting > requiredProducts) {
      return "Перевыполнено"
    }
    // Check if all work is completed
    if (totalSewing === requiredProducts && totalCutting === requiredProducts) {
      return "Выполнен"
    }
    // Otherwise it's not completed
    return "Не завершено"
  }

  const handleExcelExport = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const workbookData: any[] = []
      workbookData.push(["ОТЧЕТ О ЗАРПЛАТЕ"])
      workbookData.push(["Дата генерации:", new Date().toLocaleDateString("ru-RU")])
      workbookData.push([])
      workbookData.push(["ИТОГОВАЯ СТАТИСТИКА"])

      const paidWorkLogs = workLogs.filter((log) => log.workType !== "buttons")
      const totalSalary = paidWorkLogs.reduce((sum, log) => sum + log.totalPrice, 0)
      const totalCompleted = paidWorkLogs.length
      const uniqueWorkers = new Set(paidWorkLogs.map((log) => log.workerId)).size

      workbookData.push(["Всего выплачено:", `₸${totalSalary.toFixed(2)}`])
      workbookData.push(["Выполнено работ:", totalCompleted])
      workbookData.push(["Работников:", uniqueWorkers])
      workbookData.push([])

      const groupedData = workLogs.reduce(
        (acc, log) => {
          const month = log.createdAt.split("T")[0].slice(0, 7)
          const key = `${log.workerName}-${month}`
          if (!acc[key]) {
            acc[key] = {
              workerName: log.workerName,
              workerId: log.workerId,
              month,
              logs: [],
              total: 0,
            }
          }
          acc[key].logs.push(log)
          if (log.workType !== "buttons") {
            acc[key].total += log.totalPrice
          }
          return acc
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as Record<string, any>,
      )

      Object.entries(groupedData).forEach(([key, data]) => {
        workbookData.push([
          `${data.workerName} - ${new Date(data.month + "-01").toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}`,
        ])
        workbookData.push([
          "Дата",
          "Заказ",
          "Продукт",
          "Тип работы",
          "Кол-во",
          "Цена/ед.",
          "Сумма",
          "Изделий требуемых",
          "Требуется пуговок",
          "Пошивов по заказу",
          "Кроев по заказу",
          "Пуговок по заказу",
          "Статус",
        ])

        data.logs.forEach((log: GetListSuccessResponse) => {
          workbookData.push([
            new Date(log.createdAt).toLocaleDateString("ru-RU"),
            log.orderNumber,
            log.productName,
            log.workType === "sewing" ? "Пошив" : log.workType === "cutting" ? "Крой" : "Пуговицы",
            log.quantity,
            log.workType === "buttons" ? 0 : log.pricePerUnit,
            log.workType === "buttons" ? 0 : log.totalPrice,
            log.requiredProducts,
            log.requiredButtons,
            log.totalSewing,
            log.totalCutting,
            log.totalButtons,
            getOrderStatus(log),
          ])
        })

        workbookData.push(["Итого:", "", "", "", "", "", data.total.toFixed(2), "", "", "", "", "", ""])
        workbookData.push([])
      })

      const ws = XLSX.utils.aoa_to_sheet(workbookData)
      ws["!cols"] = [
        { wch: 15 }, // Дата
        { wch: 12 }, // Заказ
        { wch: 25 }, // Продукт
        { wch: 15 }, // Тип работы
        { wch: 10 }, // Кол-во
        { wch: 12 }, // Цена/ед.
        { wch: 12 }, // Сумма
        { wch: 18 }, // Изделий требуемых
        { wch: 18 }, // Требуется пуговок
        { wch: 18 }, // Пошивов по заказу
        { wch: 16 }, // Кроев по заказу
        { wch: 18 }, // Пуговок по заказу
        { wch: 15 }, // Статус
      ]

      const range = XLSX.utils.decode_range(ws["!ref"] || "A1")
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_col(C) + (R + 1)
          if (!ws[cellAddress]) continue

          ws[cellAddress].z = ws[cellAddress].z || "0.00"

          if (R === 0) {
            ws[cellAddress].font = { bold: true, size: 14, color: { rgb: "FFFFFF" } }
            ws[cellAddress].fill = { fgColor: { rgb: "1F2937" } }
          }

          if (workbookData[R]?.[0]?.includes?.("ИТОГОВАЯ") || workbookData[R]?.[0]?.includes?.("-")) {
            ws[cellAddress].font = { bold: true, size: 11, color: { rgb: "FFFFFF" } }
            ws[cellAddress].fill = { fgColor: { rgb: "4B5563" } }
          }

          if (
            R > 0 &&
            [
              "Дата",
              "Заказ",
              "Продукт",
              "Тип работы",
              "Кол-во",
              "Цена/ед.",
              "Сумма",
              "Изделий требуемых",
              "Требуется пуговок",
              "Пошивов по заказу",
              "Кроев по заказу",
              "Пуговок по заказу",
              "Статус",
            ].includes(workbookData[R]?.[C])
          ) {
            ws[cellAddress].font = { bold: true, color: { rgb: "FFFFFF" } }
            ws[cellAddress].fill = { fgColor: { rgb: "5B7C99" } }
            ws[cellAddress].alignment = { horizontal: "center" }
          }

          if (workbookData[R]?.[0]?.includes?.("Итого:")) {
            ws[cellAddress].font = { bold: true, color: { rgb: "FFFFFF" } }
            ws[cellAddress].fill = { fgColor: { rgb: "10B981" } }
          }

          if (C >= 4 && R > 2) {
            ws[cellAddress].alignment = { horizontal: "right" }
          }

          ws[cellAddress].border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          }
        }
      }

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Отчет")
      XLSX.writeFile(wb, `salary-report-${new Date().toISOString().split("T")[0]}.xlsx`)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
    }
  }

  const paidWorkLogs = workLogs.filter((log) => log.workType !== "buttons")
  const groupedData = workLogs.reduce(
    (acc, log) => {
      const month = log?.createdAt?.split("T")[0].slice(0, 7)
      const key = `${log.workerName}-${month}`
      if (!acc[key]) {
        acc[key] = {
          workerName: log.workerName,
          workerId: log.workerId,
          month,
          logs: [],
          total: 0,
        }
      }
      acc[key].logs.push(log)
      if (log.workType !== "buttons") {
        acc[key].total += log.totalPrice
      }
      return acc
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as Record<string, any>,
  )

  const totalSalary = paidWorkLogs.reduce((sum, log) => sum + log.totalPrice, 0)
  const totalCompleted = paidWorkLogs.length
  const uniqueWorkers = new Set(paidWorkLogs.map((log) => log.workerId)).size

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={onBack} className="mb-4 text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к выбору отчётов
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Расчёт зарплаты</h1>
          <p className="text-green-50">Подробный отчет о заработной плате по выполненным работам</p>
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
              <label className="text-sm font-medium text-foreground mb-2 block">Работник</label>
              <SelectWorkers workers={workers} value={selectedWorker} onValueChange={setSelectedWorker} />
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
                  setSelectedWorker("")
                  fetchReports()
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
            <p className="text-sm text-green-700 font-medium mb-2">Всего выплачено</p>
            <p className="text-3xl font-bold text-green-900">
              {totalSalary.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ₸
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <p className="text-sm text-blue-700 font-medium mb-2">Выполнено работ</p>
            <p className="text-3xl font-bold text-blue-900">{totalCompleted}</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <p className="text-sm text-purple-700 font-medium mb-2">Работники</p>
            <p className="text-3xl font-bold text-purple-900">{uniqueWorkers}</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <p className="text-sm text-orange-700 font-medium mb-2">Средняя сумма</p>
            <p className="text-3xl font-bold text-orange-900">
              {totalCompleted > 0
                ? (totalSalary / totalCompleted).toLocaleString("ru-RU", { maximumFractionDigits: 2 })
                : "0"}{" "}
              ₸
            </p>
          </Card>
        </div>

        {/* Детальный отчет */}
        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Загрузка...</p>
          </Card>
        ) : workLogs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Нет данных для отображения</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedData).map(([key, data]) => (
              <Card key={key} className="overflow-hidden">
                <div
                  className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-border cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => setExpandedWorker(expandedWorker === key ? null : key)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">{data.workerName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(data.month + "-01").toLocaleDateString("ru-RU", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-2xl font-bold text-green-600">
                        {data.total.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ₸
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {data.logs.length} {data.logs.length === 1 ? "работа" : "работ"}
                      </p>
                    </div>
                    <div className="text-muted-foreground">
                      {expandedWorker === key ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Детали работ */}
                {expandedWorker === key && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Дата</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Заказ</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Продукт</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Тип</th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Кол-во</th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Цена/ед.</th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Сумма</th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Изделий треб.</th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Треб. пуговок</th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Пошивов</th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Кроев</th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Пуговок</th>
                          <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Статус</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {data.logs.map((log: GetListSuccessResponse) => (
                          <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-foreground">
                              {new Date(log.createdAt).toLocaleDateString("ru-RU")}
                            </td>
                            <td className="px-6 py-4">
                              <a
                                href={`/orders/details/${log.orderId}`}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {log.orderNumber}
                              </a>
                            </td>
                            <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">{log.productName}</td>
                            <td className="px-6 py-4">
                              <Badge
                                className={
                                  log.workType === "sewing"
                                    ? "bg-blue-100 text-blue-800"
                                    : log.workType === "cutting"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-green-100 text-green-800"
                                }
                              >
                                {log.workType === "sewing" ? "Пошив" : log.workType === "cutting" ? "Крой" : "Пуговицы"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-foreground">{log.quantity}</td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                              {log.workType === "buttons"
                                ? "—"
                                : `${log.pricePerUnit.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ₸`}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
                              {log.workType === "buttons"
                                ? "—"
                                : `${log.totalPrice.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ₸`}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                              {log.requiredProducts.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                              {log.requiredButtons.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                              {log.totalSewing.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                              {log.totalCutting.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                              {log.totalButtons.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Badge
                                className={
                                  getOrderStatus(log) === "Выполнен"
                                    ? "bg-green-100 text-green-800"
                                    : getOrderStatus(log) === "Перевыполнено"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {getOrderStatus(log)}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-t-2 border-border bg-muted/50">
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-right font-semibold text-foreground">
                            Итого за месяц:
                          </td>
                          <td className="px-6 py-4 text-right text-lg font-bold text-green-600">
                            {data.total.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ₸
                          </td>
                          <td colSpan={6}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
