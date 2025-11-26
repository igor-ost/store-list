"use client"

import { SetStateAction, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteDialog } from "../delete-dialog"
import { Api } from "@/service/api-clients"
import { toast } from "sonner"
import { AccessoryDialog } from "./accessory-dialog"
import { ReferenceSkeleton } from "@/components/loading/reference"

type Accessory = {
  id: string
  name: string
  unit: string
  price: number
  qty: number
}

type Props = {
  accessories: Accessory[]
  loading: boolean
  setAccessories: React.Dispatch<SetStateAction<Accessory[]>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}

export default function AccessoriesReferences({accessories,setAccessories,loading,setLoading} : Props) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleCreate = async (name: string,unit:string,price:number, qty: number) => {
    try {
      const data = { name: name, unit:unit,price:price, qty: qty }
      setLoading(true)
      const response = await Api.accessories.create(data)
      if (response) {
        setAccessories((prev) => [...prev, { ...data, id: response.id }])
      }
      toast.success(`Фурнитура ${data.name}, создан`)
    } catch (error) {
      toast.error(`Ошибка: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string, name: string,unit:string,price:number, qty: number) => {
    if (id) {
      const data = {
        id: id,
        name: name,
        unit:unit,
        price:price,
        qty:qty
      }
      try {
        const response = await Api.accessories.update(data)
        if (response) {
          setAccessories((prev) => prev.map((item) => (item.id === data.id ? data : item)))
          toast.success(`Фурнитура - ${name}, была успешно обновлена`)
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
      const response = await Api.accessories.removeById(id)
      if (response.success) {
        setAccessories((prev) => prev.filter((item) => item.id !== id))
        toast.success(`Фурнитура была успешно удалена`)
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error)
      toast.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredAccessories = accessories.filter((accessory) =>
    accessory.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
              <h1 className="text-3xl font-bold mb-2">Фурнитура</h1>
            </div>
            <AccessoryDialog onCreate={handleCreate} onUpdate={handleUpdate}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить Фурнитуру
              </Button>
            </AccessoryDialog>
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

        {filteredAccessories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? "Фурнитура не найдены" : "Нет Фурнитуры"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Попробуйте изменить критерии поиска" : "Добавьте первый Фурнитуру для начала работы"}
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
                    <TableHead className="w-[60%]">Название</TableHead>
                    <TableHead className="w-[20%]">Цена</TableHead>
                    <TableHead className="w-[20%]">Количество</TableHead>
                    <TableHead className="w-[20%] text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccessories.map((accessory) => (
                    <TableRow key={accessory.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{accessory.name}</TableCell>

                      <TableCell>
                        <Badge variant="outline">{accessory.price ? `${accessory.price} ₸` : "-"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={accessory.qty < 50 ? "destructive" : "default"}>{accessory.qty} {accessory.unit}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <AccessoryDialog accessory={accessory} onCreate={handleCreate} onUpdate={handleUpdate}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </AccessoryDialog>
                          <DeleteDialog
                            id={accessory.id}
                            title="Удалить Фурнитуру"
                            onConfirm={() => handleDelete(accessory.id)}
                            itemName={accessory.name}
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
