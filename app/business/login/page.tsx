import { LoginForm } from '@/components/business/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Login - EasyDrop',
  description: 'Login to your business account on EasyDrop',
};

export default function BusinessLoginPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <LoginForm />
    </div>
  );
} 