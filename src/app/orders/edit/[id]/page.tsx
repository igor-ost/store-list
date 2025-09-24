import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/shared/header"
import { OrderDetails } from "@/components/shared/order-details"

interface OrderPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderEditPage({ params }: OrderPageProps) {
  const { id } = await params

  if (!id) {
    redirect("/orders")
  }

  return (
    <div className="min-h-screen bg-slate-50">+
      <Header active={"orders"} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/orders">
              <Button variant="outline" size="sm" className="cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к заказам
              </Button>
            </Link>
            <div>
              <p className="text-slate-600">Редактировать информация о заказе</p>
            </div>
          </div>
        </div>

        <OrderDetails id={id} />
      </main>
    </div>
  )
}
