import { InstanceBase, InstanceStatus, runEntrypoint } from '@companion-module/base'

import { getActionDefinitions } from './actions.js'
import { ConfigFields } from './config.js'
import { getFeedbackDefinitions } from './feedbacks.js'
import { levelMatrixInputs, levelMatrixOutputs, muteParameters, panMatrix } from './helpers.js'
import { Mixer } from './mixer.js'
import { getPresetDefinitions } from './presets.js'
import { variables } from './variables.js'

class GenericTcpUdpInstance extends InstanceBase {
	async init(config) {
		this.config = config
		this.client = null
		this.currentScene = null
		this.mixer = new Mixer(this, this.config.host, this.config.port, this.config.autoReconnect)

		// Set initial values for all mute statuses (default is false)
		const initialMuteValues = muteParameters.reduce(
			(acc, param) => {
				acc[`mute_${param.label}`] = param.state
				return acc
			},
			{ activeScene: null }
		)

		this.setVariableValues(initialMuteValues)
		this.createVariableDefinitions()

		this.setActionDefinitions(getActionDefinitions(this))
		this.setFeedbackDefinitions(getFeedbackDefinitions(this))
		this.setPresetDefinitions(getPresetDefinitions(this))

		this.mixer.connect()
		// this.connectMixer();
	}

	createVariableDefinitions() {
		const muteVariableDefinitions = muteParameters.map((param) => ({
			variableId: `mute_${param.label}`,
			name: `Mute State for ${param.label}`,
		}))

		const panVariableDefinitions = panMatrix.flatMap((param) => [
			{
				variableId: `pan_${param.label}_toLR`,
				name: `Pan for ${param.label} to LR`,
			},
			{
				variableId: `pan_${param.label}_toOut12`,
				name: `Pan for ${param.label} to Out 1-2`,
			},
			{
				variableId: `pan_${param.label}_toOut34`,
				name: `Pan for ${param.label} to Out 3-4`,
			},
			{
				variableId: `pan_${param.label}_toOut56`,
				name: `Pan for ${param.label} to Out 5-6`,
			},
		])

		const volumeVariableDefinitionsInputs = levelMatrixInputs.flatMap((input) => {
			const targets = Object.keys(input).filter((key) => key !== 'label') // Get all keys except 'label'

			// Create a variable definition for each target
			return targets.flatMap((target) => [
				{
					variableId: `volume_${input.label}_${target}`, // Define unique variable ID
					name: `Volume for ${input.label} ${target}`, // Name for the variable
				},
				{
					variableId: `volume_${input.label}_${target}_percent`, // Percent variable
					name: `Volume Percent for ${input.label} ${target}`,
				},
			])
		})

		const volumeVariableDefinitionsOutputs = levelMatrixOutputs.flatMap((param) => [
			{
				variableId: `volume_${param.label}`,
				name: `Volume for ${param.label}`,
			},
			{
				variableId: `volume_${param.label}_percent`,
				name: `Volume Percent for ${param.label}`,
			},
		])

		// Merge with any other variable definitions you already have
		const allVariableDefinitions = [
			...variables,
			...muteVariableDefinitions,
			...panVariableDefinitions,
			...volumeVariableDefinitionsInputs,
			...volumeVariableDefinitionsOutputs,
		]
		this.setVariableDefinitions(allVariableDefinitions)
	}

	async configUpdated(config) {
		this.config = config

		// If autoReconnect is disabled, clear any existing reconnection attempts

		this.mixer = new Mixer(this, config.host, config.port, config.autoReconnect)
		this.mixer.connect()
		// this.connectMixer();
	}

	async destroy() {
		this.mixer.destroy()
	}

	getConfigFields() {
		return ConfigFields
	}
}

runEntrypoint(GenericTcpUdpInstance, [])
