"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Api } from "@/service/api-clients"
import { authStore } from "@/store/auth-store"
import { toast } from "sonner"

interface WorkerFormData {
  email: string
  name: string
  password: string
  role: string
}

type FormType = "personnel" | "worker" | null

export function WorkerForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { session } = authStore()

  const [formType, setFormType] = useState<FormType>(null)

  const [formData, setFormData] = useState<WorkerFormData>({
    email: "",
    name: "",
    password: "",
    role: formType == "personnel" ? "manager" : "seamstress",
  })

  const generateEmail = (name: string): string => {
    const sanitized = name.toLowerCase().replace(/\s+/g, ".")
    return `${sanitized}@work.local`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (session?.id) {
        const emailToUse = formType === "worker" ? generateEmail(formData.name) : formData.email
        const passwordToUse = formType === "worker" ? "g3N27b9idw" : formData.password

        const data_request = {
          email: emailToUse,
          name: formData.name,
          password: passwordToUse,
          role: formData.role,
        }
        const response = await Api.workers.create(data_request)
        if (response) {
          const typeLabel = formType === "worker" ? "Работник" : "Персонал"
          toast.success(`${typeLabel} успешно создан - ${emailToUse}`)
          router.push("/workers")
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Неизвестная ошибка")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!formType) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Выберите тип для создания</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button type="button" size="lg" className="h-24 text-lg" onClick={() => setFormType("personnel")}>
                Персонал
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="h-24 text-lg bg-transparent"
                onClick={() => setFormType("worker")}
              >
                Работник
              </Button>
            </div>
          </CardContent>
        </Card>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{formType === "worker" ? "Создание работника" : "Основная информация о персонале"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formType === "personnel" && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">ФИО</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          {formType === "personnel" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Роль</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formType === "personnel" ? (
                    <>
                      <SelectItem value="manager">Менеджер</SelectItem>
                      <SelectItem value="technologist">Технолог</SelectItem>
                      <SelectItem value="accountant">Бухгалтер</SelectItem>
                      <SelectItem value="seamstress">Швея</SelectItem>
                      <SelectItem value="cutter">Закройщик</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="seamstress">Швея</SelectItem>
                      <SelectItem value="cutter">Закройщик</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Создание..." : "Создать"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormType(null)
            setFormData({ email: "", name: "", password: "", role: "manager" })
          }}
        >
          Назад
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
      </div>
    </form>
  )
}
