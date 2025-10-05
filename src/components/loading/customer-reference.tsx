import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function CustomerReferenceSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Заголовок и кнопка */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
            </div>
            <Skeleton className="h-10 w-44 rounded-md" />
          </div>
        </div>

        {/* Поиск */}
        <div className="mb-6">
          <div className="relative">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        {/* Таблица */}
        <Card>
          <CardContent className="px-4">
            <div className="space-y-4">
              {/* Заголовки */}
              <div className="flex justify-between py-2 border-b">
                <Skeleton className="h-4 w-[40%]" />
                <Skeleton className="h-4 w-[20%]" />
                <Skeleton className="h-4 w-[20%]" />
                <Skeleton className="h-4 w-[10%]" />
              </div>

              {/* Рядки */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3 border-b last:border-0"
                >
                  <Skeleton className="h-5 w-[40%]" />
                  <Skeleton className="h-5 w-[20%]" />
                  <Skeleton className="h-5 w-[20%]" />
                  <div className="flex gap-2 justify-end w-[10%]">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
