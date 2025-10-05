"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ImageViewerProps {
  images: string[]
  initialIndex: number
  onClose: () => void
}

export function ImageViewer({ images, initialIndex, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const resetTransform = useCallback(() => {
    setZoom(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }, [])

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      resetTransform()
    }
  }, [currentIndex, resetTransform])

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
      resetTransform()
    }
  }, [currentIndex, images.length, resetTransform])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 5))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          handlePrevious()
          break
        case "ArrowRight":
          handleNext()
          break
        case "+":
        case "=":
          handleZoomIn()
          break
        case "-":
          handleZoomOut()
          break
        case "r":
        case "R":
          handleRotate()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleNext, handlePrevious, onClose])

  // Сброс трансформации при смене изображения
  useEffect(() => {
    resetTransform()
  }, [currentIndex, resetTransform])

  return (
    <div className="fixed inset-0 z-50 bg-black/98 flex flex-col">
      {/* Верхняя панель управления */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="text-white hover:bg-white/20 disabled:opacity-30"
            title="Уменьшить (клавиша -)"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>

          <span className="text-white text-sm font-medium min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 5}
            className="text-white hover:bg-white/20 disabled:opacity-30"
            title="Увеличить (клавиша +)"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>

          <div className="w-px h-6 bg-white/20 mx-1" />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRotate}
            className="text-white hover:bg-white/20"
            title="Повернуть (клавиша R)"
          >
            <RotateCw className="h-5 w-5" />
          </Button>

          <div className="w-px h-6 bg-white/20 mx-1" />

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
            title="Закрыть (ESC)"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Область изображения */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
      >
        <div
          className="relative transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
          }}
        >
          <div className="relative w-[80vw] h-[80vh]">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Фото ${currentIndex + 1}`}
              fill
              className="object-contain select-none"
              draggable={false}
              priority
            />
          </div>
        </div>
      </div>

      {/* Навигация */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 transition-colors bg-black/30 hover:bg-black/50 rounded-full p-3 backdrop-blur-sm"
          aria-label="Предыдущее фото"
          title="Предыдущее (←)"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 transition-colors bg-black/30 hover:bg-black/50 rounded-full p-3 backdrop-blur-sm"
          aria-label="Следующее фото"
          title="Следующее (→)"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}

      {/* Миниатюры внизу */}
      {images.length > 1 && (
        <div className="absolute bottom-[-10px] left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {images.map((url, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex ? "border-white scale-110" : "border-white/30 hover:border-white/60"
                }`}
              >
                <Image src={url || "/placeholder.svg"} alt={`Миниатюра ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
