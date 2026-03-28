import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[#F6F5F0]">
      <Navbar />
      <Outlet />
    </div>
  );
}
