import { type NextRequest, NextResponse } from "next/server"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL не указан" }, { status: 400 })
    }

    // Извлекаем имя файла из URL (например: /uploads/123-abc.jpg -> 123-abc.jpg)
    const fileName = url.split("/").pop()
    if (!fileName) {
      return NextResponse.json({ error: "Некорректный URL" }, { status: 400 })
    }

    // Путь к файлу
    const filePath = join(process.cwd(), "public", "uploads", fileName)

    // Проверяем существование файла
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 404 })
    }

    // Удаляем файл
    await unlink(filePath)

    return NextResponse.json({
      success: true,
      message: "Файл успешно удален",
    })
  } catch (error) {
    console.error("Ошибка удаления файла:", error)
    return NextResponse.json({ error: "Ошибка при удалении файла" }, { status: 500 })
  }
}
