import { Header } from "@/components/shared/header"

export default async function DashboardPage() {

  return (
    <div className="min-h-screen bg-slate-50">
      <Header active="statistics"/>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Панель управления производством</h1>
          <p className="text-slate-600">Добро пожаловать, {``}</p>
        </div>

        <div className="grid gap-6 mb-8">
          {/* <DashboardStats /> */}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* <RecentOrders /> */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Быстрые действия</h3>
            <div className="grid gap-3">
              <a
                href="/orders/new"
                className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="font-medium">Новый заказ</div>
                <div className="text-sm text-slate-600">Создать новый заказ на производство</div>
              </a>
              <a
                href="/materials"
                className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="font-medium">Управление материалами</div>
                <div className="text-sm text-slate-600">Просмотр и управление складом</div>
              </a>
              <a href="/workers" className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="font-medium">Работники</div>
                <div className="text-sm text-slate-600">Управление персоналом и зарплатами</div>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
