const DEFAULT_BASE_PATH = ""

function normalizeBasePath(value?: string) {
  if (!value) {
    return DEFAULT_BASE_PATH
  }

  const trimmedValue = value.trim().replace(/\/+$/, "")

  if (!trimmedValue || trimmedValue === "/") {
    return DEFAULT_BASE_PATH
  }

  return trimmedValue.startsWith("/") ? trimmedValue : `/${trimmedValue}`
}

export const appBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH)

export const appRoutes = {
  overview: "/dashboard",
  legacyOverview: "/",
  staff: "/staff",
  roles: "/roles",
  vehicles: "/vehicles",
  rfqs: "/rfqs",
  createRfq: "/rfqs/create",
  orders: "/orders",
  suppliers: "/suppliers",
  savedSearches: "/saved-searches",
  integrations: "/integrations",
  apiKeys: "/api-keys",
  addOns: "/add-ons",
  support: "/support",
  reports: "/reports",
  plans: "/plans",
  settings: "/settings",
  login: "/login",
} as const

export function appPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return normalizedPath === appBasePath || normalizedPath.startsWith(`${appBasePath}/`)
    ? normalizedPath
    : `${appBasePath}${normalizedPath === "/" ? "" : normalizedPath}`
}

export function stripBasePath(pathname: string | null) {
  if (!pathname) {
    return appRoutes.overview
  }

  if (pathname === appBasePath) {
    return appRoutes.overview
  }

  if (pathname.startsWith(`${appBasePath}/`)) {
    return pathname.slice(appBasePath.length) || appRoutes.overview
  }

  return pathname
}
