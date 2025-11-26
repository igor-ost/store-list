"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import WorkLogForOrderTable from "./logs/work-log-for-order-table"
import AddWorkLogForOrder from "./logs/add-work-log-for-order"
import { Api } from "@/service/api-clients"
import { GetListSuccessResponse } from "@/@types/worklog-types"

interface OrderWorkJournalProps {
  orderId: string
}

export function OrderWorkJournal({ orderId }: OrderWorkJournalProps) {
  const [logs, setLogs] = useState<GetListSuccessResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [orderId])

  const fetchLogs = async () => {
        try {
          setLoading(true)
          const response = await Api.worklog.getListById(orderId)
          setLogs(response)
        } catch (error) {
          console.error("Error fetching work logs:", error)
        } finally {
          setLoading(false)
        }
  }

  

  const handleSuccess = (newLog: GetListSuccessResponse) => {
    setLogs([newLog, ...logs])
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
            <BookOpen className="h-4 w-4" />
            Журнал работ
          </CardTitle>
          <Button onClick={() => setIsDialogOpen(true)} size="sm">
            Добавить запись
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <WorkLogForOrderTable logs={logs} loading={loading} />
        </div>
      </CardContent>

      <AddWorkLogForOrder
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        orderId={orderId}
        onSuccess={handleSuccess}
      />
    </Card>
  )
}
