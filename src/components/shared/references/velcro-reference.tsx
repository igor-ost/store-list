"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Trash2, Edit, ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { DeleteDialog } from "../delete-dialog"
import { VelcroDialog } from "./velcro-dialog"
import { toast } from "sonner"
import { Api } from "@/service/api-clients"

type Velcro = {
  id: string
  name: string
}

export default function VelcroReferences() {
  const [velcro, setVelcro] = useState<Velcro[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const [loading, setLoading] = useState(false)

  const fetchVelcro = async () => {
    try {
      const response = await Api.velcro.getList()
      if (response) {
        setVelcro(response)
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error)
      toast.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
      fetchVelcro()
  }, [])


  const handleCreate = async (name:string) => {
    try {
      const data = {
        name:name,
      }
      setLoading(true)
      const response = await Api.velcro.create(data)
      if(response){
        setVelcro((prev) => [...prev, { ...data, id: Date.now().toString() }])
      }
      toast.success(`Велькро ${data.name}, создана`)
    } catch (error) {
      toast.error(`Ошибка: ${error}`)
    } finally {
      setLoading(false)
    }
  }




  const handleUpdate = async (id:string,name:string) => {
    if(id){
      const data = {
        id:id,
        name:name
      }
       try {
        const response = await Api.velcro.update(data)
        if (response) {
          setVelcro((prev) => prev.map((item) => (item.id === data.id ? data : item)))
          toast.success(`Велькро - ${data.name}, была успешно обновлена`)
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
      const response = await Api.velcro.removeById(id)
      if (response.success) {
        setVelcro((prev) => prev.filter((item) => item.id !== id))
        toast.success(`Велькро была успешно удалена`)
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error)
      toast.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredVelcro = velcro.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Велькро</h1>
            </div>
            <VelcroDialog onUpdate={handleUpdate} onCreate={handleCreate}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить липучку
              </Button>
            </VelcroDialog>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredVelcro.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{searchTerm ? "Липучки не найдены" : "Нет липучек"}</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Попробуйте изменить критерии поиска" : "Добавьте первую липучку для начала работы"}
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
                    <TableHead className="w-[80%]">Название</TableHead>
                    <TableHead className="w-[20%] text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVelcro.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <VelcroDialog velcro={item} onUpdate={handleUpdate} onCreate={handleCreate}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </VelcroDialog>

                          <DeleteDialog
                            id={item.id}
                            title="Удалить липучку"
                            onConfirm={() => handleDelete(item.id)}
                            itemName={item.name}
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
