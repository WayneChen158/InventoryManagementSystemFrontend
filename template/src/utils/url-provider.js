import { config } from '../config';

// ============================ Inventory Page ============================

export function getRawMaterialsURL() {
    return `http://${config.server_host}:${config.server_port}/api/rawMaterials`;
  };

export function addRawMaterialsURL() {
  return `http://${config.server_host}:${config.server_port}/api/rawMaterials/add`;
};

export function deleteRawMaterialsURL() {
  return `http://${config.server_host}:${config.server_port}/api/rawMaterials/delete`;
};

export function updateRawMaterialsURL() {
  return `http://${config.server_host}:${config.server_port}/api/rawMaterials/update`;
};

export function checkInventoryURL() {
  return `http://${config.server_host}:${config.server_port}/api/rawMaterials/gen-inventory-report`;
};

// ============================ Manufacture Page ============================

// Add Component Form
export function getComponentManufactureURL() {
  return `http://${config.server_host}:${config.server_port}/api/components/manufacture`
}

export function postComponentManufactureURL() {
  return `http://${config.server_host}:${config.server_port}/api/components/manufacture`
}

// manufacture table row
export function cancelManufactureTaskURL() {
  return `http://${config.server_host}:${config.server_port}/api/manufacture/cancel`
}

export function updateRecipeRowURL() {
  return `http://${config.server_host}:${config.server_port}/api/manufacture/update`
}

// ============================ Stock Page ============================

export function getConsumablesURL() {
  return `http://${config.server_host}:${config.server_port}/api/consumables`;
}

export function getProductsInStockURL() {
  return `http://${config.server_host}:${config.server_port}/api/products/inStock`;
}

export function getComponentsInStockURL() {
  return `http://${config.server_host}:${config.server_port}/api/components/inStock`;
}

export function sellInvoiceURL() {
  return `http://${config.server_host}:${config.server_port}/api/sell`;
}

// ============================ Request Page ============================

export function getRequestsURL() {
    return `http://${config.server_host}:${config.server_port}/api/requests`;
}

export function addRequestURL() {
  return `http://${config.server_host}:${config.server_port}/api/requests/add`;
}

export function deleteRequestURL() {
  return `http://${config.server_host}:${config.server_port}/api/requests/delete`;
}

export function updateRequestURL() {
  return `http://${config.server_host}:${config.server_port}/api/requests/update`;
}

export function markOrderedRequestURL() {
  return `http://${config.server_host}:${config.server_port}/api/requests/mark-ordered`;
}

export function markReceivedRequestURL() {
  return `http://${config.server_host}:${config.server_port}/api/requests/mark-received`;
}

export function getComponentRecordsURL() {
  return `http://${config.server_host}:${config.server_port}/api/componentRecords`;
}

export function getProductRecordsURL() {
  return `http://${config.server_host}:${config.server_port}/api/productRecords`;
}

export function getComponentsURL() {
  return `http://${config.server_host}:${config.server_port}/api/components`;
}

export function getProductsURL() {
  return `http://${config.server_host}:${config.server_port}/api/products`;
}

// =========================================== Customer Page =================================================

export function getCustomersURL() {
  return `http://${config.server_host}:${config.server_port}/api/customers`;
}

export function addCustomerURL() {
  return `http://${config.server_host}:${config.server_port}/api/customer-create`;
}

export function updateCustomerURL() {
  return `http://${config.server_host}:${config.server_port}/api/customer-update`;
}

export function deleteCustomerURL() {
  return `http://${config.server_host}:${config.server_port}/api/customer-delete`;
}

// =========================================== Invoice Page =================================================
export function getUnshippedInvoicesURL() {
  return `http://${config.server_host}:${config.server_port}/api/invoices-unshipped`;
}

export function getShippedInvoicesURL() {
  return `http://${config.server_host}:${config.server_port}/api/invoices-shipped`;
}

export function getInvoiceDetailsURL() {
  return `http://${config.server_host}:${config.server_port}/api/invoices-detail`;
}

export function updateInvoiceURL() {
  return `http://${config.server_host}:${config.server_port}/api/invoices-update`;
}

export function deleteInvoiceURL() {
  return `http://${config.server_host}:${config.server_port}/api/invoice-delete`;
}

export function addInvoiceContentURL() {
  return `http://${config.server_host}:${config.server_port}/api/Invoices-detail-add`;
}

export function updateInvoiceContentURL() {
  return `http://${config.server_host}:${config.server_port}/api/Invoices-detail-update`;
}

export function deleteInvoiceContentURL() {
  return `http://${config.server_host}:${config.server_port}/api/Invoices-detail-delete`;
}

export function shipInvoiceURL() {
  return `http://${config.server_host}:${config.server_port}/api/invoices-ship`;
}

export function createInvoiceURL() {
  return `http://${config.server_host}:${config.server_port}/api/invoices-create`;
}