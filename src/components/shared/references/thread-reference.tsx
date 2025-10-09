"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, Edit, ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { DeleteDialog } from "../delete-dialog"
import { ThreadDialog } from "./thread-dialog"
import { Api } from "@/service/api-clients"
import { toast } from "sonner"

type Thread = {
  id: string
  color: string
  type: string
}

export default function ThreadsReferences() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const [loading, setLoading] = useState(false)

  const fetchThreads = async () => {
    try {
      const response = await Api.threads.getList()
      if (response) {
        setThreads(response)
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error)
      toast.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
      fetchThreads()
  }, [])


  const handleCreate = async (type:string,color:string) => {
    try {
      const data = {
        type:type,
        color:color,
      }
      setLoading(true)
      const response = await Api.threads.create(data)
      if(response){
        setThreads((prev) => [...prev, { ...data, id: Date.now().toString() }])
      }
      toast.success(`Нитка ${data.color}-${data.type}, создана`)
    } catch (error) {
      toast.error(`Ошибка: ${error}`)
    } finally {
      setLoading(false)
    }
  }




  const handleUpdate = async (id:string,type:string,color:string) => {
    if(id){
      const data = {
        id:id,
        type:type,
        color:color,
      }
       try {
        const response = await Api.threads.update(data)
        if (response) {
          setThreads((prev) => prev.map((item) => (item.id === data.id ? data : item)))
          toast.success(`Ткань - ${data.color}/${data.type}, была успешно обновлена`)
        }
      } catch (error) {
        console.error("Ошибка при обновлении:", error)
        toast.error(`${error}`)
      } finally {
        setLoading(false)
      }
    }
  }


  const handleDelete = async (id: string) => {
    try {
      const response = await Api.threads.removeById(id)
      if (response.success) {
        setThreads((prev) => prev.filter((item) => item.id !== id))
        toast.success(`Нитка , была успешно удалена`)
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error)
      toast.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredThreads = threads.filter(
    (thread) =>
      thread.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Нитки</h1>
            </div>
            <ThreadDialog onUpdate={handleUpdate} onCreate={handleCreate}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить нитку
              </Button>
            </ThreadDialog>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Поиск по цвету или типу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredThreads.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{searchTerm ? "Нитки не найдены" : "Нет ниток"}</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Попробуйте изменить критерии поиска" : "Добавьте первую нитку для начала работы"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="px-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Цвет</TableHead>
                    <TableHead className="w-[40%]">Тип</TableHead>
                    <TableHead className="w-[20%] text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredThreads.map((thread) => (
                    <TableRow key={thread.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{thread.color}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{thread.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <ThreadDialog thread={thread} onUpdate={handleUpdate} onCreate={handleCreate}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </ThreadDialog>
                          <DeleteDialog
                            id={thread.id}
                            title="Удалить нитку"
                            onConfirm={() => handleDelete(thread.id)}
                            itemName={`${thread.color} ${thread.type}`}
                          >
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DeleteDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
