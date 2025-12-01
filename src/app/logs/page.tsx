"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import WorkLogTable from "@/components/shared/logs/work-log-table"
import AddWorkLogDialog from "@/components/shared/logs/add-work-log-dialog"
import { Header } from "@/components/shared/header"
import { Api } from "@/service/api-clients"
import { SelectWorkType } from "@/components/shared/select-work-type"
import { GetListSuccessResponse } from "@/@types/worklog-types"

const workType = [
  {name: "Все типы работ",type: ""},
  {name: "Пошив",type: "sewing"},
  {name: "Крой",type: "cutting"},
  {name: "Пуговицы",type: "buttons"},
]

export default function JournalPage() {
  const [workLogs, setWorkLogs] = useState<GetListSuccessResponse[]>([])
  const [filteredLogs, setFilteredLogs] = useState<GetListSuccessResponse[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [workerFilter, setWorkerFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  useEffect(() => {
    fetchWorkLogs()
  }, [])

  const fetchWorkLogs = async () => {
    try {
      setLoading(true)
      const response = await Api.worklog.getList()
      setWorkLogs(response)
      setFilteredLogs(response)
    } catch (error) {
      console.error("Error fetching work logs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = workLogs

    if (workerFilter) {
      filtered = filtered.filter((log) => log.worker.name.toLowerCase().includes(workerFilter.toLowerCase()))
    }

    if (typeFilter) {
      filtered = filtered.filter((log) => log.workType === typeFilter)
    }

    if (dateFilter) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.createdAt).toISOString().split("T")[0]
        return logDate === dateFilter
      })
    }

    setFilteredLogs(filtered)
  }, [workerFilter, typeFilter, dateFilter, workLogs])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddLog = async (newLog: any) => {
    setWorkLogs([newLog, ...workLogs])
    setIsAddDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">

    <Header active={"logs"} />
    
      <main className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Журнал работ</h1>
            <p className="text-muted-foreground">Отслеживание работ по заказам</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Добавить запись
          </Button>
        </div>

        {/* Фильтры */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по работнику..."
                value={workerFilter}
                onChange={(e) => setWorkerFilter(e.target.value)}
              />
            </div>

            <SelectWorkType workType={workType}  value={typeFilter} onValueChange={setTypeFilter}/>

            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />

            {(workerFilter || typeFilter || dateFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setWorkerFilter("")
                  setTypeFilter("")
                  setDateFilter("")
                }}
              >
                Сбросить фильтры
              </Button>
            )}
          </div>
        </Card>

        {/* Таблица журнала */}
        <WorkLogTable logs={filteredLogs} loading={loading} />
      </main>

      {/* Диалог добавления */}
      <AddWorkLogDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onSuccess={handleAddLog} />
    </div>
  )
}
