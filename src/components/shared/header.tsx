"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3, ShoppingCart, FileText, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { UserInfo } from "./user-info"

type NavigationItem = "statistics" | "orders" | "reports" | "workers"

export function Header({active ="orders"}:{active:NavigationItem}) {
  const [activeTab] = useState<NavigationItem>(active)
  const router = useRouter();
  const navigationItems = [
    {
      id: "statistics" as NavigationItem,
      label: "Статистика",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      id: "orders" as NavigationItem,
      label: "Заказы",
      href: "/orders",
      icon: ShoppingCart,
    },
    {
      id: "workers" as NavigationItem,
      label: "Персонал",
      href: "/workers",
      icon: UserCircle,
    },
    {
      id: "reports" as NavigationItem,
      label: "Отчёты",
      href: "/reports",
      icon: FileText,
    },
  ]
  
  return (
    <header className="sticky top-0 z-50 w-full bg-primary border-b border-border shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent-foreground" />
            </div>
            <h1 className="text-xl font-bold text-primary-foreground font-sans">Бизнес Панель</h1>
          </div>


          <nav className="flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-sans">{item.label}</span>
                </Button>
              )
            })}
          </nav>


          <div className="flex items-center space-x-3">
            <UserInfo/>
          </div>
        </div>
      </div>
    </header>
  )
}
