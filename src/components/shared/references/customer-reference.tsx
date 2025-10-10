"use client"

import { useState, SetStateAction } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, Edit } from "lucide-react"
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CustomerDialog } from "@/components/shared/references/customer-dialog"
import { Api } from "@/service/api-clients"
import { toast } from "sonner"
import { DeleteDialog } from "../delete-dialog"
import { ReferenceSkeleton } from "../../loading/reference"

type Customer = {
  id: string
  name: string
  bin: string
}

type Props = {
  customers: Customer[]
  loading: boolean
  setCustomers: React.Dispatch<SetStateAction<Customer[]>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}

export default function CustomerReference({customers,setCustomers,loading,setLoading} : Props) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleCreate = async (name:string,bin:string) => {
    try {
      const data = {name:name,bin:bin}
      setLoading(true)
      const response = await Api.customers.create(data)
      if(response){
        setCustomers((prev) => [...prev, { ...data, id: Date.now().toString() }])
      }
      toast.success(`Заказчик ${data.name}, создан`)
    } catch (error) {
      toast.error(`Ошибка: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id:string,name:string,bin:string) => {
    if(id){
      const data = {
        id: id,
        name: name,
        bin: bin
      }
       try {
        const response = await Api.customers.update(data)
        if (response) {
          setCustomers((prev) => prev.map((item) => (item.id === data.id ? data : item)))
          toast.success(`Заказчик - ${name}, был успешно обновлен`)
        }
      } catch (error) {
        console.error("Ошибка при обновлении:", error)
        toast.error(`${error}`)
      } finally {
        setLoading(false)
      }
    }
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
    return <ReferenceSkeleton/>
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

              <CustomerDialog onUpdate={handleUpdate} onCreate={handleCreate}>
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
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <CustomerDialog customer={customer }onUpdate={handleUpdate} onCreate={handleCreate}>
                                <Button variant="ghost" size="sm" >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </CustomerDialog>
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
