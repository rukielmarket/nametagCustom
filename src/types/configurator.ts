export type ColorDefinition = { id: string; name: string; hex: string };
export type PartDefinition = { id: string; label: string; meshNames: string[]; defaultColor: string };
export type ModelDefinition = { id: string; label: string; fontId?: string; path: string; parts?: PartDefinition[]; iconId?: string; rotation?: [number, number, number]; fallbackPartId?: string };
export type FontDefinition = { id: string; label: string; sample: string; category: 'korean' | 'english'; family?: string; previewFamily?: string; fontUrl?: string };
export type ProductDefinition = { id: string; name: string; description: string; models: ModelDefinition[]; parts: PartDefinition[]; fonts?: FontDefinition[]; colors: string[] };
export type CustomizationState = { productId: string; modelId: string; fontId: string; selectedPartId: string; partColors: Record<string, string> };
