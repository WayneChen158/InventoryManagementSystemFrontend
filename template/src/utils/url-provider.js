import { config } from '../config';

export function getRawMaterialsURL() {
    return 'http://localhost:8080/api/rawMaterials';
  };

export function getConsumablesURL() {
  return `http://${config.server_host}:${config.server_port}/api/consumables`
}