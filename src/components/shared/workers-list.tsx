"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { DeleteDialog } from "./delete-dialog"
import { Api } from "@/service/api-clients"
import { toast } from "sonner"
import { WorkersGeneral } from "@/@types/workers-types"
import RoleBadge from "./role-badge"



interface WorkersListProps {
    workers: WorkersGeneral[]
}

export function WorkersList({ workers }: WorkersListProps) {
    const [workersList, setWorkers] = useState<WorkersGeneral[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        setWorkers(workers)
    }, [workers])

    const [isLoading, setIsLoading] = useState(false)

    const filteredOrders = workersList.filter((workers) => {
        const matchesSearch =
            workers.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            workers.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            workers.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            workers.role.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesSearch
    })

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleRemove = async (id: string) => {
        setIsLoading(true)
        try {
            const response = await Api.workers.removeById(id);
            if (response.success == true) {
                toast.success("Персонал успешно удалён!")
                const updatedOrder = workersList.filter((item) => item.id != id)
                setWorkers(updatedOrder)
            }
        } catch (error) {
            toast.error(`${error}`)
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Поиск и фильтры</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex gap-3 flex-wrap">
                        <div className="flex-1 min-w-64">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input
                                    placeholder="Поиск по Email, ФИО, роль..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10 h-9"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                    Показано {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOrders.length)} из{" "}
                    {filteredOrders.length}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="h-8 w-8 p-0 text-xs"
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>


            <div className="grid gap-3">
                {paginatedOrders.length === 0 ? (
                    <Card>
                        <CardContent className="py-6 text-center">
                            <p className="text-slate-500 text-sm">Персонал не найден</p>
                        </CardContent>
                    </Card>
                ) : (
                    paginatedOrders.map((worker) => (
                        <Card key={worker.id} className="hover:shadow transition-shadow rounded-xl">
                            <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex gap-2 text-xs">
                                            <div className="w-[200px]">
                                                <span className="text-slate-500 block">Email:</span>
                                                <span className="font-medium">{worker.email}</span>
                                            </div>
                                            <div className="w-[200px]">
                                                <span className="text-slate-500 block">ФИО:</span>
                                                <span className="font-medium">{worker.name}</span>
                                            </div>
                                            <div className="w-[200px]">
                                                <span className="text-slate-500 block text-xs mb-0.5">Роль:</span>
                                                <RoleBadge role={worker.role} />
                                            </div>
                                            <div className="w-[200px]">
                                                <span className="text-slate-500 block text-xs mb-0.5">Дата создания:</span>
                                                {new Date(worker.createdAt).toLocaleDateString("ru-RU")}
                                            </div>
                                        </div>
                                    </div>
                                    {worker.role !== "admin"  &&(
                                         <div className="flex items-center gap-1 ml-3">
                                            {/* <Link href={`/workers/${worker.id}`}>
                                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                            </Link> */}
                                            <Link href={`/workers/edit/${worker.id}`}>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer">
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                            </Link>
                                            <DeleteDialog
                                                id={worker.id}
                                                title="Удалить персонал"
                                                onConfirm={() => handleRemove(worker.id)}
                                                itemName={worker.email}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-red-600 hover:text-red-700 cursor-pointer"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </DeleteDialog>
                                        </div>
                                    )}
                                    
                                </div>
                            </CardContent>
                        </Card>

                    ))
                )}
            </div>
        </div>
    )
}
