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