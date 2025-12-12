"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Filter, ArrowLeft, Package } from "lucide-react"
import { Api } from "@/service/api-clients"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import type { DetailedMaterialsReport, MaterialDetail } from "@/app/api/materials-report/detailed/route"

interface DetailedMaterialsReportProps {
  onBack?: () => void
}

const materialTypeLabels: Record<MaterialDetail["materialType"], string> = {
  zipper: "Молния",
  thread: "Нитка",
  button: "Пуговица",
  fabric: "Ткань",
  accessory: "Аксессуар",
  velcro: "Липучка",
}

const materialTypeColors: Record<MaterialDetail["materialType"], string> = {
  zipper: "bg-blue-100 text-blue-800 border-blue-200",
  thread: "bg-purple-100 text-purple-800 border-purple-200",
  button: "bg-pink-100 text-pink-800 border-pink-200",
  fabric: "bg-emerald-100 text-emerald-800 border-emerald-200",
  accessory: "bg-orange-100 text-orange-800 border-orange-200",
  velcro: "bg-cyan-100 text-cyan-800 border-cyan-200",
}

export function MaterialsReportComponent({ onBack }: DetailedMaterialsReportProps) {
  const [data, setData] = useState<DetailedMaterialsReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedType, setSelectedType] = useState<MaterialDetail["materialType"] | "all">("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (month?: string) => {
    try {
      setLoading(true)
      const response = await Api.materialsReport.getList(month)
      if (response) {
        setData(response)
      }
    } catch (error) {
      console.error("Error fetching detailed materials report:", error)
      toast.error("Не удалось загрузить детальный отчёт по материалам")
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    fetchData(selectedMonth)
  }

  const filteredMaterials = useMemo(() => {
    if (!data) return []

    let filtered = [...data.materials]

    if (selectedType !== "all") {
      filtered = filtered.filter((m) => m.materialType === selectedType)
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.materialName.toLowerCase().includes(search) ||
          m.orderNumber.toLowerCase().includes(search) ||
          m.productName.toLowerCase().includes(search) ||
          m.clientName.toLowerCase().includes(search),
      )
    }

    return filtered
  }, [data, selectedType, searchTerm])

  const handleExcelExport = () => {
    if (!data) return

    try {
      const workbook = XLSX.utils.book_new()

      // Детальный отчёт
      const detailedData: (string | number)[][] = []
      detailedData.push(["ДЕТАЛЬНЫЙ ОТЧЁТ ПО МАТЕРИАЛАМ"])
      detailedData.push(["Дата генерации:", new Date().toLocaleDateString("ru-RU")])
      if (selectedMonth) {
        const date = new Date(`${selectedMonth}-01`)
        detailedData.push(["Период:", date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" })])
      }
      detailedData.push([])
      detailedData.push([
        "Тип материала",
        "Название материала",
        "Цвет",
        "Количество",
        "Ед. изм.",
        "Цена за ед.",
        "Общая стоимость",
        "Заказ",
        "Дата заказа",
        "Продукт",
        "Клиент",
      ])

      filteredMaterials.forEach((item) => {
        detailedData.push([
          materialTypeLabels[item.materialType],
          item.materialName,
          item.color || "-",
          item.quantity,
          item.unit,
          item.pricePerUnit,
          item.totalCost,
          item.orderNumber,
          new Date(item.orderDate).toLocaleDateString("ru-RU"),
          item.productName,
          item.clientName,
        ])
      })

      detailedData.push([])
      detailedData.push([
        "ИТОГО:",
        "",
        "",
        "",
        "",
        "",
        filteredMaterials.reduce((sum, m) => sum + m.totalCost, 0),
        "",
        "",
        "",
        "",
      ])

      const detailedSheet = XLSX.utils.aoa_to_sheet(detailedData)
      detailedSheet["!cols"] = [
        { wch: 15 },
        { wch: 30 },
        { wch: 15 },
        { wch: 12 },
        { wch: 10 },
        { wch: 12 },
        { wch: 18 },
        { wch: 15 },
        { wch: 12 },
        { wch: 25 },
        { wch: 25 },
      ]
      XLSX.utils.book_append_sheet(workbook, detailedSheet, "Детальный отчёт")

      // Сводка по типам материалов
      const summaryData: (string | number)[][] = []
      summaryData.push(["СВОДКА ПО ТИПАМ МАТЕРИАЛОВ"])
      summaryData.push([])
      summaryData.push(["Тип материала", "Количество позиций", "Общее количество", "Общая стоимость (₸)"])

      const typeMapping: { type: MaterialDetail["materialType"]; key: keyof typeof data.summary.byType }[] = [
        { type: "zipper", key: "zippers" },
        { type: "thread", key: "threads" },
        { type: "button", key: "buttons" },
        { type: "fabric", key: "fabrics" },
        { type: "accessory", key: "accessories" },
        { type: "velcro", key: "velcro" },
      ]

      typeMapping.forEach(({ type, key }) => {
        const typeData = data.summary.byType[key]
        if (typeData) {
          summaryData.push([materialTypeLabels[type], typeData.count, typeData.quantity, typeData.cost])
        }
      })

      summaryData.push([])
      summaryData.push(["ИТОГО:", data.summary.totalItems, "", data.summary.totalCost])

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
      summarySheet["!cols"] = [{ wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 25 }]
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Сводка")

      XLSX.writeFile(workbook, `detailed-materials-report-${new Date().toISOString().split("T")[0]}.xlsx`)
      toast.success("Детальный отчёт успешно экспортирован")
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      toast.error("Ошибка при экспорте")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="mb-4 text-white hover:bg-white/20 transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к выбору отчётов
            </Button>
          )}
          <h1 className="text-3xl font-bold text-white mb-2">Детальный отчёт по материалам</h1>
          <p className="text-blue-100">Полная информация о расходе каждого материала по заказам</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Месяц</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Тип материала</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as MaterialDetail["materialType"] | "all")}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">Все типы</option>
                <option value="zipper">Молнии</option>
                <option value="thread">Нитки</option>
                <option value="button">Пуговицы</option>
                <option value="fabric">Ткани</option>
                <option value="accessory">Аксессуары</option>
                <option value="velcro">Липучки</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Поиск</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск по материалам..."
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
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
                  setSelectedType("all")
                  setSearchTerm("")
                  fetchData()
                }}
              >
                Сбросить
              </Button>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={handleExcelExport}
              className="gap-2 bg-blue-50 hover:bg-blue-100"
              disabled={!data || filteredMaterials.length === 0}
            >
              <Download className="w-4 h-4" />
              Скачать Отчёт
            </Button>
          </div>
        </Card>

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <p className="text-sm text-green-700 font-medium mb-2">Общая стоимость</p>
              <p className="text-3xl font-bold text-green-900">
                {data.summary.totalCost.toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₸
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <p className="text-sm text-blue-700 font-medium mb-2">Всего позиций</p>
              <p className="text-3xl font-bold text-blue-900">{data.summary.totalItems}</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <p className="text-sm text-purple-700 font-medium mb-2">Найдено</p>
              <p className="text-3xl font-bold text-purple-900">{filteredMaterials.length}</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <p className="text-sm text-orange-700 font-medium mb-2">Отфильтровано</p>
              <p className="text-3xl font-bold text-orange-900">
                {filteredMaterials
                  .reduce((sum, m) => sum + m.totalCost, 0)
                  .toLocaleString("ru-RU", { maximumFractionDigits: 0 })}{" "}
                ₸
              </p>
            </Card>
          </div>
        )}

        {/* Materials Breakdown by Type */}
        {data && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Сводка по типам материалов</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { type: "zippers" as const, label: "Молнии", color: "bg-blue-500" },
                { type: "threads" as const, label: "Нитки", color: "bg-purple-500" },
                { type: "buttons" as const, label: "Пуговицы", color: "bg-pink-500" },
                { type: "fabrics" as const, label: "Ткани", color: "bg-emerald-500" },
                { type: "accessories" as const, label: "Аксессуары", color: "bg-orange-500" },
                { type: "velcro" as const, label: "Липучки", color: "bg-cyan-500" },
              ].map((item) => {
                const typeData = data.summary.byType[item.type]
                return (
                  <div key={item.type} className="bg-white border border-border rounded-lg p-4">
                    <div className={`${item.color} w-full h-2 rounded-full mb-3`} />
                    <p className="text-sm font-semibold text-foreground mb-1">{item.label}</p>
                    <p className="text-xs text-muted-foreground mb-2">{typeData.count} поз.</p>
                    <p className="text-lg font-bold text-foreground">
                      {typeData.cost.toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₸
                    </p>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Data Table */}
        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Загрузка...</p>
          </Card>
        ) : filteredMaterials.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">Нет данных для отображения</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Тип</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Название материала</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Цвет</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Кол-во</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Ед.</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Цена/ед.</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Сумма</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Заказ</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Продукт</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Клиент</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMaterials.map((item, index) => (
                    <tr key={index} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${
                            materialTypeColors[item.materialType]
                          }`}
                        >
                          {materialTypeLabels[item.materialType]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{item.materialName}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.color || "-"}</td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                        {item.quantity.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.unit}</td>
                      <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                        {item.pricePerUnit.toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₸
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-blue-600">
                        {item.totalCost.toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₸
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">{item.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{item.productName}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{item.clientName}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted">
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-sm font-bold text-foreground">
                      ИТОГО ПО ФИЛЬТРУ:
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-blue-600">
                      {filteredMaterials
                        .reduce((sum, m) => sum + m.totalCost, 0)
                        .toLocaleString("ru-RU", { maximumFractionDigits: 0 })}{" "}
                      ₸
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
