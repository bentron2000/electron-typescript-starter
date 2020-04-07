import { MenuItemConstructorOptions, remote } from 'electron'

import { getDefaultMenuTemplate } from '../../../main/MainMenu'

// TODO: Throw if this is called from the main process

export interface IMenuGenerator {
  generateMenu(
    template: MenuItemConstructorOptions[],
    updateMenu: () => void
  ): MenuItemConstructorOptions[]
}

export interface IMenuGeneratorProps {
  updateMenu(): void
}

export const generateMenu = (
  generator: IMenuGenerator | undefined,
  updateMenu: () => void
) => {
  const defaultTemplate = getDefaultMenuTemplate(updateMenu)
  const template = generator
    ? generator.generateMenu(defaultTemplate, updateMenu)
    : defaultTemplate
  return remote.Menu.buildFromTemplate(template)
}
