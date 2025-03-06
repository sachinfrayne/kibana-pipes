import type { PluginInitializerContext } from '@kbn/core/server';

export async function plugin(initializerContext: PluginInitializerContext) {
  const { KibanaPipesPlugin } = await import('./plugin');
  return new KibanaPipesPlugin(initializerContext);
}

export type { KibanaPipesPluginSetup, KibanaPipesPluginStart } from './types';
