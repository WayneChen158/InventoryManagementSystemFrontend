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

export function getRequestsURL() {
    return `http://${config.server_host}:${config.server_port}/api/requests`;
}
