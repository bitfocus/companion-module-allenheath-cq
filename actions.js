import { dbValues, levelMatrixInputs, levelMatrixOutputs, muteParameters, panMatrix, panValues } from './helpers.js'

export function getActionDefinitions(self) {
	return {
		mute: {
			name: 'Mute',
			description: 'Mute/Unmute a specific channel on the CQ ',
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
				{
					type: 'dropdown',
					id: 'command',
					label: 'Mute Command',
					tooltip: 'Attention: Toggle is not working for Mute Groups and DCAs!',
					default: 'mute',
					choices: [
						{ id: 'mute', label: 'Mute' },
						{ id: 'unmute', label: 'Unmute' },
						{ id: 'toggle', label: 'Toggle' },
					],
				},
			],
			callback: async (action) => {
				const selectedChannel = action.options.channel
				const command = action.options.command

				const muteParam = muteParameters.find((param) => param.label === selectedChannel)

				if (muteParam) {
					self.mixer.setMuteStatus(muteParam.msb, muteParam.lsb, command)

					self.mixer.sendMIDIGetMessage(parseInt(muteParam.msb, 16), parseInt(muteParam.lsb, 16))
				}
			},
		},
		panBalanceAbs: {
			name: 'Pan/Balance [absolute]',
			description: 'Control the balance of individual channels to a specific target',
			options: [
				{
					type: 'dropdown',
					id: 'channel',
					label: 'Select Channel',
					default: panMatrix[0].label,
					choices: panMatrix.map((param) => {
						return { id: param.label, label: param.label }
					}),
				},
				{
					type: 'dropdown',
					id: 'target',
					label: 'Select Pan Target',
					default: 'toLR',
					choices: [
						{ id: 'toLR', label: 'LR' },
						{ id: 'toOut12', label: 'Out1/2' },
						{ id: 'toOut34', label: 'Out3/4' },
						{ id: 'toOut56', label: 'Out5/6' },
					],
				},
				{
					type: 'dropdown',
					id: 'value',
					label: 'Pan',
					default: panValues[0].label,
					choices: panValues.map((param) => {
						return { id: param.label, label: param.label }
					}),
				},
			],
			callback: async (action) => {
				const selectedChannel = action.options.channel
				const target = action.options.target
				const panValue = action.options.value

				const channelData = panMatrix.find((param) => param.label === selectedChannel)[target]
				const panData = panValues.find((param) => param.label === panValue)

				self.mixer.setAbsValue(channelData.msb, channelData.lsb, panData.VC, panData.VF)
			},
		},
		panBalanceRel: {
			name: 'Pan/Balance [relative]',
			description: 'Increment or decrement the balance of a individual channels to a specific target',
			options: [
				{
					type: 'dropdown',
					id: 'channel',
					label: 'Select Channel',
					default: panMatrix[0].label,
					choices: panMatrix.map((param) => {
						return { id: param.label, label: param.label }
					}),
				},
				{
					type: 'dropdown',
					id: 'target',
					label: 'Select Pan Target',
					default: 'toLR',
					choices: [
						{ id: 'toLR', label: 'LR' },
						{ id: 'toOut12', label: 'Out1/2' },
						{ id: 'toOut34', label: 'Out3/4' },
						{ id: 'toOut56', label: 'Out5/6' },
					],
				},
				{
					type: 'dropdown',
					id: 'direction',
					label: 'Direction',
					default: 'left',
					choices: [
						{ id: 'left', label: 'Turn Left' },
						{ id: 'right', label: 'Turn Right' },
					],
				},
			],
			callback: async (action) => {
				const selectedChannel = action.options.channel
				const target = action.options.target
				const panDirection = action.options.direction

				const channelData = panMatrix.find((param) => param.label === selectedChannel)[target]

				self.mixer.setRelValue(channelData.msb, channelData.lsb, panDirection)
			},
		},
		volumeAbsInputs: {
			name: 'Levels - Inputs and FX to Outputs and FX [absolute]',
			description: 'Set a dB value for Inputs and FX to Outputs and FX',
			options: [
				{
					type: 'dropdown',
					id: 'channel',
					label: 'Select Channel',
					default: levelMatrixInputs[0].label,
					choices: levelMatrixInputs.map((param) => {
						return { id: param.label, label: param.label }
					}),
				},
				{
					type: 'dropdown',
					id: 'target',
					label: 'Select Channel Target',
					default: 'toLR',
					choices: [
						{ id: 'toLR', label: 'LR' },
						{ id: 'toOut1', label: 'Out1 (or 1/2)' },
						{ id: 'toOut2', label: 'Out2' },
						{ id: 'toOut3', label: 'Out3 (or 3/4)' },
						{ id: 'toOut4', label: 'Out4' },
						{ id: 'toOut5', label: 'Out5 (or 5/6)' },
						{ id: 'toOut6', label: 'Out6' },
						{ id: 'toFX1', label: 'FX1' },
						{ id: 'toFX2', label: 'FX2' },
						{ id: 'toFX3', label: 'FX3' },
						{ id: 'toFX4', label: 'FX4' },
					],
				},
				{
					type: 'dropdown',
					id: 'value',
					label: 'Level',
					default: dbValues[0].label,
					choices: dbValues.map((param) => {
						return { id: param.label, label: param.label }
					}),
				},
			],
			callback: async (action) => {
				const selectedChannel = action.options.channel
				const target = action.options.target
				const dBValue = action.options.value

				const channelData = levelMatrixInputs.find((param) => param.label === selectedChannel)[target]
				const volData = dbValues.find((param) => param.label === dBValue)

				self.mixer.setAbsValue(channelData.msb, channelData.lsb, volData.VC, volData.VF)
			},
		},
		volumeRelInputs: {
			name: 'Levels - Inputs and FX to Outputs and FX [relative]',
			description: 'Increment or decrement the dB value by 1 dB for Inputs and FX to Outputs and FX',
			options: [
				{
					type: 'dropdown',
					id: 'channel',
					label: 'Select Channel',
					default: levelMatrixInputs[0].label,
					choices: levelMatrixInputs.map((param) => {
						return { id: param.label, label: param.label }
					}),
				},
				{
					type: 'dropdown',
					id: 'target',
					label: 'Select Channel Target',
					default: 'toLR',
					choices: [
						{ id: 'toLR', label: 'LR' },
						{ id: 'toOut1', label: 'Out1 (or 1/2)' },
						{ id: 'toOut2', label: 'Out2' },
						{ id: 'toOut3', label: 'Out3 (or 3/4)' },
						{ id: 'toOut4', label: 'Out4' },
						{ id: 'toOut5', label: 'Out5 (or 5/6)' },
						{ id: 'toOut6', label: 'Out6' },
						{ id: 'toFX1', label: 'FX1' },
						{ id: 'toFX2', label: 'FX2' },
						{ id: 'toFX3', label: 'FX3' },
						{ id: 'toFX4', label: 'FX4' },
					],
				},
				{
					type: 'dropdown',
					id: 'direction',
					label: 'Direction',
					default: 'increment',
					choices: [
						{ id: 'increment', label: 'Increment' },
						{ id: 'decrement', label: 'Decrement' },
					],
				},
			],
			callback: async (action) => {
				const selectedChannel = action.options.channel
				const target = action.options.target
				const volDirection = action.options.direction

				const channelData = levelMatrixInputs.find((param) => param.label === selectedChannel)[target]

				self.mixer.setRelValue(channelData.msb, channelData.lsb, volDirection)
			},
		},
		volumeAbsOutputs: {
			name: 'Levels - Outputs, FX unit input and DCAs [absolute]',
			description: 'Set a dB value for Outputs, FX unit inputs and DCAs',
			options: [
				{
					type: 'dropdown',
					id: 'channel',
					label: 'Select Channel',
					default: levelMatrixOutputs[0].label,
					choices: levelMatrixOutputs.map((param) => {
						return { id: param.label, label: param.label }
					}),
				},
				{
					type: 'dropdown',
					id: 'value',
					label: 'Level',
					default: dbValues[0].label,
					choices: dbValues.map((param) => {
						return { id: param.label, label: param.label }
					}),
				},
			],
			callback: async (action) => {
				const selectedChannel = action.options.channel
				const dBValue = action.options.value

				const channelData = levelMatrixOutputs.find((param) => param.label === selectedChannel)
				const volData = dbValues.find((param) => param.label === dBValue)

				self.mixer.setAbsValue(channelData.msb, channelData.lsb, volData.VC, volData.VF)
			},
		},
		volumeRelOutputs: {
			name: 'Levels - Outputs, FX unit input and DCAs [relative]',
			description: 'Increment or decrement the dB value by 1 dB for Outputs, FX unit input and DCAs',
			options: [
				{
					type: 'dropdown',
					id: 'channel',
					label: 'Select Channel',
					default: levelMatrixOutputs[0].label,
					choices: levelMatrixOutputs.map((param) => {
						return { id: param.label, label: param.label }
					}),
				},
				{
					type: 'dropdown',
					id: 'direction',
					label: 'Direction',
					default: 'increment',
					choices: [
						{ id: 'increment', label: 'Increment' },
						{ id: 'decrement', label: 'Decrement' },
					],
				},
			],
			callback: async (action) => {
				const selectedChannel = action.options.channel
				const volDirection = action.options.direction

				const channelData = levelMatrixOutputs.find((param) => param.label === selectedChannel)

				self.mixer.setRelValue(channelData.msb, channelData.lsb, volDirection)
			},
		},
		scene: {
			name: 'Scene Change',
			description: 'Load a scene on the CQ mixer',
			options: [
				{
					type: 'number',
					id: 'scene',
					label: 'Scene',
					min: 1,
					max: 100,
					default: 1,
				},
			],
			callback: async (action) => {
				const selectedScene = action.options.scene

				if (selectedScene < 1 || selectedScene > 100) return

				self.currentScene = selectedScene
				self.setVariableValues({ activeScene: self.currentScene })
				self.checkFeedbacks('sceneActive')

				self.mixer.loadScene(selectedScene)
			},
		},
		softkey: {
			name: 'Soft Key',
			description: 'Press or release a Soft Key on the CQ mixer',
			options: [
				{
					type: 'dropdown',
					id: 'target',
					label: 'Soft Key',
					default: '30',
					choices: [
						{ id: '30', label: 'Soft Key 1' },
						{ id: '31', label: 'Soft Key 2' },
						{ id: '32', label: 'Soft Key 3' },
					],
				},
				{
					type: 'dropdown',
					id: 'action',
					label: 'Action',
					default: 'press',
					choices: [
						{ id: 'press', label: 'Press' },
						{ id: 'release', label: 'Release' },
					],
				},
			],
			callback: async (action) => {
				const selectedKey = action.options.target
				const selectedAction = action.options.action

				self.mixer.controlSoftKey(selectedKey, selectedAction)
			},
		},
	}
}
