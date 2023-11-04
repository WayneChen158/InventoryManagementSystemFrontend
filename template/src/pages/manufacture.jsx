import { Helmet } from 'react-helmet-async';

import { ManufactureView } from 'src/sections/manufacture/view/index';

// ----------------------------------------------------------------------

export default function ManufacturePage() {
  return (
    <>
      <Helmet>
        <title> Manufacture </title>
      </Helmet>

      <ManufactureView />
    </>
  );
}