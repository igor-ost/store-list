"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { RotateCw } from "lucide-react"
import { Api } from "@/service/api-clients"
import { toast } from "sonner"


export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const data = {
        email: email,
        password: password,
      }
      const response = await Api.auth.login(data)
      if(response.id){
        toast.success(`Авторазиция прошла успешно!`)
        router.push("/dashboard")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Произошла ошибка")
    } finally {
      setIsLoading(false)
    }
  }

    useEffect(() => {
      const handleVerify = async () => {
        try {
          const response = await Api.auth.verify();
          if (response.id) {
            router.push("/dashboard")
          }
        } catch (error) {
          console.log(error)
        }
      };
      handleVerify();
    }, [router]);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-800">Система управления производством</CardTitle>
            <CardDescription>Войдите в свой аккаунт для доступа к системе</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Вход..." : "Войти"} {isLoading ? <RotateCw className="animate-spin"/> : null}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
