import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function OrderDetailsSkeleton() {
  return (
    <div className="space-y-4 p-6 bg-background">
      {/* Images skeleton */}
      <Card className="border-border">
        <CardHeader className="bg-muted/30">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order info skeleton */}
      <Card className="border-border">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 bg-muted/20 rounded-lg border border-border">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-muted/20 rounded">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-6 w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Materials skeleton */}
      {[1, 2, 3].map((section) => (
        <Card key={section} className="border-border">
          <CardHeader className="bg-muted/30">
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
