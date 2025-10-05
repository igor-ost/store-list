
'use client'
import { OrdersList } from "@/components/shared/order-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/shared/header"
import { useEffect, useState } from "react"
import { OrderGeneral } from "@/@types/orders-types"
import { toast } from "sonner"
import { Api } from "@/service/api-clients"
import { OrdersListSkeleton } from "@/components/loading/order-list"

export default function OrdersPage() {

  const [orders,setOrders] = useState<OrderGeneral[]>()
  const [isLoading,setIsLoading] = useState(true);

  useEffect(()=>{
    const handleGetOrders = async () => {
      setIsLoading(true)
      try {
        const response = await Api.orders.getList();
        if(response){
          setOrders(response)
        }
      } catch (error) {
        console.log(error)
        toast.error(`Не удалось загрузить заказы: ${error}`)
      }finally{
        setIsLoading(false)
      }
    }
    handleGetOrders()
  },[])

  return (
    <div className="min-h-screen bg-slate-50">
      <Header active={"orders"} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Заказы</h1>
            <p className="text-slate-600">Управление заказами на производство</p>
          </div>
          <Link href="/orders/new">
            <Button className="flex items-center gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              Новый заказ
            </Button>
          </Link>
        </div>
        {!isLoading && orders ? 
          <OrdersList orders={orders} />
        :
          <OrdersListSkeleton/>
        }
      </main>
    </div>
  )
}
