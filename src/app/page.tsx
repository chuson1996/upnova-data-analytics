'use client'

import { createContext, useState } from 'react'
import FileUpload from '@/components/FileUpload'
import { Analytics } from '@/components/Analytics'

export const AnalyticsContext = createContext({
  orders: null,
});

export default function Home() {
  const [analyticsData, setAnalyticsData] = useState<{
    orders: any;
    orderSizes: Array<{ name: string; value: number }>;
    priceRanges: Array<{ name: string; value: number }>;
    productCategories: Array<{ name: string; value: number }>;
    productTypes: Array<{ name: string; value: number }>;
  } | null>(null);

  return (
    <AnalyticsContext.Provider value={{ orders: analyticsData?.orders || [] }}>
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Shopify Order Analytics
          </h1>
          <FileUpload onDataProcessed={setAnalyticsData} />
          <Analytics data={analyticsData} />
        </div>
      </main>
    </AnalyticsContext.Provider>
  )
}