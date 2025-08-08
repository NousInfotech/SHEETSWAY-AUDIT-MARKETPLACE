"use client"
import { StartButton } from '@/features/engagements/components/StartButton'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
    const router = useRouter()
  return (
    <>
    <div className="flex h-[90%] w-full items-center justify-center bg-gray-50">
      <StartButton text="Start Engagement" onClick={() => router.push("/dashboard/engagements")} />
    </div>
    </>
  )
}

export default Page