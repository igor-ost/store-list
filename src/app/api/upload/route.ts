import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Файлы не найдены" }, { status: 400 })
    }

    if (files.length > 5) {
      return NextResponse.json({ error: "Максимум 5 фотографий" }, { status: 400 })
    }


    const uploadDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const uploadedUrls: string[] = []

    for (const file of files) {

      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: `Файл ${file.name} не является изображением` }, { status: 400 })
      }


      if (file.size > 20 * 1024 * 1024) {
        return NextResponse.json({ error: `Файл ${file.name} слишком большой (максимум 5MB)` }, { status: 400 })
      }


      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split(".").pop()
      const fileName = `${timestamp}-${randomString}.${extension}`


      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)


      const filePath = join(uploadDir, fileName)
      await writeFile(filePath, buffer)


      uploadedUrls.push(`/uploads/${fileName}`)
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    })
  } catch (error) {
    console.error("Ошибка загрузки файлов:", error)
    return NextResponse.json({ error: "Ошибка при загрузке файлов" }, { status: 500 })
  }
}
