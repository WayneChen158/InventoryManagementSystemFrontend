import { config } from '../config';

export function getRawMaterialsURL() {
    return `http://${config.server_host}:${config.server_port}/api/rawMaterials`;
  };

export function getConsumablesURL() {
  return `http://${config.server_host}:${config.server_port}/api/consumables`;
}

export function getProductsInStockURL() {
  return `http://${config.server_host}:${config.server_port}/api/products/inStock`;
}

export function getComponentsInStockURL() {
  return `http://${config.server_host}:${config.server_port}/api/components/inStock`;
}

export function updateConsumableStockURL() {
  return `http://${config.server_host}:${config.server_port}/api/consumables/updateStock`;
}

export function updateProductStockURL() {
  return `http://${config.server_host}:${config.server_port}/api/products/updateStock`;
}

export function updateComponentStockURL() {
  return `http://${config.server_host}:${config.server_port}/api/components/updateStock`;
}

export function getRequestsURL() {
    return `http://${config.server_host}:${config.server_port}/api/requests`;
}

export function addRequestURL() {
  return `http://${config.server_host}:${config.server_port}/api/requests/add`;
}

export function deleteRequestURL() {
  return `http://${config.server_host}:${config.server_port}/api/requests/delete`;
}