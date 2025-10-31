import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

const materialTypes = [
  { value: "zippers", label: "Молния" },
  { value: "threads", label: "Нитки" },
  { value: "buttons", label: "Пуговицы" },
  { value: "fabrics", label: "Ткань" },
  { value: "accessories", label: "Фурнитура" },
  { value: "velcro", label: "Велкро" },
] as const

export default function ProductMaterialMini({
  id,
  name,
  qty,
  type,
  unit,
  handleRemove,
}: {
  id: string
  name: string
  qty: number
  type: string
  unit: string
  handleRemove: (id: string) => void
}) {
  const typeLabel = materialTypes.find((t) => t.value === type)?.label

  return (
    <div
      key={id}
      className="grid grid-cols-2 gap-2 items-center border rounded-md p-2 bg-muted/40 text-sm"
    >
      <div className="flex flex-col">
        <span className="font-medium truncate">{name}</span>
        <span className="text-xs text-muted-foreground mt-0.5">
          {qty} {unit}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{typeLabel}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => handleRemove(id)}
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </div>
    </div>
  )
}
