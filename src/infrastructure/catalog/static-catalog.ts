import type { CatalogRepository } from "../../application/catalog/catalog";
import { validateProducts, validateServices } from "../content/content-validation";
import productData from "../content/data/products.json";
import serviceData from "../content/data/services.json";

const services = validateServices(serviceData);
const products = validateProducts(productData);

export const staticCatalog: CatalogRepository = {
  services: () => services,
  products: () => products,
};
