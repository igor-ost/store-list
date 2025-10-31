"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Api } from "@/service/api-clients"
import { authStore } from "@/store/auth-store"
import { toast } from "sonner"
import type { WorkersGeneral } from "@/@types/workers-types"
import { Checkbox } from "../ui/checkbox"
import RoleBadge from "./role-badge"
import type { CustomerGeneral } from "@/@types/customer-types"
import { CustomerSelect } from "./references/customer-select"
import { ImageUpload } from "./image-upload"
import { Skeleton } from "../ui/skeleton"
import { ProductSelect, type ProductsGeneral } from "./references/product-select"
import { OrderMaterialSection } from "./order-material-section"
import { ProductMaterialDialog } from "./references/product-material-dialog"
import { Materials } from "@/app/reference-books/page"
import { Accessories, Buttons, Fabrics, Threads, Velcro, Zipperz } from "@/@types/product-types"

interface OrderFormData {
  order_number: string
  order_date: string
  customer_id: string
  product_id: string
  product_name: string
  product_type: string
  size: string
  quantity: number
  description: string
  status: string
  notes: string
  materials: LoadedProductMaterials | null
  image_urls: string[]
}

interface LoadedMaterial {
  id: string
  qty: number
  name?: string
  color?: string
  type?: string
  unit?: string
  price?: number
}

interface LoadedProductMaterials {
  zippers: LoadedMaterial[]
  threads: LoadedMaterial[]
  buttons: LoadedMaterial[]
  fabrics: LoadedMaterial[]
  accessories: LoadedMaterial[]
  velcro: LoadedMaterial[]
}

