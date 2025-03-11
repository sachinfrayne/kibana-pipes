import type {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '@kbn/core/server';

import type { KibanaPipesPluginSetup, KibanaPipesPluginStart } from './types';
import { defineRoutes } from './routes';

export const PLUGIN_ID = 'kibanaPipes';
export const PLUGIN_NAME = 'kibanaPipes';

export class KibanaPipesPlugin implements Plugin<KibanaPipesPluginSetup, KibanaPipesPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('kibanaPipes: Setup');
    const router = core.http.createRouter();

    defineRoutes(router, this.logger);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('kibanaPipes: Started');
    return {};
  }

  public stop() {}
}
