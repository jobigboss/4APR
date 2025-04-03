import React from 'react';
import Link from 'next/link';
import Container from './conponents/Container';  // Ensure the path is correct
import Reportcheckin from './reportCheckin/page'; // Ensure the path is correct
import ReportAction1 from './reportaction1/page'; // Ensure the path is correct
import ReportAction2 from './reportaction2/page'; // Ensure the path is correct

function Reportpage() {
  return (
    <Container>
      <div className="relative min-h-screen pt-16"> {/* Added padding-top to push content down */}
        {/* Button Position */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/">
            <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base md:text-lg">
              กลับสู่เมนูหลัก
            </button>
          </Link>
        </div>
        
        <div className="flex flex-col items-center justify-start pt-16"> {/* Added padding-top to align with the button */}
          <h1 className="text-4xl font-semibold mb-8">รายงาน</h1>
          <div className="flex flex-wrap justify-center space-x-4 space-y-4 md:space-y-0">
            <Reportcheckin />
            <ReportAction1 />
            <ReportAction2 />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Reportpage;
