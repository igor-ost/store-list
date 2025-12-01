"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/shared/header"
import { FileText, DollarSign,ChevronRight } from "lucide-react"
import { SalaryReport } from "@/components/shared/salary-report"
import { OrdersReport } from "@/components/shared/orders-report"

type ReportType = "salary" | "orders" | null

const reports = [
  {
    id: "salary" as const,
    title: "Зарплатный отчёт",
    description: "Подробный отчет о заработной плате работников по выполненным работам",
    icon: DollarSign,
    gradient: "from-green-500 to-emerald-600",
    bgGradient: "from-green-50 to-emerald-50",
    borderColor: "border-green-200",
    available: true,
  },
  
  {
    id: "orders" as const,
    title: "Отчёт по заказам",
    description: "Детальная информация о статусе и выполнении заказов",
    icon: FileText,
    gradient: "from-orange-500 to-red-600",
    bgGradient: "from-orange-50 to-red-50",
    borderColor: "border-orange-200",
    available: true,
  },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>(null)

  if (selectedReport === "salary") {
    return <SalaryReport onBack={() => setSelectedReport(null)} />
  }

  if (selectedReport === "orders") {
    return <OrdersReport onBack={() => setSelectedReport(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header active={"reports"} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">Отчёты и аналитика</h1>
          <p className="text-lg text-muted-foreground">Выберите тип отчёта для просмотра детальной информации</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {reports.map((report) => {
            const Icon = report.icon
            return (
              <Card
                key={report.id}
                className={`relative overflow-hidden border-2 ${report.borderColor} ${report.available ? "cursor-pointer hover:shadow-xl" : "cursor-not-allowed opacity-60"} transition-all duration-300 group`}
                onClick={() => report.available && setSelectedReport(report.id)}
              >
                {/* Фоновый градиент */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${report.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity`}
                />

                {/* Иконка-декор в углу */}
                <div
                  className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${report.gradient} opacity-10 rounded-full group-hover:scale-110 transition-transform`}
                />

                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${report.gradient} shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {report.available && (
                      <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-muted-foreground transition-all">
                    {report.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{report.description}</p>

                  {!report.available && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                      Скоро доступно
                    </div>
                  )}
                </div>

                {/* Анимированная граница при наведении */}
                {report.available && (
                  <div
                    className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${report.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
                  />
                )}
              </Card>
            )
          })}
        </div>

      </main>
    </div>
  )
}
