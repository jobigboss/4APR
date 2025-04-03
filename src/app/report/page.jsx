import React from 'react'
import Link from 'next/link'
import Container from '../conponents/Container'
import Reportcheckin from './reportCheckin/page'
import ReportAction1 from './reportaction1/page'
import ReportAction2 from './reportaction2/page'
function Reportpage() {
  return (
    <Container>      
      <div className="flex-grow">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
            กลับสู่เมนูหลัก
          </button>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-start pt-8">
        <h1 className="text-4xl font-semibold mb-4">รายงาน</h1>
        <div className="flex justify-center space-x-4">
          <Reportcheckin />
          <ReportAction1 />
          <ReportAction2 />
        </div>
      </div>
      </div>
    </Container>
  )
}

export default Reportpage
