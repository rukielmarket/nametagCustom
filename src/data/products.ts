import type { ProductDefinition } from '../types/configurator';
import { nameTagProduct } from '../products/name-tag/config';
import { pegboardProduct } from '../products/pegboard/config';

export const products: ProductDefinition[] = [nameTagProduct, pegboardProduct];
