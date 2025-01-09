'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { ShopifyOrder } from '@/types/shopify'

interface FileUploadProps {
  onDataProcessed: (data: {
    orders: any;
    orderSizes: Array<{ name: string; value: number }>;
    priceRanges: Array<{ name: string; value: number }>;
    productCategories: Array<{ name: string; value: number }>;
    productTypes: Array<{ name: string; value: number }>;
  }) => void;
}

export default function FileUpload({ onDataProcessed }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const orders = JSON.parse(e.target?.result as string) as ShopifyOrder[];
          const {
            processOrderSizes,
            processPriceRanges,
            processProductCategories,
            processProductTypes
          } = await import('@/utils/analytics');

          onDataProcessed({
            orders,
            orderSizes: processOrderSizes(orders),
            priceRanges: processPriceRanges(orders),
            productCategories: processProductCategories(orders),
            productTypes: processProductTypes(orders)
          });
        } catch (error) {
          console.error('Error processing data:', error);
        }
      }
      reader.readAsText(file)
    }
  }, [onDataProcessed])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    multiple: false
  })

  return (
    <div className="mb-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <ArrowUpTrayIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg text-gray-600">
          {isDragActive
            ? 'Drop the JSON file here'
            : 'Drag & drop your Shopify orders JSON file here, or click to select'}
        </p>
        <p className="text-sm text-gray-500 mt-2">Only JSON files are accepted</p>
      </div>
    </div>
  )
}