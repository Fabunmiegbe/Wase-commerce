/**
 * WASÉ seed script.
 *
 * Seeds: sales channel, store currencies (GBP default, USD, NGN),
 * three regions (United Kingdom, United States, Nigeria), two stock
 * locations (UK Warehouse, Nigeria Warehouse) with their own fulfillment
 * zones, the six WASÉ categories, and the launch product catalogue
 * (colour x size variants, generated from a single data array so adding
 * product #31 through #1000 later is a data change, not a code change).
 *
 * Run once a real Postgres database is connected:
 *   yarn seed
 *
 * Assumption: "Europe" and "Rest of World" (mentioned in the brief as
 * country-selector options) are left for a follow-up seed once you
 * decide their currency/tax handling. The brief specifies GBP/USD/NGN
 * as the three supported currencies, so this script ships exactly those
 * three regions to start.
 */
import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => ({
      selector: { id: data.input.store_id },
      update: {
        supported_currencies: data.input.supported_currencies.map((c) => ({
          currency_code: c.currency_code,
          is_default: c.is_default ?? false,
        })),
      },
    }));
    const stores = updateStoresStep(normalizedInput);
    return new WorkflowResponse(stores);
  }
);

/* ------------------------------------------------------------------
   Product catalogue — the same 16 launch pieces used in the storefront
   prototype. Extend this array (or load it from a CSV/spreadsheet) to
   scale toward the 1,000+ product target; nothing below this array
   needs to change.
------------------------------------------------------------------- */

type CatalogueItem = {
  sku: string;
  title: string;
  category: string;
  description: string;
  handle: string;
  weightGrams: number;
  material: string;
  care: string;
  colors: string[];
  sizes: string[];
  priceGBP: number;
  imageUrl: string;
  stockUK: number;
  stockNG: number;
};

const USD_RATE = 1.27;
const NGN_RATE = 2080;

