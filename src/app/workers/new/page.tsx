
import { Header } from "@/components/shared/header"
import { WorkerForm } from "@/components/shared/worker-form"


export default async function NewWorkerPage() {

  return (
    <div className="min-h-screen bg-slate-50">
      <Header active={"workers"} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Новый персонал</h1>
          <p className="text-slate-600">Создание нового персонала на производство</p>
        </div>
      <WorkerForm/>
      </main>
    </div>
  )
}
