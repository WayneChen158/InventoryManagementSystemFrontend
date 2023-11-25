import { Helmet } from 'react-helmet-async';

import { StockView } from 'src/sections/stock/view/index';

// ----------------------------------------------------------------------

export default function StockPage() {
  return (
    <>
      <Helmet>
        <title> Manufacture </title>
      </Helmet>

      <StockView />
    </>
  );
}