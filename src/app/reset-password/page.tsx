import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import AuthLayout from '@/components/layouts/AuthLayout';

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Reset Password">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
