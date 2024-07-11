import { Helmet } from 'react-helmet-async';

import { InvoiceView } from 'src/sections/invoice/view';

// ----------------------------------------------------------------------

export default function InvoicePage() {
  return (
    <>
      <Helmet>
        <title> Invoice | Minimal UI </title>
      </Helmet>

      <InvoiceView />
    </>
  );
}
