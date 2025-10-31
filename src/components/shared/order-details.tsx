"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Package, Hash, ImageIcon } from "lucide-react"
import { useEffect, useState } from "react"
import type { OrderInfo } from "@/@types/orders-types"
import { Api } from "@/service/api-clients"
import { toast } from "sonner"
import { OrderDetailsSkeleton } from "../loading/order-details"
import Image from "next/image"
import { ImageViewer } from "./image-viewer"

interface OrderDetailsProps {
  id: string
}

export function OrderDetails({ id }: OrderDetailsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-slate-200 text-slate-700">
            Ожидает
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-slate-300 text-slate-800">
            В работе
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-slate-400 text-slate-900">
            Завершен
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="secondary" className="bg-slate-200 text-slate-600">
            Отменен
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const [order, setOrder] = useState<OrderInfo | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  useEffect(() => {
    const handleGetOrders = async () => {
      try {
        const response = await Api.orders.getOrder(id)
        if (response) {
          setOrder(response)
          setImages(response.image_urls || [])
        }
      } catch (error) {
        console.log(error)
        toast.error(`Не удалось загрузить заказ: ${error}`)
      }
    }
    handleGetOrders()
  }, [id])

  if (order == null) {
    return <OrderDetailsSkeleton />
  }

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <Card className="border-border">
          <CardHeader >
            <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
              <ImageIcon className="h-4 w-4" />
              Изображения заказа
            </CardTitle>
          </CardHeader>
          <CardContent >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {images.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setViewerIndex(index)}
                  className="relative aspect-square rounded-lg overflow-hidden border border-border hover:border-foreground/20 transition-all group bg-muted/20"
                >
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Изображение ${index + 1}`}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border">
        <CardHeader >
          <CardTitle className="flex items-center justify-between text-base font-medium">
            <span className="text-foreground">Информация о заказе</span>
            {getStatusBadge(order.status)}
          </CardTitle>
        </CardHeader>
        <CardContent >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-border">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Номер заказа</div>
                <div className="font-medium text-foreground">{order.order_number}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-border">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Дата заказа</div>
                <div className="font-medium text-foreground">
                  {new Date(order.order_date).toLocaleDateString("ru-RU")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-border">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Заказчик</div>
                <div className="font-medium text-foreground">{order.customer.name}</div>
                <div className="text-xs text-muted-foreground">БИН: {order.customer.bin}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-border">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Количество</div>
                <div className="font-medium text-foreground">{order.quantity} шт.</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted/20 border-l-2 border-foreground/20 rounded">
            <div className="text-sm text-muted-foreground mb-1">Наименование изделия</div>
            <div className="text-lg font-medium text-foreground">{order.product_name}</div>
          </div>
        <div className="mt-4 p-4 bg-muted/20 border-l-2 border-foreground/20 rounded">
            <div className="text-sm text-muted-foreground mb-1">Описание изделия</div>
            <div className="text-lg font-medium text-foreground">{order.description}</div>
          </div>
          {order.notes && (
            <div className="mt-4 p-4 bg-muted/20 border-l-2 border-foreground/20 rounded">
              <div className="text-sm text-muted-foreground mb-1">Примечания</div>
              <div className="text-foreground">{order.notes}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {order.orderFabrics && order.orderFabrics.length > 0 && (
        <Card className="border-border">
          <CardHeader >
            <CardTitle className="text-base font-medium text-foreground">Ткани</CardTitle>
          </CardHeader>
          <CardContent >
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {order.orderFabrics.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {item.fabric.type}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">
                      {item.qty} {item.fabric.unit}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Название:</span>
                      <span className="font-medium text-foreground">{item.fabric.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Цвет:</span>
                      <span className="font-medium text-foreground">{item.fabric.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Цена:</span>
                      <span className="font-medium text-foreground">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {order.orderZippers && order.orderZippers.length > 0 && (
        <Card className="border-border">
          <CardHeader >
            <CardTitle className="text-base font-medium text-foreground">Молнии</CardTitle>
          </CardHeader>
          <CardContent >
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {order.orderZippers.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">
                      {item.qty} {item.zipper.unit}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Цвет:</span>
                      <span className="font-medium text-foreground">{item.zipper.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Цена:</span>
                      <span className="font-medium text-foreground">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {order.orderThreads && order.orderThreads.length > 0 && (
        <Card className="border-border">
          <CardHeader >
            <CardTitle className="text-base font-medium text-foreground">Нитки</CardTitle>
          </CardHeader>
          <CardContent >
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {order.orderThreads.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">
                      {item.qty} {item.thread.unit}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Цвет:</span>
                      <span className="font-medium text-foreground">{item.thread.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Цена:</span>
                      <span className="font-medium text-foreground">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {order.orderButtons && order.orderButtons.length > 0 && (
        <Card className="border-border">
          <CardHeader >
            <CardTitle className="text-base font-medium text-foreground">Пуговицы</CardTitle>
          </CardHeader>
          <CardContent >
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {order.orderButtons.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">
                      {item.qty} {item.button.unit}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Цвет:</span>
                      <span className="font-medium text-foreground">{item.button.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Цена:</span>
                      <span className="font-medium text-foreground">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {order.orderAccessories && order.orderAccessories.length > 0 && (
        <Card className="border-border">
          <CardHeader >
            <CardTitle className="text-base font-medium text-foreground">Аксессуары</CardTitle>
          </CardHeader>
          <CardContent >
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {order.orderAccessories.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">
                      {item.qty} {item.accessory.unit}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Название:</span>
                      <span className="font-medium text-foreground">{item.accessory.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Цена:</span>
                      <span className="font-medium text-foreground">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {order.orderVelcro && order.orderVelcro.length > 0 && (
        <Card className="border-border">
          <CardHeader >
            <CardTitle className="text-base font-medium text-foreground">Липучки</CardTitle>
          </CardHeader>
          <CardContent >
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {order.orderVelcro.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">
                      {item.qty} {item.velcro.unit}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Название:</span>
                      <span className="font-medium text-foreground">{item.velcro.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Цена:</span>
                      <span className="font-medium text-foreground">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {viewerIndex !== null && (
        <ImageViewer images={images} initialIndex={viewerIndex} onClose={() => setViewerIndex(null)} />
      )}
    </div>
  )
}
