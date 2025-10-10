"use client"

import { Header } from "@/components/shared/header"
import AccessoriesReferences from "@/components/shared/references/accessories-reference"
import ButtonsReferences from "@/components/shared/references/button-reference"
import CustomerReference from "@/components/shared/references/customer-reference"
import FabricsReferences from "@/components/shared/references/fabric-reference"
import ThreadsReferences from "@/components/shared/references/thread-reference"
import VelcroReferences from "@/components/shared/references/velcro-reference"
import ZippersReferences from "@/components/shared/references/zippers-reference"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Api } from "@/service/api-clients"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Customer = {
  id: string
  name: string
  bin: string
}
type Accessory = {
  id: string
  name: string
  unit: string
  price: number
  qty: number
}

type ButtonItem = {
  id: string
  color: string
  type: string
  unit: string
  price: number
  qty: number
}
type Fabric = {
  id: string
  type: string
  name: string
  color: string
  unit: string
  price: number
  qty: number
}
type Thread = {
  id: string
  color: string
  type: string
  unit: string
  price: number
  qty: number
}

type Velcro = {
  id: string
  name: string
  unit: string
  price: number
  qty: number
}
type Zipper = {
  id: string
  color: string
  type: string
  unit: string
  price: number
  qty: number
}

export default function ReferencesPage() {

  const [activeTab, setActiveTab] = useState<string>("customers")

  const [customers, setCustomers] = useState<Customer[]>([])
  const [customersLoading, setCustomersLoading] = useState(false)

  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [accessoriesLoading, setAccessoriesLoading] = useState(false)

  const [buttons, setButtons] = useState<ButtonItem[]>([])
  const [buttonsLoading, setButtonsLoading] = useState(false)

  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [fabricsLoading, setFabricsLoading] = useState(false)

  const [threads, setThreads] = useState<Thread[]>([])
  const [threadsLoading, setThreadsLoading] = useState(false)
  
  const [velcro, setVelcro] = useState<Velcro[]>([])
  const [velcroLoading, setVelcroLoading] = useState(false)

  const [zippers, setZippers] = useState<Zipper[]>([])
  const [zippersLoading, setZippersLoading] = useState(false)

  useEffect(() => {
    const savedTab = localStorage.getItem("references-active-tab")
    if (savedTab) {
      setActiveTab(savedTab)
    }
    window.scrollTo(0, 0)
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    localStorage.setItem("references-active-tab", value)
    window.scrollTo(0, 0)
  }

  const fetchAccessories = async () => {
    try {
      setAccessoriesLoading(true)
      const response = await Api.accessories.getList()
      if (response) {
        setAccessories(response)
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error)
      toast.error(`${error}`)
    } finally {
      setAccessoriesLoading(false)
    }
  }


  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true)
      const response = await Api.customers.getList()
      if (response) {
        setCustomers(response)
      }
    } catch (error) {
      console.error("Ошибка при загрузке заказчиков:", error)
      toast.error(`${error}`)
    } finally {
      setCustomersLoading(false)
    }
  }

  const fetchButtons = async () => {
    try {
      setButtonsLoading(true)
      const response = await Api.buttons.getList()
      if (response) {
        setButtons(response)
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error)
      toast.error(`${error}`)
    } finally {
      setButtonsLoading(false)
    }
  }

  const fetchFabrics = async () => {
    try {
      setFabricsLoading(true)
      const response = await Api.fabrics.getList()
      if (response) {
        setFabrics(response)
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error)
      toast.error(`${error}`)
    } finally {
      setFabricsLoading(false)
    }
  }
  const fetchThreads = async () => {
    try {
      setThreadsLoading(true)
      const response = await Api.threads.getList()
      if (response) {
        setThreads(response)
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error)
      toast.error(`${error}`)
    } finally {
      setThreadsLoading(false)
    }
  }
  const fetchVelcro = async () => {
    setVelcroLoading(true)
    try {
      const response = await Api.velcro.getList()
      if (response) {
        setVelcro(response)
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error)
      toast.error(`${error}`)
    } finally {
      setVelcroLoading(false)
    }
  }

  const fetchZippers = async () => {
    try {
      setZippersLoading(true)
      const response = await Api.zippers.getList()
      if (response) {
        setZippers(response)
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error)
      toast.error(`${error}`)
    } finally {
      setZippersLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
    fetchAccessories()
    fetchButtons()
    fetchFabrics()
    fetchThreads()
    fetchZippers()
    fetchVelcro()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header active={"reference-books"} />
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger className="cursor-pointer" value="orders">
            Изделия
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="customers">
            Заказчики
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="accessories">
            Фурнитура
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="zippers">
            Молнии
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="fabrics">
            Ткани
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="threads">
            Нитки
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="buttons">
            Пуговицы
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="velcro">
            Велькро
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">

        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <CustomerReference customers={customers} setCustomers={setCustomers} loading={customersLoading} setLoading={setCustomersLoading}/>
        </TabsContent>

        <TabsContent value="accessories" className="space-y-6">
            <AccessoriesReferences  accessories={accessories} setAccessories={setAccessories} loading={accessoriesLoading} setLoading={setAccessoriesLoading}/>
        </TabsContent>

        <TabsContent value="zippers" className="space-y-6">
            <ZippersReferences  zippers={zippers} setZippers={setZippers} loading={zippersLoading} setLoading={setZippersLoading}/>
        </TabsContent>

        <TabsContent value="fabrics" className="space-y-6">
            <FabricsReferences fabrics={fabrics} setFabrics={setFabrics} loading={fabricsLoading} setLoading={setFabricsLoading}/>
        </TabsContent>

        <TabsContent value="threads" className="space-y-6">
            <ThreadsReferences threads={threads} setThreads={setThreads} loading={threadsLoading} setLoading={setThreadsLoading}/>
        </TabsContent>

        <TabsContent value="buttons" className="space-y-6">
            <ButtonsReferences buttons={buttons} setButtons={setButtons} loading={buttonsLoading} setLoading={setButtonsLoading}/>
        </TabsContent>

        <TabsContent value="velcro" className="space-y-6">
            <VelcroReferences  velcro={velcro} setVelcro={setVelcro} loading={velcroLoading} setLoading={setVelcroLoading}/>
        </TabsContent>

        </Tabs>

      </main>
    </div>
  )
}
