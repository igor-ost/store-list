"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { OrdersListSuccessResponse } from "@/@types/orders-types"
import { useEffect } from "react"
import { Eye, Loader2 } from "lucide-react"
import { Api } from "@/service/api-clients"
import { getStatusBadge } from "../order-list"
import Link from "next/link"

interface OrdersDialogProps {
  customerId: string
  customerName: string
}

export function OrdersDialog({ customerId, customerName }: OrdersDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [data, setData] = React.useState<OrdersListSuccessResponse>([])
  const [isLoading, setIsLoading] = React.useState(false)

  useEffect(() => {
    const handleGetOrders = async () => {
      setIsLoading(true)
      try {
        const response = await Api.orders.getList()
        if (response) {
          setData(response)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    handleGetOrders()
  }, [])

  const filteredOrder = data.filter(i => i.customer_id == customerId)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary underline-offset-4 hover:underline text-xs h-5 p-0 m-0">
          Посмотреть заказы
        </div>
      </DialogTrigger>

      <DialogContent className="min-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Заказы — {customerName}</DialogTitle>
          <DialogDescription>Список всех заказов для этого заказчика</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Загрузка заказов...</p>
            </div>
          </div>
        ) : filteredOrder.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Нет заказов</h3>
                <p className="text-muted-foreground">У этого заказчика пока нет заказов</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>
                {filteredOrder.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-base font-semibold text-slate-800">{order.order_number}</h3>
                                            {getStatusBadge(order.status)}
                                        </div> 
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <span className="text-slate-500 text-xs">Заказчик:</span>
                                                <div className="font-medium">{order.customer.name}</div>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 text-xs">Изделие:</span>
                                                <div className="font-medium">{order.product_name}</div>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 text-xs">Количество:</span>
                                                <div className="font-medium">{order.quantity} шт.</div>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-slate-500">
                                            Дата заказа: {new Date(order.order_date).toLocaleDateString("ru-RU")}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 ml-4">
                                        <Link target="_blank" href={`/orders/details/${order.id}`}>
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent cursor-pointer">
                                                <Eye className="h-3 w-3" />
                                            </Button>
                                        </Link>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
