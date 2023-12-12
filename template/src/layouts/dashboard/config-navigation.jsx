import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/',
  //   icon: icon('ic_analytics'),
  // },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Request',
    path: '/request',
    icon: <Iconify icon="mdi:offer" width={25}/>,
  },
  {
    title: 'Inventory',
    path: '/inventory',
    icon: <Iconify icon="tabler:building-warehouse" width={25}/>,
  },
  {
    title: 'Manufacture',
    path: '/manufacture',
    icon: <Iconify icon="openmoji:lab-coat" width={25}/>,
  },
  {
    title: 'Stock',
    path: '/stock',
    icon: icon('ic_cart'),
  },
  // {
  //   title: 'product',
  //   path: '/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
