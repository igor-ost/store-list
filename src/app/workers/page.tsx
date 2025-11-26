
'use client'

import { WorkersGeneral } from "@/@types/workers-types"
import { WorkerListSkeleton } from "@/components/loading/worker-list"
import { Header } from "@/components/shared/header"
import { WorkersList } from "@/components/shared/workers-list"
import { Button } from "@/components/ui/button"
import { Api } from "@/service/api-clients"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"


export default function WorkersPage() {

  const [workers,setWorkers] = useState<WorkersGeneral[]>()
  const [isLoading,setIsLoading] = useState(true);
  useEffect(()=>{
    setIsLoading(true)
    const handleGetOrders = async () => {
      try {
        const response = await Api.workers.getList();
        if(response){
          setWorkers(response)
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
      <Header active={"workers"} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Персонал - Работники</h1>
            <p className="text-slate-600">Управление персоналом/работники</p>
          </div>
          <Link href="/workers/new">
            <Button className="flex items-center gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              Добавить
            </Button>
          </Link>
        </div>
        {!isLoading && workers ? 
          <WorkersList workers={workers} />
        :
          <WorkerListSkeleton/>
        }
      </main>
    </div>
  )
}
