import type { ReactNode } from "react"

type PageHeadingProps = {
  title: string
  description: string
  action?: ReactNode
}

export function PageHeading({ title, description, action }: PageHeadingProps) {
  const content = (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-white">{title}</h1>
      <p className="text-[#9CA3AF]">{description}</p>
    </div>
  )

  if (!action) {
    return content
  }

  return (
    <div className="flex items-center justify-between">
      {content}
      {action}
    </div>
  )
}