const CATALOGUE: CatalogueItem[] = [
  { sku: "WSE-MEN-001", title: "Chevalier Wool Overcoat", category: "Men", description: "A full-length wool overcoat cut for a clean, structured silhouette.", handle: "chevalier-wool-overcoat", weightGrams: 1400, material: "92% virgin wool, 8% cashmere", care: "Dry clean only. Store on a padded hanger.", colors: ["Ink", "Stone"], sizes: ["S", "M", "L", "XL"], priceGBP: 420, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png", stockUK: 10, stockNG: 4 },
  { sku: "WSE-WMN-002", title: "Aurelie Silk Blouse", category: "Women", description: "A relaxed silk blouse with a soft drape, finished with mother-of-pearl buttons.", handle: "aurelie-silk-blouse", weightGrams: 200, material: "100% mulberry silk", care: "Hand wash cold. Line dry in shade.", colors: ["Ivory", "Burgundy"], sizes: ["XS", "S", "M", "L"], priceGBP: 165, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png", stockUK: 16, stockNG: 6 },
  { sku: "WSE-KID-003", title: "Junior Heritage Blazer", category: "Kids", description: "A tailored junior blazer built from the same cloth as the adult collection.", handle: "junior-heritage-blazer", weightGrams: 600, material: "70% wool, 30% polyester blend", care: "Dry clean recommended.", colors: ["Ink", "Forest"], sizes: ["XS", "S", "M"], priceGBP: 95, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png", stockUK: 6, stockNG: 3 },
  { sku: "WSE-UND-004", title: "Modal Everyday Boxer Set", category: "Underwear", description: "A three-pack of everyday boxers in a soft modal blend.", handle: "modal-everyday-boxer-set", weightGrams: 100, material: "95% modal, 5% elastane", care: "Machine wash cold, tumble dry low.", colors: ["Ink", "Stone", "Ivory"], sizes: ["S", "M", "L", "XL"], priceGBP: 38, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png", stockUK: 40, stockNG: 20 },
  { sku: "WSE-FTW-005", title: "Marchetti Leather Oxford", category: "Footwear", description: "A full-grain leather Oxford with a hand-stitched welt.", handle: "marchetti-leather-oxford", weightGrams: 1100, material: "Full-grain calf leather, leather sole", care: "Wipe with a soft dry cloth. Use cedar shoe trees.", colors: ["Ink", "Burgundy"], sizes: ["S", "M", "L", "XL"], priceGBP: 265, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png", stockUK: 8, stockNG: 3 },
  { sku: "WSE-ACC-006", title: "Sable Silk Pocket Square", category: "Accessories", description: "A hand-rolled silk pocket square in a small production run.", handle: "sable-silk-pocket-square", weightGrams: 50, material: "100% silk twill", care: "Dry clean only.", colors: ["Gold", "Burgundy"], sizes: ["One Size"], priceGBP: 55, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png", stockUK: 4, stockNG: 1 },
  { sku: "WSE-WMN-007", title: "Lucienne Wrap Dress", category: "Women", description: "A wrap dress in fluid crepe de chine, cut to move with the body.", handle: "lucienne-wrap-dress", weightGrams: 400, material: "100% crepe de chine", care: "Hand wash cold. Cool iron only.", colors: ["Burgundy", "Ink"], sizes: ["XS", "S", "M", "L"], priceGBP: 240, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png", stockUK: 12, stockNG: 4 },
  { sku: "WSE-MEN-008", title: "Etienne Tailored Trouser", category: "Men", description: "A tailored wool trouser with a clean front and a soft break.", handle: "etienne-tailored-trouser", weightGrams: 500, material: "98% wool, 2% elastane", care: "Dry clean only.", colors: ["Ink", "Stone"], sizes: ["S", "M", "L", "XL", "XXL"], priceGBP: 175, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png", stockUK: 18, stockNG: 6 },
  { sku: "WSE-KID-009", title: "Petit Fleur Romper", category: "Kids", description: "An organic cotton romper, soft against the skin for everyday wear.", handle: "petit-fleur-romper", weightGrams: 150, material: "100% organic cotton", care: "Machine wash warm.", colors: ["Ivory", "Gold"], sizes: ["XS", "S"], priceGBP: 42, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png", stockUK: 14, stockNG: 4 },
  { sku: "WSE-UND-010", title: "Cassian Lace Bralette", category: "Underwear", description: "A lightweight bralette finished with French lace trim.", handle: "cassian-lace-bralette", weightGrams: 80, material: "Recycled nylon, French lace", care: "Hand wash cold, lay flat to dry.", colors: ["Ivory", "Burgundy"], sizes: ["XS", "S", "M", "L"], priceGBP: 48, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png", stockUK: 24, stockNG: 9 },
  { sku: "WSE-FTW-011", title: "Roderic Suede Loafer", category: "Footwear", description: "A suede loafer with a hand-finished leather sole.", handle: "roderic-suede-loafer", weightGrams: 900, material: "Suede upper, leather sole", care: "Brush clean. Avoid water exposure.", colors: ["Stone", "Ink"], sizes: ["S", "M", "L", "XL"], priceGBP: 210, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png", stockUK: 15, stockNG: 5 },
  { sku: "WSE-ACC-012", title: "Gilt Chain Belt", category: "Accessories", description: "A calf leather belt finished with brass chain hardware.", handle: "gilt-chain-belt", weightGrams: 300, material: "Brass hardware, calf leather", care: "Store flat. Polish with a dry cloth.", colors: ["Gold"], sizes: ["S", "M", "L"], priceGBP: 88, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png", stockUK: 5, stockNG: 2 },
  { sku: "WSE-MEN-013", title: "Verrier Cashmere Sweater", category: "Men", description: "A crewneck knitted from Mongolian cashmere.", handle: "verrier-cashmere-sweater", weightGrams: 500, material: "100% Mongolian cashmere", care: "Hand wash cold. Dry flat.", colors: ["Ink", "Forest", "Ivory"], sizes: ["S", "M", "L", "XL"], priceGBP: 310, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png", stockUK: 9, stockNG: 4 },
  { sku: "WSE-WMN-014", title: "Odile Pleated Midi Skirt", category: "Women", description: "A pleated midi skirt in a fluid recycled satin.", handle: "odile-pleated-midi-skirt", weightGrams: 350, material: "Recycled polyester satin", care: "Dry clean only.", colors: ["Ink", "Gold"], sizes: ["XS", "S", "M", "L"], priceGBP: 98, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png", stockUK: 11, stockNG: 4 },
  { sku: "WSE-KID-015", title: "Junior Canvas High-Top", category: "Kids", description: "A canvas high-top with a durable rubber sole for everyday play.", handle: "junior-canvas-high-top", weightGrams: 400, material: "Cotton canvas, rubber sole", care: "Spot clean with a damp cloth.", colors: ["Ivory", "Ink"], sizes: ["XS", "S", "M"], priceGBP: 58, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png", stockUK: 20, stockNG: 7 },
  { sku: "WSE-ACC-016", title: "Sable Silk Tie", category: "Accessories", description: "A classic silk tie, cut and finished by hand.", handle: "sable-silk-tie", weightGrams: 60, material: "100% silk", care: "Dry clean only.", colors: ["Burgundy", "Forest", "Gold"], sizes: ["One Size"], priceGBP: 62, imageUrl: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png", stockUK: 22, stockNG: 9 },
];

function priceSet(gbp: number) {
  return [
    { amount: gbp, currency_code: "gbp" },
    { amount: Math.round(gbp * USD_RATE * 100) / 100, currency_code: "usd" },
    { amount: Math.round(gbp * NGN_RATE), currency_code: "ngn" },
  ];
}

function buildVariants(item: CatalogueItem) {
  const variants: any[] = [];
  for (const color of item.colors) {
    for (const size of item.sizes) {
      variants.push({
        title: `${color} / ${size}`,
        sku: `${item.sku}-${color.slice(0, 3).toUpperCase()}-${size}`,
        options: { Colour: color, Size: size },
        prices: priceSet(item.priceGBP),
      });
    }
  }
  return variants;
}

export default async function seedWaseData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  logger.info("Seeding store and sales channel...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });
  if (!defaultSalesChannel.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
    });
    defaultSalesChannel = result;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        { currency_code: "gbp", is_default: true },
        { currency_code: "usd" },
        { currency_code: "ngn" },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_sales_channel_id: defaultSalesChannel[0].id },
    },
  });

  logger.info("Seeding regions (United Kingdom, United States, Nigeria)...");
  const { result: regions } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        { name: "United Kingdom", currency_code: "gbp", countries: ["gb"], payment_providers: ["pp_system_default"] },
        { name: "United States", currency_code: "usd", countries: ["us"], payment_providers: ["pp_system_default"] },
        { name: "Nigeria", currency_code: "ngn", countries: ["ng"], payment_providers: ["pp_system_default"] },
      ],
    },
  });

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: [
      { country_code: "gb", provider_id: "tp_system" },
      { country_code: "us", provider_id: "tp_system" },
      { country_code: "ng", provider_id: "tp_system" },
    ],
  });

  logger.info("Seeding UK and Nigeria stock locations...");
  const { result: stockLocations } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        { name: "UK Warehouse", address: { city: "London", country_code: "GB", address_1: "" } },
        { name: "Nigeria Warehouse", address: { city: "Lagos", country_code: "NG", address_1: "" } },
      ],
    },
  });
  const ukLocation = stockLocations.find((l) => l.name === "UK Warehouse")!;
  const ngLocation = stockLocations.find((l) => l.name === "Nigeria Warehouse")!;

  await updateStoresWorkflow(container).run({
    input: { selector: { id: store.id }, update: { default_location_id: ukLocation.id } },
  });

  for (const loc of [ukLocation, ngLocation]) {
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: loc.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    });
  }

  logger.info("Seeding fulfillment zones per warehouse...");
  const { result: shippingProfileResult } = await createShippingProfilesWorkflow(container).run({
    input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
  });
  const shippingProfile = shippingProfileResult[0];

  const ukFulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "UK Warehouse delivery",
    type: "shipping",
    service_zones: [{ name: "United Kingdom", geo_zones: [{ country_code: "gb", type: "country" }] }],
  });
  const ngFulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Nigeria Warehouse delivery",
    type: "shipping",
    service_zones: [{ name: "Nigeria", geo_zones: [{ country_code: "ng", type: "country" }] }],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: ukLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: ukFulfillmentSet.id },
  });
  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: ngLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: ngFulfillmentSet.id },
  });

  const enabledRule = { attribute: "enabled_in_store", value: "true", operator: "eq" as const };
  const notReturnRule = { attribute: "is_return", value: "false", operator: "eq" as const };

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "UK Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: ukFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: { label: "Standard", description: "Ship in 2 to 3 days.", code: "standard" },
        prices: [
          { currency_code: "gbp", amount: 5 },
          { region_id: regions.find((r) => r.name === "United Kingdom")!.id, amount: 5 },
        ],
        rules: [enabledRule, notReturnRule],
      },
      {
        name: "Nigeria Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: ngFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: { label: "Standard", description: "Ship in 3 to 5 days.", code: "standard" },
        prices: [
          { currency_code: "ngn", amount: 8000 },
          { region_id: regions.find((r) => r.name === "Nigeria")!.id, amount: 8000 },
        ],
        rules: [enabledRule, notReturnRule],
      },
    ],
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: ukLocation.id, add: [defaultSalesChannel[0].id] },
  });
  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: ngLocation.id, add: [defaultSalesChannel[0].id] },
  });
  logger.info("Finished seeding fulfillment and warehouse data.");

  logger.info("Seeding publishable API key...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: { type: "publishable" },
  });
  publishableApiKey = data?.[0];
  if (!publishableApiKey) {
    const { result: [created] } = await createApiKeysWorkflow(container).run({
      input: { api_keys: [{ title: "WASÉ Storefront", type: "publishable", created_by: "" }] },
    });
    publishableApiKey = created as ApiKey;
  }
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableApiKey.id, add: [defaultSalesChannel[0].id] },
  });
  logger.info("Finished seeding publishable API key.");

  logger.info("Seeding WASÉ categories...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        { name: "Men", is_active: true },
        { name: "Women", is_active: true },
        { name: "Kids", is_active: true },
        { name: "Underwear", is_active: true },
        { name: "Footwear", is_active: true },
        { name: "Accessories", is_active: true },
      ],
    },
  });

  logger.info(`Seeding ${CATALOGUE.length} products...`);
  const productsInput = CATALOGUE.map((item) => ({
    title: item.title,
    category_ids: [categoryResult.find((c) => c.name === item.category)!.id],
    description: `${item.description} Material: ${item.material}. Care: ${item.care}`,
    handle: item.handle,
    weight: item.weightGrams,
    status: ProductStatus.PUBLISHED,
    shipping_profile_id: shippingProfile.id,
    images: [{ url: item.imageUrl }],
    metadata: { material: item.material, care_instructions: item.care },
    options: [
      { title: "Colour", values: item.colors },
      { title: "Size", values: item.sizes },
    ],
    variants: buildVariants(item),
    sales_channels: [{ id: defaultSalesChannel[0].id }],
  }));

  await createProductsWorkflow(container).run({ input: { products: productsInput } });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels across UK and Nigeria warehouses...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  });

  // Split each SKU's stock across both warehouses using the quantities
  // defined per catalogue item (variant SKUs share the parent's split).
  const stockBySkuPrefix = new Map(CATALOGUE.map((c) => [c.sku, c]));
  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const parentSku = (inventoryItem.sku || "").split("-").slice(0, 3).join("-");
    const item = stockBySkuPrefix.get(parentSku);
    inventoryLevels.push({
      location_id: ukLocation.id,
      stocked_quantity: item?.stockUK ?? 10,
      inventory_item_id: inventoryItem.id,
    });
    inventoryLevels.push({
      location_id: ngLocation.id,
      stocked_quantity: item?.stockNG ?? 5,
      inventory_item_id: inventoryItem.id,
    });
  }

  await createInventoryLevelsWorkflow(container).run({
    input: { inventory_levels: inventoryLevels },
  });
  logger.info("Finished seeding inventory levels.");
  logger.info("WASÉ seed complete.");
}
