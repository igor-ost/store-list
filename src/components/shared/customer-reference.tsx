"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, Edit } from "lucide-react"
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CustomerDialog } from "@/components/shared/customer-dialog"
import { Api } from "@/service/api-clients"
import { toast } from "sonner"
import type { GetListSuccessResponse } from "@/@types/customer-types"
import { DeleteDialog } from "./delete-dialog"
import { CustomerReferenceSkeleton } from "../loading/customer-reference"


export default function CustomerReference() {
  const [customers, setCustomers] = useState<GetListSuccessResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchCustomers = async () => {
    try {
      const response = await Api.customers.getList()
      if (response) {
        setCustomers(response)
      }
    } catch (error) {
      console.error("Ошибка при загрузке заказчиков:", error)
      toast.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleCreate = (data:GetListSuccessResponse) => {
    setCustomers((prev) => [...prev, data]);
  }

  const handleDelete = async (id: string, name: string) => {
    try {
      const response = await Api.customers.removeById(id)
      if (response.success) {
        setCustomers((prev)=>prev.filter(item=>item.id!==id))
        toast.success(`Заказчик - ${name}, был успешно удалён`)
      }
    } catch (error) {
      console.error("Ошибка при удалении заказчика:", error)
      toast.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }


  const filteredCustomers = customers.filter(
    (customer) => customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.bin.includes(searchTerm),
  )

  if (loading) {
    return <CustomerReferenceSkeleton/>
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Заказчики</h1>
            </div>

            <div className="flex items-center gap-4">

              <CustomerDialog onCustomerSaved={handleCreate}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить заказчика
                </Button>
              </CustomerDialog>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Поиск по названию или БИН..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{searchTerm ? "Заказчики не найдены" : "Нет заказчиков"}</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Попробуйте изменить критерии поиска" : "Добавьте первого заказчика для начала работы"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
              <Card>
                <CardContent className="px-4">
                  <TableComponent>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Название</TableHead>
                        <TableHead className="w-[20%]">БИН</TableHead>
                        <TableHead className="w-[20%]">Дата создания</TableHead>
                        <TableHead className="w-[20%] text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="max-w-[300px] truncate" title={customer.name}>
                              {customer.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-mono text-xs">
                              {customer.bin}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(customer.createdAt).toLocaleDateString("ru-RU")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <DeleteDialog
                                id={customer.id}
                                title="Удалить заказчика"
                                onConfirm={() => handleDelete(customer.id, customer.name)}
                                itemName={customer.name}
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
                  </TableComponent>
                </CardContent>
              </Card>
          </>
        )}
      </main>
    </div>
  )
}
