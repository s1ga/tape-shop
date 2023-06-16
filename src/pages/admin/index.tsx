import dynamic from 'next/dynamic';

const App = dynamic(() => import('@/pages/admin/components/Admin'), { ssr: false });
const AdminPage = () => <App />;
export default AdminPage;
