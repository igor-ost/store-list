"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { OrderGeneral } from "@/@types/orders-types"
import { DeleteDialog } from "./delete-dialog"
import { Api } from "@/service/api-clients"
import { toast } from "sonner"
import { OrdersListSkeleton } from "../loading/order-list"



interface OrdersListProps {
    orders: OrderGeneral[]
}

export function OrdersList({ orders }: OrdersListProps) {
    const [ordersList,setOrders] = useState<OrderGeneral[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(()=>{
        setOrders(orders)
    },[orders])

    const [isLoading,setIsLoading] = useState(false)

    const filteredOrders = ordersList.filter((order) => {
        const matchesSearch =
            order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product_name.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || order.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleStatusChange = (value: string) => {
        setStatusFilter(value)
        setCurrentPage(1)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="destructive" className="text-xs">
                        Ожидает
                    </Badge>
                )
            case "in_progress":
                return <Badge className="bg-blue-100 text-blue-800 text-xs">В работе</Badge>
            case "completed":
                return <Badge className="bg-green-100 text-green-800 text-xs">Завершен</Badge>
            case "cancelled":
                return (
                    <Badge variant="destructive" className="text-xs">
                        Отменен
                    </Badge>
                )
            default:
                return (
                    <Badge variant="secondary" className="text-xs">
                        {status}
                    </Badge>
                )
        }
    }

    const handleRemove = async (id:string) =>{
        setIsLoading(true)
        try {
            const response = await Api.orders.removeById(id);
            if(response.success == true){
                toast.success("Заказ успешно удалён!")
                const updatedOrder = ordersList.filter((item)=> item.id != id)
                setOrders(updatedOrder)
            }
        } catch (error) {
             toast.error(`${error}`)
        }finally{
            setIsLoading(false)
        }
    }

    if(isLoading){
        return <OrdersListSkeleton/>
    }

    return (
        <div className="space-y-4">
            {/* Search and filters */}
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
                                    placeholder="Поиск по номеру, заказчику, изделию..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10 h-9"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Все статусы" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Все статусы</SelectItem>
                            <SelectItem value="pending">Ожидает</SelectItem>
                            <SelectItem value="in_progress">В работе</SelectItem>
                            <SelectItem value="completed">Завершен</SelectItem>
                            <SelectItem value="cancelled">Отменен</SelectItem>
                        </SelectContent>
                        </Select>
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
                            <p className="text-slate-500 text-sm">Заказы не найдены</p>
                        </CardContent>
                    </Card>
                ) : (
                    paginatedOrders.map((order) => (
                        <Card key={order.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-base font-semibold text-slate-800">{order.order_number}</h3>
                                            {getStatusBadge(order.status)}
                                        </div> 
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <span className="text-slate-500 text-xs">Заказчик:</span>
                                                <div className="font-medium">{order.customer.name}</div>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 text-xs">Изделие:</span>
                                                <div className="font-medium">{order.product_name}</div>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 text-xs">Количество:</span>
                                                <div className="font-medium">{order.quantity} шт.</div>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-slate-500">
                                            Дата заказа: {new Date(order.order_date).toLocaleDateString("ru-RU")}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 ml-4">
                                        <Link href={`/orders/details/${order.id}`}>
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent cursor-pointer">
                                                <Eye className="h-3 w-3" />
                                            </Button>
                                        </Link>
                                        {/* <Link href={`/orders/edit/${order.id}`}>
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent cursor-pointer">
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                        </Link> */}
                                        <DeleteDialog id={order.id} title="Удалить заказ" onConfirm={()=>handleRemove(order.id)} itemName={order.order_number}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-700 hover:text-red-800 bg-transparent h-8 w-8 p-0 cursor-pointer"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </DeleteDialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
