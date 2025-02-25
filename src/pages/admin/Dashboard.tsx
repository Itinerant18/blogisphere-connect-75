import { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

// Lazy load heavy components
const AnalyticsChart = lazy(() => import('@/components/admin/AnalyticsChart'));
const UserManagement = lazy(() => import('@/components/admin/UserManagement'));
const ContentManager = lazy(() => import('@/components/admin/ContentManager'));

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Suspense fallback={<Spinner />}>
        <AnalyticsChart />
      </Suspense>
      
      <div className="mt-8">
        <Suspense fallback={<Spinner />}>
          <UserManagement />
        </Suspense>
      </div>
      
      <div className="mt-8">
        <Suspense fallback={<Spinner />}>
          <ContentManager />
        </Suspense>
      </div>
    </div>
  );
} 