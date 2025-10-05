"use client"

import { Header } from "@/components/shared/header"
import CustomerReference from "@/components/shared/customer-reference"


export default function ReferencesPage() {


  return (
    <div className="min-h-screen bg-background">
      <Header active={"reference-books"} />
      <main className="container mx-auto px-4 py-8">
        <CustomerReference/>
      </main>
    </div>
  )
}
