
import { Header } from "@/components/shared/header"
import { OrderForm } from "@/components/shared/order-form"

export default async function NewOrderPage() {
  

  return (
    <div className="min-h-screen bg-slate-50">
      <Header active={"orders"} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Новый заказ</h1>
          <p className="text-slate-600">Создание нового заказа на производство</p>
        </div>

        <OrderForm />
      </main>
    </div>
  )
}
