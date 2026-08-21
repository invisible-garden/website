import { requireEnv } from "./config";

const API = "https://api.webflow.com/v2";

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Bearer ${requireEnv("WEBFLOW_API_TOKEN")}`,
      accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(
      `Webflow ${path} failed: ${response.status} ${await response.text()}`,
    );
  }
  return (await response.json()) as T;
}

export interface WebflowItem {
  id: string;
  isDraft: boolean;
  isArchived: boolean;
  lastPublished?: string | null;
  fieldData: Record<string, unknown>;
}

/** Items come back 100 at a time, so every collection needs paging. */
export async function listItems(collectionId: string): Promise<WebflowItem[]> {
  const items: WebflowItem[] = [];
  const limit = 100;
  for (let offset = 0; ; offset += limit) {
    const page = await get<{
      items: WebflowItem[];
      pagination: { total: number };
    }>(`/collections/${collectionId}/items?limit=${limit}&offset=${offset}`);
    items.push(...page.items);
    if (items.length >= page.pagination.total || page.items.length === 0) break;
  }
  return items;
}

export interface WebflowAsset {
  id: string;
  originalFileName: string;
  contentType: string;
  hostedUrl: string;
}

export async function listAssets(siteId: string): Promise<WebflowAsset[]> {
  const assets: WebflowAsset[] = [];
  const limit = 100;
  for (let offset = 0; ; offset += limit) {
    const page = await get<{
      assets: WebflowAsset[];
      pagination: { total: number };
    }>(`/sites/${siteId}/assets?limit=${limit}&offset=${offset}`);
    assets.push(...page.assets);
    if (assets.length >= page.pagination.total || page.assets.length === 0)
      break;
  }
  return assets;
}

export function collectionSchema(collectionId: string) {
  return get<unknown>(`/collections/${collectionId}`);
}
