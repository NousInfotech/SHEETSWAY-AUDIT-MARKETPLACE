import PageContainer from '@/components/layout/page-container'
import FilesandDocuments from '@/features/engagements/components/FilesandDocuments'
import React from 'react'

const page = () => {
  return (
    <>
    <div className='container w-full max-w-7xl mx-auto overflow-y-auto'>
        <FilesandDocuments />
    </div>
    </>
  )
}

export default page
