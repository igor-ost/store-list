export interface MemoryStats {
  heapUsed: number
  heapTotal: number
  heapUsedMB: number
  heapTotalMB: number
  heapUsedPercent: number
  rss: number
  rssMB: number
  external: number
  externalMB: number
}

export function getMemoryStats(): MemoryStats {
  const memUsage = process.memoryUsage()
  const heapUsed = memUsage.heapUsed
  const heapTotal = memUsage.heapTotal

  return {
    heapUsed,
    heapTotal,
    heapUsedMB: Math.round((heapUsed / 1024 / 1024) * 100) / 100,
    heapTotalMB: Math.round((heapTotal / 1024 / 1024) * 100) / 100,
    heapUsedPercent: Math.round((heapUsed / heapTotal) * 100 * 100) / 100,
    rss: memUsage.rss,
    rssMB: Math.round((memUsage.rss / 1024 / 1024) * 100) / 100,
    external: memUsage.external,
    externalMB: Math.round((memUsage.external / 1024 / 1024) * 100) / 100,
  }
}

export function logMemory(label: string, before?: MemoryStats) {
  const after = getMemoryStats()

  if (before) {
    const diff = after.heapUsedMB - before.heapUsedMB
    console.log(
      `[v0 Memory] ${label} | Before: ${before.heapUsedMB}MB (${before.heapUsedPercent}%) | After: ${after.heapUsedMB}MB (${after.heapUsedPercent}%) | Diff: ${diff > 0 ? "+" : ""}${diff}MB`,
    )
  } else {
    console.log(
      `[v0 Memory] ${label} | Heap: ${after.heapUsedMB}MB / ${after.heapTotalMB}MB (${after.heapUsedPercent}%) | RSS: ${after.rssMB}MB`,
    )
  }

  return after
}
