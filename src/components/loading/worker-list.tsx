import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function WorkerListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search skeleton */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            <Skeleton className="h-5 w-36" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-64">
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      {/* Workers list skeleton */}
      <div className="grid gap-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="hover:shadow transition-shadow rounded-xl">
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex gap-2 text-xs">
                    <div className="w-[200px]">
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                    <div className="w-[200px]">
                      <Skeleton className="h-3 w-12 mb-1" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                    <div className="w-[200px]">
                      <Skeleton className="h-3 w-10 mb-1" />
                      <Skeleton className="h-4 w-20 rounded-full" />
                    </div>
                    <div className="w-[200px]">
                      <Skeleton className="h-3 w-24 mb-1" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <Skeleton className="h-7 w-7 rounded-md" />
                  <Skeleton className="h-7 w-7 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
