import { Star } from "lucide-react"

type SupplierStarsProps = {
  count: number
}

export function SupplierStars({ count }: SupplierStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      ))}
    </div>
  )
}
