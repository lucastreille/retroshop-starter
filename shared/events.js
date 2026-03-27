export const EVENTS = {
  CART_ITEM_ADDED: 'cart:item-added',
  CART_UPDATED: 'cart:updated',
};

/**
 * Contrat d'evenements RetroShop
 *
 * `cart:item-added`
 * Emetteurs:
 * - mfe-product
 * - mfe-reco
 *
 * Payload:
 * {
 *   product: {
 *     id: number,
 *     name: string,
 *     price: number,
 *     image: string,
 *     category: string,
 *   },
 *   source: 'catalog' | 'recommendations',
 * }
 *
 * `cart:updated`
 * Emetteur:
 * - mfe-cart
 *
 * Auditeurs:
 * - shell
 * - mfe-reco
 *
 * Payload:
 * {
 *   items: Array<{
 *     cartId: string,
 *     id: number,
 *     name: string,
 *     price: number,
 *     image: string,
 *     category: string,
 *   }>,
 *   count: number,
 *   total: number,
 * }
 */
