"use client"

import { OrderMaterialItem } from "./order-material-item"

interface Material {
  id: string
  qty: number
  name?: string
  color?: string
  type?: string
  unit?: string
  price?: number
}

interface OrderMaterialSectionProps {
  title: string
  materials: Material[]
  onMaterialChange: (materialId: string, newQty: number) => void
  onMaterialDelete: (materialId: string) => void
}

export function OrderMaterialSection({
  title,
  materials,
  onMaterialChange,
  onMaterialDelete,
}: OrderMaterialSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      {materials.length === 0 ? (
        null
      ) : (
        <div className="space-y-2">
          {materials.map((material) => (
            <OrderMaterialItem
              key={material.id}
              name={material.name}
              type={material.type}
              color={material.color}
              qty={material.qty}
              unit={material.unit}
              price={material.price}
              onQtyChange={(newQty) => onMaterialChange(material.id, newQty)}
              onDelete={() => onMaterialDelete(material.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
