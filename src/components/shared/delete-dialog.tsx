"use client"

import { AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import React, { useState } from 'react'


interface DeleteConfirmationDialogProps {
  open?: boolean
  setOpen?: (open: boolean) => void
  onConfirm:  (id: string | number) => void
  title?: string
  id: string | number
  description?: string
  itemName?: string
  isLoading?: boolean
  children: React.ReactNode
}

export function DeleteDialog({
  onConfirm,
  isLoading: externalLoading = false,
  open: externalOpen,
  setOpen: externalSetOpen,
  title = "Удалить",
  description,
  id,
  itemName,
  children
}: DeleteConfirmationDialogProps) {

  const [internalOpen, setInternalOpen] = useState(false)
  const [internalLoading, setInternalLoading] = useState(false)

  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = externalSetOpen || setInternalOpen
  const isLoading = externalLoading || internalLoading

   const handleConfirm = async () => {
    try {
      setInternalLoading(true)
      await onConfirm(id)
      setOpen(false)
    } catch (error) {
      console.error("Delete operation failed:", error)
    } finally {
      setInternalLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      setOpen(newOpen)
      if (!newOpen) {
        setInternalLoading(false)
      }
    }
  }


  const defaultDescription = itemName
    ? `Вы уверены, что хотите удалить "${itemName}"? Это действие не может быть отменено и безвозвратно удалит все связанные данные.`
    : "Вы уверены, что хотите удалить этот элемент? Это действие не может быть отменено и безвозвратно удалит все связанные с ним данные.."

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20">
            <AlertTriangle className="h-8 w-8 text-red-800 dark:text-red-800" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400 mt-2 text-center">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <div className="flex justify-center gap-4 mt-4 w-full">
          <Button
            variant="outline"
            className='cursor-pointer'
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            variant="destructive"
            className="bg-red-800 cursor-pointer hover:bg-red-700"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Удаление...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Удалить
              </>
            )}
          </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
