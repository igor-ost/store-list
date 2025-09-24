
'use client'

import { WorkersGeneral } from "@/@types/workers-types"
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

  useEffect(()=>{
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
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Персонал</h1>
            <p className="text-slate-600">Управление персоналом</p>
          </div>
          <Link href="/workers/new">
            <Button className="flex items-center gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              Добавить персонал
            </Button>
          </Link>
        </div>
        {workers && (
          <WorkersList workers={workers} />
        )}
      </main>
    </div>
  )
}
