"use client"

import { SetStateAction, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteDialog } from "../delete-dialog"
import { ZipperDialog } from "./zipper-dialog"
import { toast } from "sonner"
import { Api } from "@/service/api-clients"
import { ReferenceSkeleton } from "@/components/loading/reference"

type Zipper = {
  id: string
  color: string
  type: string
  unit: string
  price: number
  qty: number
}

type Props = {
  zippers: Zipper[]
  loading: boolean
  setZippers: React.Dispatch<SetStateAction<Zipper[]>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}


export default function ZippersReferences({zippers,setZippers,loading,setLoading} : Props) {
  const [searchTerm, setSearchTerm] = useState("")



  const handleCreate = async (color: string, type: string, unit:string,price:number, qty: number) => {
    try {
      const data = {
        color: color,
        type: type,
        unit:unit,
        price:price,
        qty: qty
      }
      setLoading(true)
      const response = await Api.zippers.create(data)
      if (response) {
        setZippers((prev) => [...prev, { ...data, id: response.id }])
      }
      toast.success(`Молния ${data.color}-${data.type}, создана`)
    } catch (error) {
      toast.error(`Ошибка: ${error}`)
    } finally {
      setLoading(false)
    }
  }



  const handleUpdate = async (id: string, color: string, type: string,unit:string,price:number, qty: number) => {
    if (id) {
      const data = {
        id: id,
        color: color,
        type: type,
        unit:unit,
        price:price,
        qty: qty
      }
      try {
        const response = await Api.zippers.update(data)
        if (response) {
          setZippers((prev) => prev.map((item) => (item.id === data.id ? data : item)))
          toast.success(`Молния - ${data.color}/${data.type}, была успешно обновлена`)
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
      const response = await Api.zippers.removeById(id)
      if (response.success) {
        setZippers((prev) => prev.filter((item) => item.id !== id))
        toast.success(`Молния - ${name}, была успешно удалена`)
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error)
      toast.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredZippers = zippers.filter(
    (zipper) =>
      zipper.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zipper.type.toLowerCase().includes(searchTerm.toLowerCase()),
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
              <h1 className="text-3xl font-bold mb-2">Молнии</h1>
            </div>
            <ZipperDialog onUpdate={handleUpdate} onCreate={handleCreate}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить молнию
              </Button>
            </ZipperDialog>
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

        {filteredZippers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{searchTerm ? "Молнии не найдены" : "Нет молний"}</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Попробуйте изменить критерии поиска" : "Добавьте первую молнию для начала работы"}
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
                    <TableHead className="w-[30%]">Цвет</TableHead>
                    <TableHead className="w-[30%]">Тип</TableHead>
                    <TableHead className="w-[20%]">Цена</TableHead>
                    <TableHead className="w-[20%]">Количество</TableHead>
                    <TableHead className="w-[20%] text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredZippers.map((zipper) => (
                    <TableRow key={zipper.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{zipper.color}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{zipper.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{zipper.price ? `${zipper.price} ₸` : "-"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={zipper.qty < 50 ? "destructive" : "default"}>{zipper.qty} {zipper.unit}</Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <ZipperDialog zipper={zipper} onUpdate={handleUpdate} onCreate={handleCreate}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </ZipperDialog>
                          <DeleteDialog
                            id={zipper.id}
                            title="Удалить молнию"
                            onConfirm={() => handleDelete(zipper.id)}
                            itemName={`${zipper.color} ${zipper.type}`}
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
