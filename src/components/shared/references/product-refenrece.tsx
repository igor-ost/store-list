"use client"

import type React from "react"

import { type SetStateAction, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Trash2, Eye } from "lucide-react"
import type { Materials, ProductsTemplate } from "@/app/reference-books/page"
import { Input } from "@/components/ui/input"
import { ProductDialog } from "./product-dialog"
import { ProductDetailsCard } from "./product-details-card"
import { toast } from "sonner"
import { Api } from "@/service/api-clients"

interface OrderTemplatesTableProps {
  templates: ProductsTemplate[]
  materials: Materials
  setTemplates: React.Dispatch<SetStateAction<ProductsTemplate[]>>
  loading: boolean
  setLoading: React.Dispatch<SetStateAction<boolean>>
}

export function ProductReference({
  templates,
  setTemplates,
  materials,
  loading,
  setLoading,
}: OrderTemplatesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<ProductsTemplate | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredThreads = templates.filter(
    (templates) =>
      templates.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      templates.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreate = async (name: string, description: string, materials: Materials) => {
    try {
      const data = {
        name: name,
        description: description,
        materials: materials,
      }
      setLoading(true)
      const response = await Api.products.create(data)
      if (response) {
        setTemplates((prev) => [...prev, { ...data, id: response.id }])
      }
      toast.success(`Изделия ${data.name}, создана`)
    } catch (error) {
      toast.error(`Ошибка: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string, name: string, description: string, materials: Materials) => {
    console.log(id, name, description, materials)
  }

  const handleViewDetails = (product: ProductsTemplate) => {
    setSelectedProduct(product)
    setIsDetailsOpen(true)
  }

  return (
    <>
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Изделия</h1>
              </div>
              <ProductDialog materials={materials} onCreate={handleCreate} onUpdate={handleUpdate}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать Изделие
                </Button>
              </ProductDialog>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Поиск..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {templates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{searchTerm ? "Изделия не найдены" : "Нет изделий"}</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? "Попробуйте изменить критерии поиска" : "Добавьте Изделия для начала работы"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead className="text-center">Материалов</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredThreads.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell className="max-w-md truncate">{template.description}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">
                          {[
                            template.materials?.accessories?.length ?? template.accessories?.length ?? 0,
                            template.materials?.buttons?.length ?? template.buttons?.length ?? 0,
                            template.materials?.fabrics?.length ?? template.fabrics?.length ?? 0,
                            template.materials?.threads?.length ?? template.threads?.length ?? 0,
                            template.materials?.velcro?.length ?? template.velcro?.length ?? 0,
                            template.materials?.zippers?.length ?? template.zippers?.length ?? 0,
                          ].reduce((sum, count) => sum + count, 0)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(template)}
                            title="Просмотр деталей"
                          >
                            <Eye className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </main>
      </div>

      <ProductDetailsCard product={selectedProduct} isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} />
    </>
  )
}
