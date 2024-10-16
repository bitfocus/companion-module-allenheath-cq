import { muteParameters } from './helpers.js'

export function getFeedbackDefinitions(self) {
	return {
		mute: {
			type: 'boolean',
			name: 'Mute',
			description: 'Check if a channel is currently muted',
			options: [
				{
					type: 'dropdown',
					id: 'channel',
					label: 'Select Channel',
					default: muteParameters[0].label,
					choices: muteParameters.map((param) => {
						return { id: param.label, label: param.label }
					}),
				},
			],
			callback: (feedback, context) => {
				const result = muteParameters.find((param) => param.label === feedback.options.channel).state
				return result
			},
		},
		sceneActive: {
			type: 'boolean',
			name: 'Scene active',
			description: 'Check if a specific scene is currently active',
			options: [
				{
					type: 'number',
					id: 'scene',
					label: 'Scene:',
					min: 1,
					max: 100,
					default: 1,
				},
			],
			callback: (feedback, context) => {
				return self.currentScene == feedback.options.scene
			},
		},
	}
}
