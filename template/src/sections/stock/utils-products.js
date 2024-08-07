export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (orderBy === 'lowInStock') {
    if (a.amountInStock === null || a.threshold === null) {
      return 1;
    }
    if (b.amountInStock === null || b.threshold === null) {
      return -1;
    }
    const aDiff = a.amountInStock - a.threshold;
    const bDiff = b.amountInStock - b.threshold;
    if (aDiff > bDiff) {
      return 1;
    }
    if (aDiff < bDiff) {
      return -1;
    }
    return 0;
  }
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData, comparator, filterName }) {
  if (inputData === null) {
    return null
  }

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((item) => {
      const searchString = filterName.toLowerCase();
      const productName = item.productName ? item.productName.toLowerCase().includes(searchString) : false;
      const catalogNumber = item.catalogNumber ? item.catalogNumber.toLowerCase().includes(searchString) : false;
      const componentName = item.componentName ? item.componentName.toLowerCase().includes(searchString) : false;
      const componentCatalog = item.componentCatalog ? item.componentCatalog.toLowerCase().includes(searchString) : false;
      const productCatalog = item.productCatalog ? item.productCatalog.toLowerCase().includes(searchString) : false;
      const lotNumber = item.lotNumber ? item.lotNumber.toLowerCase().includes(searchString) : false;
  
      return productName || lotNumber || catalogNumber || componentName || componentCatalog || productCatalog;
    });
  }
  
  

  return inputData;
}
