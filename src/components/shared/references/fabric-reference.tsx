"use client"

import { SetStateAction, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteDialog } from "../delete-dialog"
import { FabricDialog } from "./fabric-dialog"
import { toast } from "sonner"
import { Api } from "@/service/api-clients"
import { ReferenceSkeleton } from "@/components/loading/reference"

type Fabric = {
  id: string
  type: string
  name: string
  color: string
  unit: string
  price: number
  qty: number
}

type Props = {
  fabrics: Fabric[]
  loading: boolean
  setFabrics: React.Dispatch<SetStateAction<Fabric[]>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}


export default function FabricsReferences({fabrics,setFabrics,loading,setLoading} : Props) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleCreate = async (type: string, name: string, color: string, unit: string, price: number, qty: number) => {
    try {
      const data = {
        type: type,
        name: name,
        color: color,
        unit: unit,
        price: price,
        qty: qty
      }
      setLoading(true)
      const response = await Api.fabrics.create(data)
      if (response) {
        setFabrics((prev) => [...prev, { ...data, id: response.id }])
      }
      toast.success(`Ткань ${data.name}-${data.type}, создана`)
    } catch (error) {
      toast.error(`Ошибка: ${error}`)
    } finally {
      setLoading(false)
    }
  }




  const handleUpdate = async (id: string, type: string, name: string, color: string, unit: string, price: number, qty: number) => {
    if (id) {
      const data = {
        id: id,
        type: type,
        name: name,
        color: color,
        unit: unit,
        price: price,
        qty: qty
      }
      try {
        const response = await Api.fabrics.update(data)
        if (response) {
          setFabrics((prev) => prev.map((item) => (item.id === data.id ? data : item)))
          toast.success(`Ткань - ${data.name}/${data.type}, была успешно обновлена`)
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
      const response = await Api.fabrics.removeById(id)
      if (response.success) {
        setFabrics((prev) => prev.filter((item) => item.id !== id))
        toast.success(`Ткань , была успешно удалена`)
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error)
      toast.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredFabrics = fabrics.filter(
    (fabric) =>
      fabric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fabric.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fabric.color?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <ReferenceSkeleton />
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Ткани</h1>
            </div>
            <FabricDialog onUpdate={handleUpdate} onCreate={handleCreate}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить ткань
              </Button>
            </FabricDialog>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Поиск по названию, типу или цвету..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredFabrics.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{searchTerm ? "Ткани не найдены" : "Нет тканей"}</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Попробуйте изменить критерии поиска" : "Добавьте первую ткань для начала работы"}
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
                    <TableHead className="w-[20%]">Название</TableHead>
                    {/* <TableHead className="w-[15%]">Тип</TableHead> */}
                    <TableHead className="w-[15%]">Цвет</TableHead>
                    <TableHead className="w-[15%]">Цена</TableHead>
                    <TableHead className="w-[10%]">Кол-во</TableHead>
                    <TableHead className="w-[15%] text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFabrics.map((fabric) => (
                    <TableRow key={fabric.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{fabric.name}</TableCell>
                      {/* <TableCell>
                        <Badge variant="secondary">{fabric.type}</Badge>
                      </TableCell> */}
                      <TableCell>{fabric.color || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{fabric.price ? `${fabric.price} ₸` : "-"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={fabric.qty < 50 ? "destructive" : "default"}>{fabric.qty} {fabric.unit}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <FabricDialog fabric={fabric} onUpdate={handleUpdate} onCreate={handleCreate}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </FabricDialog>
                          <DeleteDialog
                            id={fabric.id}
                            title="Удалить ткань"
                            onConfirm={() => handleDelete(fabric.id)}
                            itemName={fabric.name}
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
