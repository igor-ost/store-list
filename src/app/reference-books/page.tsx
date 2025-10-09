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


export default function ReferencesPage() {


  return (
    <div className="min-h-screen bg-background">
      <Header active={"reference-books"} />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
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

        <TabsContent value="customers" className="space-y-6">
            <CustomerReference/>
        </TabsContent>

        <TabsContent value="accessories" className="space-y-6">
            <AccessoriesReferences/>
        </TabsContent>

        <TabsContent value="zippers" className="space-y-6">
            <ZippersReferences/>
        </TabsContent>

        <TabsContent value="fabrics" className="space-y-6">
            <FabricsReferences/>
        </TabsContent>

        <TabsContent value="threads" className="space-y-6">
            <ThreadsReferences/>
        </TabsContent>

        <TabsContent value="buttons" className="space-y-6">
            <ButtonsReferences/>
        </TabsContent>

        <TabsContent value="velcro" className="space-y-6">
            <VelcroReferences/>
        </TabsContent>

        </Tabs>

      </main>
    </div>
  )
}
