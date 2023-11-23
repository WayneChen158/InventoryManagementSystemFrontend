import { Helmet } from 'react-helmet-async';

import { RequestView } from 'src/sections/request/view/index';

// ----------------------------------------------------------------------

export default function RequestPage() {
  return (
    <>
      <Helmet>
        <title> Request </title>
      </Helmet>

      <RequestView />
    </>
  );
}