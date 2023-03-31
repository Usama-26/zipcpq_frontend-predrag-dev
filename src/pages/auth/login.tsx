import EmptyLayout from '@/layouts/EmptyLayout';
import dynamic from 'next/dynamic';
const Login = dynamic(() => import('@/modules/auth/Login'), {});

const Index = () => {
  return (
    <EmptyLayout>
      <Login />
    </EmptyLayout>
  );
};

export default Index;
