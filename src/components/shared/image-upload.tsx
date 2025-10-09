"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X, Upload } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { ImageViewer } from "./image-viewer"

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const remainingSlots = maxImages - images.length
    if (files.length > remainingSlots) {
      toast.error(`Можно загрузить еще только ${remainingSlots} фото`)
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка загрузки")
      }

      onChange([...images, ...data.urls])
      toast.success(`Загружено ${data.urls.length} фото`)
    } catch (error) {
      console.error("Ошибка загрузки:", error)
      toast.error(`Ошибка: ${error}`)
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const removeImage = async (index: number) => {
    const imageUrl = images[index]

    try {
      const response = await fetch("/api/upload/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: imageUrl }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Ошибка удаления")
      }

      const newImages = images.filter((_, i) => i !== index)
      onChange(newImages)
      toast.success("Фото удалено")
    } catch (error) {
      console.error("Ошибка удаления:", error)
      toast.error(`Ошибка: ${error}`)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Фотографии модели (до {maxImages})</Label>
        <span className="text-sm text-slate-500">
          {images.length} / {maxImages}
        </span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200"
            >
              <button type="button" onClick={() => setViewerIndex(index)} className="w-full h-full cursor-zoom-in">
                <Image src={url || "/placeholder.svg"} alt={`Фото ${index + 1}`} fill className="object-cover" />
              </button>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          <label htmlFor="image-upload">
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              className="w-full cursor-pointer bg-transparent"
              asChild
            >
              <span>
                {isUploading ? (
                  <>Загрузка...</>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Загрузить фото
                  </>
                )}
              </span>
            </Button>
          </label>
          <p className="text-xs text-slate-500 mt-2">Поддерживаются JPG, PNG, WebP. Максимум 20MB на файл.</p>
        </div>
      )}

      {viewerIndex !== null && (
        <ImageViewer images={images} initialIndex={viewerIndex} onClose={() => setViewerIndex(null)} />
      )}
    </div>
  )
}
