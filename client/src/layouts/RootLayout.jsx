import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import { Outlet } from 'react-router-dom';
import { EntryPreloader } from '../components/ui';

export default function RootLayout() {
  return (
    <>
      <EntryPreloader />
      <Navbar />
      <main style={{ paddingTop: 'var(--navbar-height)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
