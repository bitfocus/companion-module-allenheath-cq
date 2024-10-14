import { combineRgb } from "@companion-module/base"

export function getPresetDefinitions(self) {
  return {
    presetOne: {
      type: 'button',
      category: 'Scenes',
      name: 'Load Scene 1',
      style: {
        text: 'Load Scene 1',
        size: '18',
        color: combineRgb(255, 255, 255),
        bgcolor: combineRgb(0, 0, 255),
      },
      steps:
          [
            {
              down: [
                {
                  actionId: 'scene',
                  options: {
                    scene: 1,
                  },
                },
              ],
            },
          ],
      feedbacks:
          [
            {
              feedbackId: 'sceneActive',
              options: {
                scene: 1,
              },
              style: {
                color: combineRgb(
                    0, 255, 0),
                bgcolor: combineRgb(255, 255, 255),
              },
            },
          ],
        },
    }
}