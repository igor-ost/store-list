"use client"

import { Header } from "@/components/shared/header"
import AccessoriesReferences from "@/components/shared/references/accessories-reference"
import ButtonsReferences from "@/components/shared/references/button-reference"
import CustomerReference from "@/components/shared/references/customer-reference"
import FabricsReferences from "@/components/shared/references/fabric-reference"
import { ProductReference } from "@/components/shared/references/product-refenrece"
import ThreadsReferences from "@/components/shared/references/thread-reference"
import VelcroReferences from "@/components/shared/references/velcro-reference"
import ZippersReferences from "@/components/shared/references/zippers-reference"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Api } from "@/service/api-clients"
import { Download } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import * as XLSX from 'xlsx'

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

export type ProductsTemplate = {
  id: string
  name: string
  description: string
  materials: Materials
  zippers?: Zipper[],
  velcro?: Velcro[]
  threads?: Thread[]
  fabrics?: Fabric[]
  accessories?: Accessory[]
  buttons?: ButtonItem[]
}

export type Materials = {
  zippers: Zipper[],
  velcro: Velcro[]
  threads: Thread[]
  fabrics: Fabric[]
  accessories: Accessory[]
  buttons: ButtonItem[]
}

export default function ReferencesPage() {

  const [activeTab, setActiveTab] = useState<string>("customers")
  const [loading,setLoading] = useState(false)

  const [customers, setCustomers] = useState<Customer[]>([])
  const [customersLoading, setCustomersLoading] = useState(false)

  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [buttons, setButtons] = useState<ButtonItem[]>([])
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [threads, setThreads] = useState<Thread[]>([])
  const [velcro, setVelcro] = useState<Velcro[]>([])
  const [zippers, setZippers] = useState<Zipper[]>([])

  const [productsTemplate, setProductsTemplate] = useState<ProductsTemplate[]>([])
  const [productsTemplatesLoading, setProductsTemplateLoading] = useState(false)

  const [materials, setMaterials] = useState<Materials>({
    zippers: [],
    accessories: [],
    buttons: [],
    threads: [],
    velcro: [],
    fabrics: [],
  });

const handleExport = () => {
  try {
    const workbook = XLSX.utils.book_new();

    const createSheet = (data: any[], sheetName: string) => {
      if (data.length === 0) return;

      const formatted = data.map(item => {
        const row: Record<string, any> = {};

        if (item.name) row["Наименование"] = item.name;
        if (item.color) row["Цвет"] = item.color;
        if (item.type) row["Вид"] = item.type;
        if (item.unit) row["Ед. изм"] = item.unit;
        if (item.price) row["Цена"] = item.price;
        if (item.qty) row["Остаток"] = item.qty;

        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(formatted);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    };

    createSheet(accessories, "Фурнитура");
    createSheet(buttons, "Пуговицы");
    createSheet(fabrics, "Ткани");
    createSheet(threads, "Нитки");
    createSheet(zippers, "Молнии");
    createSheet(velcro, "Велькро");

    XLSX.writeFile(workbook, `Остатки_${new Date().toLocaleDateString()}.xlsx`);
    toast.success("Файл успешно сформирован");
  } catch (error) {
    console.error(error);
    toast.error("Ошибка при формировании Excel файла");
  }
};

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      const response = await Api.materials.getList()
      if (response) {
        setMaterials(response)
        setAccessories(response.accessories)
        setButtons(response.buttons)
        setFabrics(response.fabrics)
        setThreads(response.threads)
        setVelcro(response.velcro)
        setZippers(response.zippers)
      }
    } catch (error) {
      console.log(error)
      toast.error(`Не удалось загрузить материалы: ${error}`)
    } finally {
      setLoading(false)
    }
  }


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



  const fetchProducts = async () => {
    try {
      setProductsTemplateLoading(true)
      const response = await Api.products.getList()
      if (response) {
        setProductsTemplate(response)
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error)
      toast.error(`${error}`)
    } finally {
      setProductsTemplateLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
    fetchMaterials()
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header active={"reference-books"} />
      <main className="container mx-auto px-4 py-8">
        
        <Button onClick={handleExport} className="my-2 ml-auto" variant="default"><Download/>Выгрузить Остатки</Button>
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
            <ProductReference templates={productsTemplate} setTemplates={setProductsTemplate} materials={materials} loading={productsTemplatesLoading} setLoading={setProductsTemplateLoading} />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerReference customers={customers} setCustomers={setCustomers} loading={customersLoading} setLoading={setCustomersLoading} />
          </TabsContent>

          <TabsContent value="accessories" className="space-y-6">
            <AccessoriesReferences accessories={accessories} setAccessories={setAccessories} loading={loading} setLoading={setLoading} />
          </TabsContent>

          <TabsContent value="zippers" className="space-y-6">
            <ZippersReferences zippers={zippers} setZippers={setZippers} loading={loading} setLoading={setLoading} />
          </TabsContent>

          <TabsContent value="fabrics" className="space-y-6">
            <FabricsReferences fabrics={fabrics} setFabrics={setFabrics} loading={loading} setLoading={setLoading} />
          </TabsContent>

          <TabsContent value="threads" className="space-y-6">
            <ThreadsReferences threads={threads} setThreads={setThreads} loading={loading} setLoading={setLoading} />
          </TabsContent>

          <TabsContent value="buttons" className="space-y-6">
            <ButtonsReferences buttons={buttons} setButtons={setButtons} loading={loading} setLoading={setLoading} />
          </TabsContent>

          <TabsContent value="velcro" className="space-y-6">
            <VelcroReferences velcro={velcro} setVelcro={setVelcro} loading={loading} setLoading={setLoading} />
          </TabsContent>

        </Tabs>

      </main>
    </div>
  )
}
