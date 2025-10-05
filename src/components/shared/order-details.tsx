"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Package, Hash, Palette, Ruler, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { OrderInfo } from "@/@types/orders-types"
import { Api } from "@/service/api-clients"
import { toast } from "sonner"
import { OrderDetailsSkeleton } from "../loading/order-details"
import Image from "next/image"
import { ImageViewer } from "./image-viewer"


interface OrderDetailsProps {
    id: string
}

export function OrderDetails({ id }: OrderDetailsProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge variant="destructive">Ожидает</Badge>
            case "in_progress":
                return <Badge className="bg-blue-100 text-blue-800">В работе</Badge>
            case "completed":
                return <Badge className="bg-green-100 text-green-800">Завершен</Badge>
            case "cancelled":
                return <Badge variant="destructive">Отменен</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const [order, setOrder] = useState<OrderInfo | null>(null)
    const [images, setImages] = useState<string[]>([])
    const [viewerIndex, setViewerIndex] = useState<number | null>(null)

    useEffect(() => {
        const handleGetOrders = async () => {
            try {
                const response = await Api.orders.getOrder(id);
                if (response) {
                    setOrder(response)
                    setImages(response.image_urls)
                }
            } catch (error) {
                console.log(error)
                toast.error(`Не удалось загрузить заказ: ${error}`)
            } finally {

            }
        }
        handleGetOrders()
    }, [id])

    if (order == null) {
        return <OrderDetailsSkeleton />
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Основная информация
                        {getStatusBadge(order?.status)}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex items-center gap-3">
                            <Hash className="h-5 w-5 text-slate-500" />
                            <div>
                                <div className="text-sm text-slate-500">Номер заказа</div>
                                <div className="font-semibold">{order.order_number}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-slate-500" />
                            <div>
                                <div className="text-sm text-slate-500">Дата заказа</div>
                                <div className="font-semibold">{new Date(order.order_date).toLocaleDateString("ru-RU")}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-slate-500" />
                            <div>
                                <div className="text-sm text-slate-500">Заказчик</div>
                                <div className="font-semibold">{order.customer.name}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-slate-500" />
                            <div>
                                <div className="text-sm text-slate-500">Количество</div>
                                <div className="font-semibold">{order.quantity} шт.</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className="text-sm text-slate-500 mb-2">Наименование изделия</div>
                        <div className="text-lg font-semibold">{order.product_name}</div>
                    </div>
                    {order.notes && (
                        <div className="mt-6">
                            <div className="text-sm text-slate-500 mb-2">Примечания</div>
                            <div className="text-slate-700 bg-slate-50 p-3 rounded-lg">{order.notes}</div>
                        </div>
                    )}
                    {images.length > 0 && (
                        <div className="mt-6">
                            <div className="text-sm text-slate-500 mb-2">Фотографии</div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {images.map((url, index) => (
                                    <div
                                        key={index}
                                        className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200"
                                    >
                                        <button type="button" onClick={() => setViewerIndex(index)} className="w-full h-full cursor-zoom-in">
                                            <Image src={url || "/placeholder.svg"} alt={`Фото ${index + 1}`} fill className="object-cover" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {viewerIndex !== null && (
                                <ImageViewer images={images} initialIndex={viewerIndex} onClose={() => setViewerIndex(null)} />
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-md rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Ткани</CardTitle>
                </CardHeader>
                <CardContent>
                    {order.fabrics && order.fabrics.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-5 lg:grid-cols-5">
                            {order.fabrics.map((fabric) => (
                                <div
                                    key={fabric.id}
                                    className="p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition"
                                >
                                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                        <Package className="w-4 h-4 text-slate-500" />
                                        <span>Наименование ткани:</span>
                                        <Badge variant="outline">{fabric.name || "—"}</Badge>
                                    </div>
                                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                        <Palette className="w-4 h-4 text-slate-500" />
                                        <span>Цвет:</span>
                                        <Badge variant="outline">{fabric.color || "—"}</Badge>
                                    </div>

                                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                        <Ruler className="w-4 h-4 text-slate-500" />
                                        <span>Длинна:</span>
                                        <Badge variant="outline">{fabric.stock_meters} м</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-slate-500 text-center py-6">Нет информации о тканях</div>
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-md rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Молнии</CardTitle>
                </CardHeader>
                <CardContent>
                    {order.zippers && order.zippers.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-5 lg:grid-cols-5">
                            {order.zippers.map((zipper) => (
                                <div
                                    key={zipper.id}
                                    className="p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition"
                                >

                                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                        <Package className="w-4 h-4 text-slate-500" />
                                        <span>Тип молнии:</span>
                                        <Badge variant="outline">{zipper.type || "—"}</Badge>
                                    </div>

                                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                        <Palette className="w-4 h-4 text-slate-500" />
                                        <span>Цвет:</span>
                                        <Badge variant="outline">{zipper.color || "—"}</Badge>
                                    </div>

                                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                        <Package className="w-4 h-4 text-slate-500" />
                                        <span>В наличии:</span>
                                        <Badge variant="outline">{zipper.stock_quantity} шт</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-slate-500 text-center py-6">Нет информации о молниях</div>
                    )}
                </CardContent>
            </Card>

            {/* Workers */}
            <Card>
                <CardHeader>
                    <CardTitle>Работники</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-slate-500 text-center py-8">
                        Информация о работниках будет отображаться после расширения функционала
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