export function OrderForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [customerLoading, setCustomerLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { session } = authStore()
  
  const [materials,setMaterials] = useState<Materials>({
    zippers: [],
    threads: [],
    fabrics: [],
    buttons: [],
    velcro: [],
    accessories: []
  })

  const [formData, setFormData] = useState<OrderFormData>({
    order_number: `ORD-${Date.now()}`,
    order_date: new Date().toISOString().split("T")[0],
    product_id: "",
    customer_id: "",
    product_name: "",
    product_type: "summer",
    size: "",
    quantity: 1,
    description: "",
    status: "pending",
    notes: "",
    materials: materials,
    image_urls: [],
  })

  const [assignedWorkers, setAssignedWorkers] = useState<string[]>([])

  const [productMaterials, setProductMaterials] = useState<LoadedProductMaterials | null>(null)
  const [materialsLoading, setMaterialsLoading] = useState(false)

  const [workers, setWorkers] = useState<WorkersGeneral[]>()
  const [customers, setCustomers] = useState<CustomerGeneral[]>()
  const [products, setProducts] = useState<ProductsGeneral[]>()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    console.log(productMaterials)
    try {
      if (session?.id) {

        const data_request = {
          general: formData,
          materials: productMaterials,
          user_id: session?.id,
        }
        const response = await Api.orders.create(data_request)
        if (response) {
          // router.push("/orders")
        }
      }
    } catch (error) {
      toast.error(`${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleWorker = (workerId: string) => {
    if (assignedWorkers.includes(workerId)) {
      setAssignedWorkers(assignedWorkers.filter((id) => id !== workerId))
    } else {
      setAssignedWorkers([...assignedWorkers, workerId])
    }
  }

  useEffect(() => {
    const handleGetOrders = async () => {
      try {
        setCustomerLoading(true)
        const response = await Api.workers.getList()
        if (response) {
          setWorkers(response)
          const customers_response = await Api.customers.getList()
          setCustomers(customers_response)
        }
      } catch (error) {
        console.log(error)
        toast.error(`Не удалось загрузить заказы: ${error}`)
      } finally {
        setCustomerLoading(false)
      }
    }
    handleGetOrders()
  }, [])

  useEffect(() => {
    const handleGetProducts = async () => {
      try {
        setProductsLoading(true)
        const response = await Api.products.getList()
        if (response) {
          setProducts(response)
        }
      } catch (error) {
        console.log(error)
        toast.error(`Не удалось загрузить заказы: ${error}`)
      } finally {
        setProductsLoading(false)
      }
    }
    handleGetProducts()
  }, [])


  useEffect(() => {
    const handleGetMaterials = async () => {
      try {
        const response = await Api.materials.getList()
        if (response) {
          setMaterials(response)
        }
      } catch (error) {
        console.log(error)
        toast.error(`Не удалось загрузить заказы: ${error}`)
      } finally {
      }
    }
    handleGetMaterials()
  }, [])

  useEffect(() => {
    const loadProductMaterials = async () => {
      if (!formData.product_id) {
        setProductMaterials(null)
        return
      }

      try {
        setMaterialsLoading(true)
        const response = await Api.products.getById(formData.product_id)
        setFormData({ ...formData, product_name: response.name, description: response.description })
        const materials: LoadedProductMaterials = {
          zippers:
            response.zippers?.map((item: Zipperz) => ({
              id: item.zipper.id,
              qty: item.qty,
              color: item.zipper.color,
              type: item.zipper.type,
              unit: item.zipper.unit,
              price: item.zipper.price,
            })) || [],
          threads:
            response.threads?.map((item: Threads) => ({
              id: item.thread.id,
              qty: item.qty,
              color: item.thread.color,
              type: item.thread.type,
              unit: item.thread.unit,
              price: item.thread.price,
            })) || [],
          buttons:
            response.buttons?.map((item: Buttons) => ({
              id: item.button.id,
              qty: item.qty,
              color: item.button.color,
              type: item.button.type,
              unit: item.button.unit,
              price: item.button.price,
            })) || [],
          fabrics:
            response.fabrics?.map((item: Fabrics) => ({
              id: item.fabric.id,
              qty: item.qty,
              name: item.fabric.name,
              color: item.fabric.color,
              type: item.fabric.type,
              unit: item.fabric.unit,
              price: item.fabric.price,
            })) || [],
          accessories:
            response.accessories?.map((item: Accessories) => ({
              id: item.accessory.id,
              qty: item.qty,
              name: item.accessory.name,
              unit: item.accessory.unit,
              price: item.accessory.price,
            })) || [],
          velcro:
            response.velcro?.map((item: Velcro) => ({
              id: item.velcro.id,
              qty: item.qty,
              name: item.velcro.name,
              unit: item.velcro.unit,
              price: item.velcro.price,
            })) || [],
        }
        setProductMaterials(materials)
      } catch (error) {
        console.error(error)
        toast.error(`Не удалось загрузить материалы: ${error}`)
      } finally {
        setMaterialsLoading(false)
      }
    }
    loadProductMaterials()
  }, [formData.product_id])

  const handleMaterialChange = (materialType: keyof LoadedProductMaterials, materialId: string, newQty: number) => {
    if (!productMaterials) return

    setProductMaterials({
      ...productMaterials,
      [materialType]: productMaterials[materialType].map((material) =>
        material.id === materialId ? { ...material, qty: newQty } : material,
      ),
    })
  }



  const handleMaterialDelete = (materialType: keyof LoadedProductMaterials, materialId: string) => {
    if (!productMaterials) return

    setProductMaterials({
      ...productMaterials,
      [materialType]: productMaterials[materialType].filter((material) => material.id !== materialId),
    })
  }

  const handleMaterialAdd = (
    id: string,
    qty: number,
    materialType: keyof LoadedProductMaterials,
  ) => {
    if (!productMaterials) return

    const foundMaterial = materials[materialType].find(i => i.id === id)
    if (!foundMaterial) return

    const newMaterial = { ...foundMaterial, qty }
  
    setProductMaterials({
      ...productMaterials,
      [materialType]: [...productMaterials[materialType], newMaterial],
    })

  }

  const filteredWorkers = workers?.filter((item) => item.role != "admin" && item.role != "manager")

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger className="cursor-pointer" value="basic">
            Основная информация
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="materials">
            Материалы
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="workers">
            Работники
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="additional">
            Дополнительно
          </TabsTrigger>
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
                {customerLoading ? (
                  <div>
                    <Label htmlFor="customer_name">Заказчик</Label>
                    <Skeleton className="w-full h-8" />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="customer_name">Заказчик</Label>
                    {customers && (
                      <CustomerSelect
                        customers={customers}
                        value={formData.customer_id}
                        onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
                        placeholder="Выберите заказчика..."
                      />
                    )}
                  </div>
                )}

                {productsLoading ? (
                  <div>
                    <Label htmlFor="product_name">Изделие</Label>
                    <Skeleton className="w-full h-8" />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="product_name">Изделие</Label>
                    {products && (
                      <ProductSelect
                        products={products}
                        value={formData.product_id}
                        onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                        placeholder="Выберите изделие..."
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <ImageUpload
                images={formData.image_urls}
                onChange={(urls) => setFormData({ ...formData, image_urls: urls })}
                maxImages={5}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Материалы изделия</CardTitle>
            </CardHeader>
            <CardContent>
              {materialsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : !productMaterials ? (
                <div className="text-center text-slate-500 py-8">Выберите изделие, чтобы увидеть список материалов</div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Если вы хотите добавить ещё один материал, нажмите кнопку «Добавить».
                    </p>
                    <ProductMaterialDialog handleAdd={handleMaterialAdd} materials={materials}>
                      <Button>Добавить</Button>
                    </ProductMaterialDialog>
                  </div>
                                                      
                  <OrderMaterialSection
                    title="Молнии"
                    materials={productMaterials.zippers}
                    onMaterialChange={(id, qty) => handleMaterialChange("zippers", id, qty)}
                    onMaterialDelete={(id) => handleMaterialDelete("zippers", id)}
                  />

                  <OrderMaterialSection
                    title="Нитки"
                    materials={productMaterials.threads}
                    onMaterialChange={(id, qty) => handleMaterialChange("threads", id, qty)}
                    onMaterialDelete={(id) => handleMaterialDelete("threads", id)}

                  />

                  <OrderMaterialSection
                    title="Пуговицы"
                    materials={productMaterials.buttons}
                    onMaterialChange={(id, qty) => handleMaterialChange("buttons", id, qty)}
                    onMaterialDelete={(id) => handleMaterialDelete("buttons", id)}
                  />

                  <OrderMaterialSection
                    title="Ткани"
                    materials={productMaterials.fabrics}
                    onMaterialChange={(id, qty) => handleMaterialChange("fabrics", id, qty)}
                    onMaterialDelete={(id) => handleMaterialDelete("fabrics", id)}
                  />

                  <OrderMaterialSection
                    title="Фурнитура"
                    materials={productMaterials.accessories}
                    onMaterialChange={(id, qty) => handleMaterialChange("accessories", id, qty)}
                    onMaterialDelete={(id) => handleMaterialDelete("accessories", id)}
                  />

                  <OrderMaterialSection
                    title="Липучки"
                    materials={productMaterials.velcro}
                    onMaterialChange={(id, qty) => handleMaterialChange("velcro", id, qty)}
                    onMaterialDelete={(id) => handleMaterialDelete("velcro", id)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workers" className="space-y-6">
          {filteredWorkers?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Работники</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Отметьте сотрудников, которых хотите назначить на заказ</p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredWorkers.map((worker) => {
                    const isSelected = assignedWorkers.includes(worker.id)

                    return (
                      <div
                        key={worker.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition 
                ${isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleWorker(worker.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">{worker.name}</div>
                          <RoleBadge role={worker.role} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Работники</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-left text-slate-500 py-5">
                  Работники пока не добавлены <br />
                  <span className="text-sm">
                    Вы сможете назначить сотрудников на заказ, когда они появятся в системе
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
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
