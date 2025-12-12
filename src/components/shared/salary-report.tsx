/* eslint-disable */
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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

  const handleFilter = useCallback(() => {
    fetchReports(selectedMonth, selectedWorker)
  }, [selectedMonth, selectedWorker])

  const getOrderStatus = (log: GetListSuccessResponse): string => {
    const { requiredProducts, totalSewing, totalCutting } = log
    if (totalSewing > requiredProducts || totalCutting > requiredProducts) {
      return "Перевыполнено"
    }
    if (totalSewing === requiredProducts && totalCutting === requiredProducts) {
      return "Выполнен"
    }
    return "Не завершено"
  }

  const handleExcelExport = useCallback(async () => {
    try {
      const wb = XLSX.utils.book_new()

      const simpleData: any[] = []

      simpleData.push(["ОТЧЁТ О ЗАРПЛАТЕ СОТРУДНИКОВ"])
      simpleData.push([])
      simpleData.push(["Дата формирования:", new Date().toLocaleDateString("ru-RU")])
      simpleData.push([])

      const groupedByWorkerMonth = workLogs.reduce(
        (acc, log) => {
          if (log.workType === "buttons") return acc

          const month = log.createdAt.split("T")[0].slice(0, 7)
          const key = `${log.workerId}-${month}`

          if (!acc[key]) {
            acc[key] = {
              workerName: log.workerName,
              month,
              salary: 0,
            }
          }
          acc[key].salary += log.totalPrice
          return acc
        },
        {} as Record<string, any>,
      )

      simpleData.push(["ФИО", "Должность", "Зарплата", "Период"])

      Object.values(groupedByWorkerMonth).forEach((data: any) => {
        const monthName = new Date(data.month + "-01").toLocaleDateString("ru-RU", {
          month: "long",
          year: "numeric",
        })
        simpleData.push([
          data.workerName,
          "Швея",
          `${data.salary.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ₸`,
          monthName,
        ])
      })

      simpleData.push([])

      const totalSalarySum = Object.values(groupedByWorkerMonth).reduce(
        (sum: number, data: any) => sum + data.salary,
        0,
      )
      simpleData.push(["ИТОГО:", "", `${totalSalarySum.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ₸`, ""])

      const ws1 = XLSX.utils.aoa_to_sheet(simpleData)

      ws1["!cols"] = [{ wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 25 }]

      const range1 = XLSX.utils.decode_range(ws1["!ref"] || "A1")
      for (let R = range1.s.r; R <= range1.e.r; ++R) {
        for (let C = range1.s.c; C <= range1.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_col(C) + (R + 1)
          if (!ws1[cellAddress]) continue

          if (R === 0) {
            ws1[cellAddress].s = {
              font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: "059669" } },
              alignment: { horizontal: "center", vertical: "center" },
            }
          }

          if (R === 2 && C === 0) {
            ws1[cellAddress].s = {
              font: { bold: true, sz: 11 },
            }
          }

          if (R === 4) {
            ws1[cellAddress].s = {
              font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: "10B981" } },
              alignment: { horizontal: "center", vertical: "center" },
              border: {
                top: { style: "medium", color: { rgb: "000000" } },
                bottom: { style: "medium", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
              },
            }
          }

          if (R > 4 && R < range1.e.r) {
            ws1[cellAddress].s = {
              font: { sz: 11 },
              alignment: {
                horizontal: C === 0 ? "left" : C === 2 ? "right" : "center",
                vertical: "center",
              },
              border: {
                top: { style: "thin", color: { rgb: "CCCCCC" } },
                bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                left: { style: "thin", color: { rgb: "CCCCCC" } },
                right: { style: "thin", color: { rgb: "CCCCCC" } },
              },
            }

            if ((R - 5) % 2 === 0) {
              ws1[cellAddress].s.fill = { fgColor: { rgb: "F0FDF4" } }
            }
          }

          if (simpleData[R]?.[0] === "ИТОГО:") {
            ws1[cellAddress].s = {
              font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: "059669" } },
              alignment: { horizontal: C === 2 ? "right" : "center", vertical: "center" },
              border: {
                top: { style: "medium", color: { rgb: "000000" } },
                bottom: { style: "medium", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
              },
            }
          }
        }
      }

      ws1["!rows"] = [{ hpt: 30 }, { hpt: 5 }, { hpt: 20 }, { hpt: 5 }, { hpt: 25 }]

      XLSX.utils.book_append_sheet(wb, ws1, "Сводка по зарплате")

      const detailedData: any[] = []
      detailedData.push(["ДЕТАЛЬНЫЙ ОТЧЁТ О ВЫПОЛНЕННЫХ РАБОТАХ"])
      detailedData.push(["Дата генерации:", new Date().toLocaleDateString("ru-RU")])
      detailedData.push([])
      detailedData.push(["ИТОГОВАЯ СТАТИСТИКА"])

      const paidWorkLogs = workLogs.filter((log) => log.workType !== "buttons")
      const totalSalary = paidWorkLogs.reduce((sum, log) => sum + log.totalPrice, 0)
      const totalCompleted = paidWorkLogs.length
      const uniqueWorkers = new Set(paidWorkLogs.map((log) => log.workerId)).size

      detailedData.push(["Всего выплачено:", `₸${totalSalary.toFixed(2)}`])
      detailedData.push(["Выполнено работ:", totalCompleted])
      detailedData.push(["Работников:", uniqueWorkers])
      detailedData.push([])

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
        {} as Record<string, any>,
      )

      Object.entries(groupedData).forEach(([key, data]) => {
        detailedData.push([
          `${data.workerName} - ${new Date(data.month + "-01").toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}`,
        ])
        detailedData.push([
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
          detailedData.push([
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

        detailedData.push(["Итого:", "", "", "", "", "", data.total.toFixed(2), "", "", "", "", "", ""])
        detailedData.push([])
      })

      const ws2 = XLSX.utils.aoa_to_sheet(detailedData)
      ws2["!cols"] = [
        { wch: 15 },
        { wch: 12 },
        { wch: 25 },
        { wch: 15 },
        { wch: 10 },
        { wch: 12 },
        { wch: 12 },
        { wch: 18 },
        { wch: 18 },
        { wch: 18 },
        { wch: 16 },
        { wch: 18 },
        { wch: 15 },
      ]

      const range2 = XLSX.utils.decode_range(ws2["!ref"] || "A1")
      for (let R = range2.s.r; R <= range2.e.r; ++R) {
        for (let C = range2.s.c; C <= range2.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_col(C) + (R + 1)
          if (!ws2[cellAddress]) continue

          ws2[cellAddress].z = ws2[cellAddress].z || "0.00"

          if (R === 0) {
            ws2[cellAddress].font = { bold: true, size: 14, color: { rgb: "FFFFFF" } }
            ws2[cellAddress].fill = { fgColor: { rgb: "1F2937" } }
          }

          if (detailedData[R]?.[0]?.includes?.("ИТОГОВАЯ") || detailedData[R]?.[0]?.includes?.("-")) {
            ws2[cellAddress].font = { bold: true, size: 11, color: { rgb: "FFFFFF" } }
            ws2[cellAddress].fill = { fgColor: { rgb: "4B5563" } }
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
            ].includes(detailedData[R]?.[C])
          ) {
            ws2[cellAddress].font = { bold: true, color: { rgb: "FFFFFF" } }
            ws2[cellAddress].fill = { fgColor: { rgb: "5B7C99" } }
            ws2[cellAddress].alignment = { horizontal: "center" }
          }

          if (detailedData[R]?.[0]?.includes?.("Итого:")) {
            ws2[cellAddress].font = { bold: true, color: { rgb: "FFFFFF" } }
            ws2[cellAddress].fill = { fgColor: { rgb: "10B981" } }
          }

          if (C >= 4 && R > 2) {
            ws2[cellAddress].alignment = { horizontal: "right" }
          }

          ws2[cellAddress].border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          }
        }
      }

      XLSX.utils.book_append_sheet(wb, ws2, "Детальный отчёт")

      XLSX.writeFile(wb, `salary-report-${new Date().toISOString().split("T")[0]}.xlsx`)
      toast.success("Отчёт успешно экспортирован!")
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      toast.error("Ошибка при экспорте отчёта")
    }
  }, [workLogs])

  const paidWorkLogs = useMemo(() => workLogs.filter((log) => log.workType !== "buttons"), [workLogs])
  const groupedData = useMemo(() => {
    return workLogs.reduce(
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
      {} as Record<string, any>,
    )
  }, [workLogs])

  const totalSalary = useMemo(() => paidWorkLogs.reduce((sum, log) => sum + log.totalPrice, 0), [paidWorkLogs])
  const totalCompleted = useMemo(() => paidWorkLogs.length, [paidWorkLogs])
  const uniqueWorkers = useMemo(() => new Set(paidWorkLogs.map((log) => log.workerId)).size, [paidWorkLogs])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={onBack} className="mb-4 text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к выбору отчётов
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Расчёт зарплаты</h1>
          <p className="text-green-100">Подробный отчет о заработной плате по выполненным работам</p>
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
            <Button variant="outline" onClick={handleExcelExport} className="gap-2 bg-green-50 hover:bg-green-100">
              <Download className="w-4 h-4" />
              Скачать Отчёт
            </Button>
          </div>
        </Card>

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
                  className="bg-muted px-6 py-4 border-b border-border cursor-pointer hover:bg-muted/80 transition-colors"
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
                      <p className="text-sm text-muted-foreground">Итого за месяц</p>
                      <p className="text-2xl font-bold text-foreground">
                        {data.total.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ₸
                      </p>
                    </div>
                    {expandedWorker === key ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expandedWorker === key && (
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Дата</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Заказ</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Продукт</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Тип работы</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Кол-во</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Цена/ед.</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Сумма</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Статус</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {data.logs.map((log: GetListSuccessResponse, idx: number) => (
                            <tr key={idx} className="hover:bg-muted/50 transition-colors">
                              <td className="px-4 py-3 text-sm text-foreground">
                                {new Date(log.createdAt).toLocaleDateString("ru-RU")}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-foreground">{log.orderNumber}</td>
                              <td className="px-4 py-3 text-sm text-foreground">{log.productName}</td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant={
                                    log.workType === "sewing"
                                      ? "default"
                                      : log.workType === "cutting"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {log.workType === "sewing"
                                    ? "Пошив"
                                    : log.workType === "cutting"
                                      ? "Крой"
                                      : "Пуговицы"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                                {log.quantity}
                              </td>
                              <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                                {log.workType === "buttons" ? "-" : `${log.pricePerUnit.toFixed(2)} ₸`}
                              </td>
                              <td className="px-4 py-3 text-right text-sm font-bold text-foreground">
                                {log.workType === "buttons" ? "-" : `${log.totalPrice.toFixed(2)} ₸`}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Badge
                                  variant={
                                    getOrderStatus(log) === "Выполнен"
                                      ? "default"
                                      : getOrderStatus(log) === "Перевыполнено"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {getOrderStatus(log)}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
