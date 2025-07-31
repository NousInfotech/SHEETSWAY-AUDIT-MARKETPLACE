import PageContainer from '@/components/layout/page-container'
import { AuditRequestPromo } from '@/components/promo/AuditRequestPromo'
import React from 'react'

const page = () => {
  return (
    <PageContainer>
        <div className='mx-auto'>
            <AuditRequestPromo />
        </div>
    </PageContainer>
  )
}

export default page