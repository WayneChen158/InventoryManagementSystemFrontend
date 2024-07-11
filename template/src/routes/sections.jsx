import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const InventoryPage = lazy(() => import('src/pages/inventory'));
export const RequestPage = lazy(() => import('src/pages/request'))
export const ManufacturePage = lazy(() => import('src/pages/manufacture'));
export const StockPage = lazy(() => import('src/pages/stock'));
export const CustomerPage = lazy(() => import('src/pages/customer'));
export const InvoicePage = lazy(() => import('src/pages/invoice'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'inventory', element: <InventoryPage /> },
        { path: 'request', element: <RequestPage /> },
        { path: 'manufacture', element: <ManufacturePage /> },
        { path: 'stock', element: <StockPage /> },
        { path: 'customer', element: <CustomerPage /> },
        { path: 'invoice', element: <InvoicePage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
