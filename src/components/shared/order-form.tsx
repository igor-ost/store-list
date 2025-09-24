"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus } from "lucide-react"
import { Api } from "@/service/api-clients"
import { authStore } from "@/store/auth-store"
import { toast } from "sonner"

interface OrderFormData {
  order_number: string
  order_date: string
  customer_name: string
  customer_bin: string
  product_name: string
  product_type: string
  size: string
  quantity: number
  description: string
  status: string
  notes: string
}

export function OrderForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { session } = authStore()

  const [formData, setFormData] = useState<OrderFormData>({
    order_number: `ORD-${Date.now()}`,
    order_date: new Date().toISOString().split("T")[0],
    customer_name: "",
    customer_bin: "",
    product_name: "",
    product_type: "summer",
    size: "",
    quantity: 1,
    description: "",
    status: "pending",
    notes: "",
  })

  const [fabrics, setFabrics] = useState([{ name: "", color: "", consumption: "" }])
  const [zippers, setZippers] = useState([{ type: "", color: "", quantity: "" }])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
        if(session?.id){
            const data_request = {
                general: formData,
                zippers: zippers,
                fabrics: fabrics,
                user_id: session.id
            }
            const response = await Api.orders.create(data_request);
            if(response){
                toast.success(`Заказ успешно создан - ${formData.order_number}`)
                router.push("/orders")
            }
        }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const addFabric = () => {
    setFabrics([...fabrics, { name: "", color: "", consumption: "" }])
  }

  const removeFabric = (index: number) => {
    setFabrics(fabrics.filter((_, i) => i !== index))
  }

  const addZipper = () => {
    setZippers([...zippers, { type: "", color: "", quantity: "" }])
  }

  const removeZipper = (index: number) => {
    setZippers(zippers.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Основная информация</TabsTrigger>
          <TabsTrigger value="materials">Материалы</TabsTrigger>
          <TabsTrigger value="workers">Работники</TabsTrigger>
          <TabsTrigger value="additional">Дополнительно</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация о заказе</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order_number">Номер заказа</Label>
                  <Input
                    id="order_number"
                    value={formData.order_number}
                    onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="order_date">Дата заказа</Label>
                  <Input
                    id="order_date"
                    type="date"
                    value={formData.order_date}
                    onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_name">Заказчик</Label>
                  <Input
                    id="customer_name"
                    placeholder="Наименование заказчика"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customer_bin">БИН заказчика</Label>
                  <Input
                    id="customer_bin"
                    placeholder="БИН"
                    value={formData.customer_bin}
                    onChange={(e) => setFormData({ ...formData, customer_bin: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="product_type">Тип изделия</Label>
                  <Select
                    value={formData.product_type}
                    onValueChange={(value) => setFormData({ ...formData, product_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summer">Летние</SelectItem>
                      <SelectItem value="insulated">Утепленные</SelectItem>
                      <SelectItem value="tent">Полога</SelectItem>
                      <SelectItem value="bags">Мешки</SelectItem>
                      <SelectItem value="other">Прочее</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="product_name">Наименование изделия</Label>
                  <Input
                    id="product_name"
                    placeholder="Название изделия"
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="size">Размер/рост</Label>
                  <Input
                    id="size"
                    placeholder="Размер"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Количество</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Статус</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Ожидает</SelectItem>
                      <SelectItem value="in_progress">В работе</SelectItem>
                      <SelectItem value="completed">Завершен</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Описание модели</Label>
                <Textarea
                  id="description"
                  placeholder="Подробное описание изделия..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ткани</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fabrics.map((fabric, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Наименование ткани</Label>
                    <Input
                      placeholder="Название ткани"
                      value={fabric.name}
                      onChange={(e) => {
                        const newFabrics = [...fabrics]
                        newFabrics[index].name = e.target.value
                        setFabrics(newFabrics)
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Цвет</Label>
                    <Input
                      placeholder="Цвет"
                      value={fabric.color}
                      onChange={(e) => {
                        const newFabrics = [...fabrics]
                        newFabrics[index].color = e.target.value
                        setFabrics(newFabrics)
                      }}
                    />
                  </div>
                  <div className="w-32">
                    <Label>Расход (м)</Label>
                    <Input
                      placeholder="Расход"
                      value={fabric.consumption}
                      onChange={(e) => {
                        const newFabrics = [...fabrics]
                        newFabrics[index].consumption = e.target.value
                        setFabrics(newFabrics)
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFabric(index)}
                    disabled={fabrics.length === 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addFabric}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить ткань
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Молнии</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {zippers.map((zipper, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Тип молнии</Label>
                    <Input
                      placeholder="Тип молнии"
                      value={zipper.type}
                      onChange={(e) => {
                        const newZippers = [...zippers]
                        newZippers[index].type = e.target.value
                        setZippers(newZippers)
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Цвет</Label>
                    <Select
                      value={zipper.color}
                      onValueChange={(value) => {
                        const newZippers = [...zippers]
                        newZippers[index].color = value
                        setZippers(newZippers)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите цвет" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="black">Черный</SelectItem>
                        <SelectItem value="khaki">Хаки</SelectItem>
                        <SelectItem value="gray">Серый</SelectItem>
                        <SelectItem value="red">Красный</SelectItem>
                        <SelectItem value="dark_blue">Темно-синий</SelectItem>
                        <SelectItem value="blue">Синий</SelectItem>
                        <SelectItem value="green">Зеленый</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Label>Количество</Label>
                    <Input
                      placeholder="Кол-во"
                      value={zipper.quantity}
                      onChange={(e) => {
                        const newZippers = [...zippers]
                        newZippers[index].quantity = e.target.value
                        setZippers(newZippers)
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeZipper(index)}
                    disabled={zippers.length === 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addZipper}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить молнию
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Работники</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Назначение работников будет доступно после создания заказа</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="additional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Дополнительная информация</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="notes">Примечания</Label>
                <Textarea
                  id="notes"
                  placeholder="Дополнительные примечания к заказу..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Создание..." : "Создать заказ"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
      </div>
    </form>
  )
}
