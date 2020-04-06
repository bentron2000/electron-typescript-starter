import * as fs from 'fs'
import { ipcRenderer } from 'electron'
import { emptyProject } from '@backend/mockdata/emptyProjectTemplate'

import { TeamEntity } from '@backend/schema/TeamEntity'
import { SeatEntity } from '@backend/schema/SeatEntity'
import { ProjectEntity } from '@backend/schema/ProjectEntity'
import { TemplateEntity } from '@backend/schema/TemplateEntity'

const AUTO_TEMPLATE_FOLDER = `${__dirname}/loadAsTemplates`
const AUTO_PROJECT_FOLDER = `${__dirname}/loadAsNewProjects`
const TEAMID = 't1'
const SEATID = 'se1'

export const autoLoadTemplates = () => {
  const handleFileNamesCB = (err: any, files: string[]) => {
    if (err) {
      throw new Error('could not load template files')
      return
    } else {
      const templates = files.filter(f => f.match(/.*\.loupetemplate$/))

      try {
        templates.map(template => {
          fs.readFile(
            AUTO_TEMPLATE_FOLDER + '/' + template,
            'utf8',
            (error, data) => {
              if (error) {
                throw new Error('could not read data')
              } else {
                ipcRenderer.emit(
                  'handle-template-file-load',
                  {}, // I am unsure of the args that ipcRenderer.emit requires. Tis is odd. but this works.
                  TEAMID,
                  data,
                  'unhandled'
                )
              }
            }
          )
        })
      } catch (error) {
        ipcRenderer.send('log', 'Error autoloading templates')
        ipcRenderer.send('log', error)
        console.error(error)
      }
    }
  }
  fs.readdir(AUTO_TEMPLATE_FOLDER, handleFileNamesCB)
}

export const autoLoadNewProjects = (realm: Realm) => {
  const handleFileNamesCB = (err: any, files: string[]) => {
    if (err) {
      throw new Error('Could not auto load projects from templates')
      return
    } else {
      const templates = files.filter(f => f.match(/.*\.loupetemplate$/))
      const blankTemplateEntity = emptyProject

      const team = realm.objectForPrimaryKey<TeamEntity>('Team', TEAMID)
      const seat = realm.objectForPrimaryKey<SeatEntity>('Seat', SEATID)

      if (!team || !seat) {
        throw new Error('Could not find the seat or team')
      }

      try {
        templates.map(template => {
          fs.readFile(
            AUTO_PROJECT_FOLDER + '/' + template,
            'utf8',
            (error, data) => {
              if (error) {
                throw new Error('could not read data')
              } else {
                const entityData = JSON.parse(data)

                const combinedTemplate = {
                  ...blankTemplateEntity,
                  id: entityData.id,
                  name: entityData.name,
                  team,
                  sections: JSON.stringify(entityData.sections),
                  elements: JSON.stringify(entityData.elements),
                  sectionPermissions: JSON.stringify(
                    entityData.sectionPermissions
                  ),
                  fieldDefinitions: JSON.stringify(entityData.fieldDefinitions),
                  treeDefinitions: JSON.stringify(entityData.treeDefinitions),
                  treeInstances: JSON.stringify(entityData.treeInstances),
                  stages: JSON.stringify(entityData.stages),
                  transitions: JSON.stringify(entityData.transitions),
                }

                // Generate a version of this Template with new UUIDs
                const tplt = TemplateEntity.replaceIds(
                  TemplateEntity.entityToObject(combinedTemplate)
                )

                ProjectEntity.create(
                  realm,
                  SeatEntity.toModel(seat),
                  {},
                  () => undefined,
                  tplt
                ).then(res => {
                  ipcRenderer.send('log', `${entityData.name} created`)
                })
              }
            }
          )
        })
      } catch (error) {
        ipcRenderer.send('log', 'Error autoloading projects from templates')
        ipcRenderer.send('log', error)
        console.error(error)
      }
    }
  }
  fs.readdir(AUTO_PROJECT_FOLDER, handleFileNamesCB)
}
