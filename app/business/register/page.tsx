import { RegisterForm } from '@/components/business/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register Your Business - EasyDrop',
  description: 'Create a business account on EasyDrop to manage your deliveries',
};

export default function BusinessRegistrationPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <RegisterForm />
    </div>
  );
} 