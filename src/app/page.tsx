'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import { Analytics } from '@/components/Analytics'

export default function Home() {
  const [analyticsData, setAnalyticsData] = useState<{
    orderSizes: Array<{ name: string; value: number }>;
    priceRanges: Array<{ name: string; value: number }>;
    productCategories: Array<{ name: string; value: number }>;
    productTypes: Array<{ name: string; value: number }>;
  } | null>(null);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Shopify Order Analytics
        </h1>
        <FileUpload onDataProcessed={setAnalyticsData} />
        <Analytics data={analyticsData} />
      </div>
    </main>
  )
}