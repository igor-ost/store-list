/* eslint-disable */
"use client"

import type { ProductsTemplate } from "@/app/reference-books/page"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@radix-ui/react-select"


interface ProductDetailsCardProps {
  product: ProductsTemplate | null
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailsCard({ product, isOpen, onClose }: ProductDetailsCardProps) {
  if (!product) return null

  const calculateTotalCost = () => {
    let total = 0

    const materials = product.materials || product
    if (materials.zippers) {
      materials.zippers.forEach((item: any) => {
        total += (item.zipper?.price || 0) * (item.qty || 0)
      })
    }
    if (materials.threads) {
      materials.threads.forEach((item: any) => {
        total += (item.thread?.price || 0) * (item.qty || 0)
      })
    }
    if (materials.buttons) {
      materials.buttons.forEach((item: any) => {
        total += (item.button?.price || 0) * (item.qty || 0)
      })
    }
    if (materials.fabrics) {
      materials.fabrics.forEach((item: any) => {
        total += (item.fabric?.price || 0) * (item.qty || 0)
      })
    }
    if (materials.accessories) {
      materials.accessories.forEach((item: any) => {
        total += (item.accessory?.price || 0) * (item.qty || 0)
      })
    }
    if (materials.velcro) {
      materials.velcro.forEach((item: any) => {
        total += (item.velcro?.price || 0) * (item.qty || 0)
      })
    }

    return total
  }

  const materials = product.materials || product
  const totalCost = calculateTotalCost()

  const renderMaterialsSection = (
    title: string,
    items: any[],
    getItemData: (item: any) => { name: string; qty: number; price: number; unit: string },
  ) => {
    if (!items || items.length === 0) return null

    return (
      <div key={title} className="mb-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">{title}</h3>
        <Table>
          <TableBody>
            {items.map((item, idx) => {
              const data = getItemData(item)
              const itemTotal = data.price * data.qty
              return (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{data.name}</TableCell>
                  <TableCell className="text-right">{data.qty} ({data.unit})</TableCell>
                  <TableCell className="text-right">{data.price.toLocaleString("ru-RU")} ₸</TableCell>
                  <TableCell className="text-right font-semibold">{itemTotal.toLocaleString("ru-RU")} ₸</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
        </DialogHeader>

        <div className="space-y-6">
          {renderMaterialsSection("Молнии", materials.zippers, (item) => ({
            name: `${item.zipper?.color} ${item.zipper?.type}`,
            qty: item.qty,
            price: item.zipper?.price || 0,
            unit: item.zipper?.unit || "",
          }))}

          {renderMaterialsSection("Нитки", materials.threads, (item) => ({
            name: `${item.thread?.color} ${item.thread?.type}`,
            qty: item.qty,
            price: item.thread?.price || 0,
            unit: item.thread?.unit || "",
          }))}

          {renderMaterialsSection("Пуговицы", materials.buttons, (item) => ({
            name: `${item.button?.color} ${item.button?.type}`,
            qty: item.qty,
            price: item.button?.price || 0,
            unit: item.button?.unit || "",
          }))}

          {renderMaterialsSection("Ткани", materials.fabrics, (item) => ({
            name: `${item.fabric?.name} (${item.fabric?.color})`,
            qty: item.qty,
            price: item.fabric?.price || 0,
            unit: item.fabric?.unit || "",
          }))}

          {renderMaterialsSection("Фурнитура", materials.accessories, (item) => ({
            name: item.accessory?.name || "",
            qty: item.qty,
            price: item.accessory?.price || 0,
            unit: item.accessory?.unit || "",
          }))}

          {renderMaterialsSection("Велькро", materials.velcro, (item) => ({
            name: item.velcro?.name || "",
            qty: item.qty,
            price: item.velcro?.price || 0,
            unit: item.velcro?.unit || "",
          }))}

          <Separator />

          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-muted-foreground mb-2">Общая стоимость:</p>
              <p className="text-2xl font-bold text-primary">{totalCost.toLocaleString("ru-RU")} ₸</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
