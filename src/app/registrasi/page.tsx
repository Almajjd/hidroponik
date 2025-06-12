import RegistrationForm from '@/components/auth/RegistrationForm';
import AuthLayout from '@/components/layouts/AuthLayout';

export default function RegistrationPage() {
  return (
    <AuthLayout title="Create Account">
      <RegistrationForm />
    </AuthLayout>
  );
}
