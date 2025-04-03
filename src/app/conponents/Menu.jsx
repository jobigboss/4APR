import Container from './Container'
import { LuMapPinCheckInside } from "react-icons/lu";
import Link from 'next/link';
import { FaChartBar, FaClipboardList, FaFileAlt } from "react-icons/fa";


function MenuPage() {

  const menuItems = [
    { name: "Check-in", icon: <LuMapPinCheckInside size={30} />, href: "/checkin" },
    { name: "กิจกรรมที่ 1", icon: <FaClipboardList size={30} />, href: "/activity01" },
    { name: "กิจกรรมที่ 2", icon: <FaChartBar size={30} />, href: "/activity02" },
    { name: "Report", icon: <FaFileAlt size={30} />, href: "/report" },
  ];
  return (
    <Container>       
    <div className="flex flex-wrap justify-center gap-5 mt-5">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href} className="text-center">
            <div className="w-[120px] h-[120px] sm:w-[100px] sm:h-[100px] flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-3 transition hover:scale-105 hover:bg-gray-100">
              <div className="text-gray-700">{item.icon}</div>
              <span className="mt-2 text-sm font-medium">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}

export default MenuPage