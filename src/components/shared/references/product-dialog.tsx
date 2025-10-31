"use client"

import type React from "react"

import { ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProductMaterialDialog } from "./product-material-dialog"
import { Materials, ProductsTemplate } from "@/app/reference-books/page"
import ProductMaterial from "./product-material"

interface OrderTemplateFormProps {
  children: ReactNode
  template?: ProductsTemplate
  materials: Materials
  onCreate: (name: string, descirption: string, materials:Materials) => void
  onUpdate: (id: string, name: string, descirption: string, materials: Materials) => void
}


export function ProductDialog({ template, materials,onCreate, onUpdate,children }: OrderTemplateFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(
    template || {
      id: "",
      name: "",
      description: "",
      materials: {
        zippers:[],
        threads:[],
        buttons:[],
        fabrics:[],
        accessories:[],
        velcro:[]
      }
    },
  )

  const handleAddMaterial = (id: string, qty: number, type: keyof Materials) => {
    console.log(id, qty, type)


    const item = materials[type].find((m) => m.id === id)
    if (!item) return

    setFormData((prev) => ({
      ...prev,
      materials: {
        ...prev.materials,
        [type]: [
          ...prev.materials[type],
          { ...item, qty } 
        ]
      }
    }))
  }

  const handleRemoveMaterial = (index: number, type: keyof Materials) => {
    setFormData((prev) => ({
      ...prev,
      materials: {
        ...prev.materials,
        [type]: prev.materials[type].filter((_, i) => i !== index),
      },
    }))
  }


  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setOpen(false)
      if (template) {
        onUpdate(formData.id, formData.name, formData.description, formData.materials)
      } else {
        onCreate(formData.name, formData.description, formData.materials, )
      }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Новый шаблон</DialogTitle>
          <DialogDescription>Заполните информацию о шаблоне и добавьте необходимые материалы</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название изделия</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Летняя куртка"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Подробное описание..."
                rows={3}
                required
              />
            </div>
          </div>



          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Материалы</h3>
              <ProductMaterialDialog handleAdd={handleAddMaterial} materials={materials}/>
            </div>

            <div className="space-y-2">
              {formData.materials.accessories.map((material, index) => (
                <ProductMaterial
                  key={"accessories_" + index}
                  id={material.id}
                  name={material.name}
                  qty={material.qty}
                  type="accessories"
                  unit={material.unit}
                  handleRemove={() => handleRemoveMaterial(index, "accessories")}
                />
              ))}
              {formData.materials.buttons.map((material, index) => (
                <ProductMaterial
                  key={"buttons_" + index}
                  id={material.id}
                  name={material.color + " " + material.type}
                  qty={material.qty}
                  type="buttons"
                  unit={material.unit}
                  handleRemove={() => handleRemoveMaterial(index, "buttons")}
                />
              ))}
              {formData.materials.fabrics.map((material, index) => (
                <ProductMaterial
                  key={"fabrics_" + index}
                  id={material.id}
                  name={material.name + " " + material.color}
                  qty={material.qty}
                  type="fabrics"
                  unit={material.unit}
                  handleRemove={() => handleRemoveMaterial(index, "fabrics")}
                />
              ))}
              {formData.materials.threads.map((material, index) => (
                <ProductMaterial
                  key={"threads_" + index}
                  id={material.id}
                  name={material.color + " " + material.type}
                  qty={material.qty}
                  type="threads"
                  unit={material.unit}
                  handleRemove={() => handleRemoveMaterial(index, "threads")}
                />
              ))}
              {formData.materials.velcro.map((material, index) => (
                <ProductMaterial
                  key={"velcro_" + index}
                  id={material.id}
                  name={material.name}
                  qty={material.qty}
                  type="velcro"
                  unit={material.unit}
                  handleRemove={() => handleRemoveMaterial(index, "velcro")}
                />
              ))}
              {formData.materials.zippers.map((material, index) => (
                <ProductMaterial
                  key={"zippers_" + index}
                  id={material.id}
                  name={material.color + " " + material.type}
                  qty={material.qty}
                  type="zippers"
                  unit={material.unit}
                  handleRemove={() => handleRemoveMaterial(index, "zippers")}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Создать изделие
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
