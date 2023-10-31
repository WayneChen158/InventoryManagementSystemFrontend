import { Helmet } from 'react-helmet-async';

import { InventoryView } from 'src/sections/inventory/view/index';

// ----------------------------------------------------------------------

export default function InventoryPage() {
  return (
    <>
      <Helmet>
        <title> Inventory </title>
      </Helmet>

      <InventoryView />
    </>
  );
}