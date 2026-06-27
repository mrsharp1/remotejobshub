import React from 'react'
import { useParams } from 'react-router-dom'
export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <h1 className="font-heading text-4xl font-extrabold">
        Listing Detail Page
      </h1>
      <p className="mt-2">Listing ID: {id}</p>
    </div>
  )
}
