import { InstanceStatus } from '@companion-module/base'
import * as net from 'net'

import {
	dbValues,
	delay,
	hexToByteArray,
	levelMatrixInputs,
	levelMatrixOutputs,
	muteParameters,
	panMatrix,
	panValues,
} from './helpers.js'

export class Mixer {
	constructor(instanceContext, ip, port, autoReconnect) {
		this.ip = ip
		this.port = port
		this.autoReconnect = autoReconnect
		this.tcpClient = null
		this.reconnectInterval = null
		this.currentScene = null
		this.instanceContext = instanceContext
	}

	connect() {
		this.instanceContext.updateStatus(InstanceStatus.Connecting)
		this.tcpClient = new net.Socket()
		this.tcpClient.setKeepAlive(true)

		this.tcpClient.connect(this.port, this.ip, () => {
			this.instanceContext.updateStatus(InstanceStatus.Ok)
			console.info('Connected to mixer!')
			this.fetchAllMuteStatuses()

			if (this.reconnectInterval) {
				clearInterval(this.reconnectInterval)
				this.reconnectInterval = null
			}
		})

		this.tcpClient.on('error', (err) => {
			console.error('TCP connection error:', err)
			this.instanceContext.updateStatus(InstanceStatus.ConnectionFailure, err.message)

			// Trigger reconnect if auto reconnect is enabled
			this.setupReconnect()
		})

		this.tcpClient.on('close', () => {
			console.log('Connection closed')
			this.instanceContext.updateStatus(InstanceStatus.Disconnected)

			this.setupReconnect()
		})

		this.tcpClient.on('data', (data) => {
			let hexMessage = data.toString('hex')
			this.parseIncomingMessages(hexMessage)
		})
	}

	destroy() {
		if (this.tcpClient) {
			this.tcpClient.end()
			this.tcpClient.destroy()
			this.tcpClient.removeAllListeners()
			this.instanceContext.updateStatus(InstanceStatus.Disconnected)
			this.tcpClient = null

			if (this.reconnectInterval) {
				clearInterval(this.reconnectInterval)
				this.reconnectInterval = null
			}
		}
	}

	setupReconnect() {
		if (this.autoReconnect && !this.reconnectInterval) {
			this.reconnectInterval = setInterval(() => {
				console.log('Attempting to reconnect...')
				this.connect()
			}, 5000)
		}
	}

	async fetchAllMuteStatuses() {
		for (let i = 0; i < muteParameters.length; i++) {
			const { msb, lsb } = muteParameters[i]
			const midiMessage = [0xb0, 0x63, parseInt(msb, 16), 0xb0, 0x62, parseInt(lsb, 16), 0xb0, 0x60, 0x7f]
			this.sendMIDIMessage(midiMessage)
			await delay(50)
		}
	}

	findNearestDBLabel(vc, vf) {
		const data = (vc << 7) | vf // Calculate the input value
		let nearest = null // To hold the nearest value
		let nearestDistance = Infinity // To track the smallest distance

		// Iterate over the dbValues array
		dbValues.forEach((entry) => {
			// Convert VC and VF from hexadecimal strings to integers
			const vcValue = parseInt(entry.VC, 16)
			const vfValue = parseInt(entry.VF, 16)

			// Calculate the combined value
			const entryValue = (vcValue << 7) | vfValue

			// Calculate the distance from the input value
			const distance = Math.abs(data - entryValue)

			// Check if this entry is closer than the previous nearest
			if (distance < nearestDistance) {
				nearestDistance = distance
				nearest = entry // Store the nearest entry
			}
		})

		return nearest // Return the nearest db value entry
	}

	findNearestPanLabel(vc, vf) {
		const data = (vc << 7) | vf // Calculate the input value
		let nearest = null // To hold the nearest value
		let nearestDistance = Infinity // To track the smallest distance

		// Iterate over the dbValues array
		panValues.forEach((entry) => {
			// Convert VC and VF from hexadecimal strings to integers
			const vcValue = parseInt(entry.VC, 16)
			const vfValue = parseInt(entry.VF, 16)

			// Calculate the combined value
			const entryValue = (vcValue << 7) | vfValue

			// Calculate the distance from the input value
			const distance = Math.abs(data - entryValue)

			// Check if this entry is closer than the previous nearest
			if (distance < nearestDistance) {
				nearestDistance = distance
				nearest = entry // Store the nearest entry
			}
		})

		return nearest // Return the nearest pan value entry
	}

	parseIncomingMessages(hexMessage) {
		console.info('Received package. Data (hex): ', hexMessage)
		const byteArray = hexToByteArray(hexMessage)
		let i = 0

		while (i < byteArray.length) {
			// Check for a Scene Change packet (5 bytes)
			if (
				byteArray[i] === 0xb0 &&
				byteArray[i + 1] === 0x00 &&
				byteArray[i + 2] === 0x00 &&
				byteArray[i + 3] === 0xc0
			) {
				const scenePacket = byteArray.slice(i, i + 5)
				this.handleIncomingMessage(scenePacket)
				i += 5 // Move past this scene change packet
			}
			// Check for a Mute Status packet (12 bytes sequence)
			else if (
				byteArray[i] === 0xb0 &&
				byteArray[i + 1] === 0x63 && // MSB Header
				byteArray[i + 3] === 0xb0 &&
				byteArray[i + 4] === 0x62 && // LSB Header
				byteArray[i + 6] === 0xb0 &&
				byteArray[i + 7] === 0x06 && // Value 1 Header
				byteArray[i + 9] === 0xb0 &&
				byteArray[i + 10] === 0x26
			) {
				// Value 2 Header

				const mutePacket = byteArray.slice(i, i + 12)
				this.handleIncomingMessage(mutePacket)
				i += 12 // Move past this mute status packet
			}
			// If no known pattern found, log the unknown part and move forward
			else {
				console.info('Could not parse message - unknown format. Skipping one byte and trying again.')
				i++ // Skip one byte and try to parse from the next one
			}
		}
	}

	handleIncomingMessage(byteArray) {
		// Handle Scene Change
		if (byteArray.length === 5) {
			if (byteArray[0] == 0xb0 && byteArray[1] == 0x00 && byteArray[2] == 0x00 && byteArray[3] == 0xc0) {
				this.currentScene = byteArray[4] + 1
				this.instanceContext.setVariableValues({ activeScene: this.currentScene })
				this.instanceContext.checkFeedbacks('sceneActive')
			}
		}
		// Handle Parameter Status Messages (Mute, Volume, Pan)
		else if (byteArray.length === 12) {
			const msb = byteArray[2]
			const lsb = byteArray[5]
			const valueCoarse = byteArray[8]
			const valueFine = byteArray[11]

			// Handle Mute Packets (MSB: 0x00 to 0x04)
			if (msb >= 0x00 && msb <= 0x04) {
				const parameter = muteParameters.find(
					(param) =>
						param.msb === msb.toString(16).padStart(2, '0').toUpperCase() &&
						param.lsb === lsb.toString(16).padStart(2, '0').toUpperCase()
				)

				if (parameter) {
					const muteState = byteArray[11]
					parameter.state = muteState === 1
					this.instanceContext.setVariableValues({ [`mute_${parameter.label}`]: parameter.state })
					this.instanceContext.checkFeedbacks('mute')
				}
			}
			// Handle Volume Packets - Inputs and FX to Outputs and FX
			else if (msb >= 0x40 && msb <= 0x4e) {
				const parameter = levelMatrixInputs.find((param) =>
					Object.values(param).some(
						(target) =>
							target.msb === msb.toString(16).padStart(2, '0').toUpperCase() &&
							target.lsb === lsb.toString(16).padStart(2, '0').toUpperCase()
					)
				)

				if (parameter) {
					const target = Object.keys(parameter).find(
						(key) =>
							parameter[key].msb === msb.toString(16).padStart(2, '0').toUpperCase() &&
							parameter[key].lsb === lsb.toString(16).padStart(2, '0').toUpperCase()
					)

					const nearestLabel = this.findNearestDBLabel(valueCoarse, valueFine)

					if (target) {
						this.instanceContext.setVariableValues({
							[`volume_${parameter.label}_${target}`]: nearestLabel.label,
						})

						console.log(`Received level for ${parameter.label} ${target}:`, nearestLabel.label, 'dB')
					} else {
						console.log('Did not find volume target.')
					}
				}
			}
			// Handle Volume Packets - Outputs, FX unit inputs, and DCAs
			else if (msb == 0x4f) {
				const parameter = levelMatrixOutputs.find(
					(param) =>
						param.msb === msb.toString(16).padStart(2, '0').toUpperCase() &&
						param.lsb === lsb.toString(16).padStart(2, '0').toUpperCase()
				)

				if (parameter) {
					const nearestLabel = this.findNearestDBLabel(valueCoarse, valueFine)

					if (nearestLabel) {
						this.instanceContext.setVariableValues({ [`volume_${parameter.label}`]: nearestLabel.label })

						console.log(`Received level for ${parameter.label}:`, nearestLabel.label, 'dB')
					} else {
						console.log('Did not find volume label or volume target.')
					}
				}
			}
			// Handle Pan Packets (MSB: 0x50 to 0x56)
			else if (msb >= 0x50 && msb <= 0x56) {
				const parameter = panMatrix.find((param) =>
					Object.values(param).some(
						(target) =>
							target.msb === msb.toString(16).padStart(2, '0').toUpperCase() &&
							target.lsb === lsb.toString(16).padStart(2, '0').toUpperCase()
					)
				)

				if (parameter) {
					// Identify the specific target (e.g., toLR, toOut12, etc.)
					const target = Object.keys(parameter).find(
						(key) =>
							parameter[key].msb === msb.toString(16).padStart(2, '0').toUpperCase() &&
							parameter[key].lsb === lsb.toString(16).padStart(2, '0').toUpperCase()
					)

					const nearestLabel = this.findNearestPanLabel(valueCoarse, valueFine)

					if (nearestLabel && target) {
						// Set the pan value for the identified channel and target
						this.instanceContext.setVariableValues({ [`pan_${parameter.label}_${target}`]: nearestLabel.label })

						// Log and update feedback for the pan control
						console.log(`Pan level for ${parameter.label} ${target}:`, nearestLabel.label)
						this.instanceContext.checkFeedbacks('pan')
					} else {
						console.log('Did not find pan value label or pan target.')
					}
				}
			}
		} else {
			console.log(
				'Received unknown package. Data (hex): ',
				byteArray.map((byte) => byte.toString(16).padStart(2, '0')).join(' ')
			)
		}
	}

	setMuteStatus(msb, lsb, muteState) {
		var message = [0xb0, 0x63, parseInt(msb, 16), 0xb0, 0x62, parseInt(lsb, 16)]
		switch (muteState) {
			case 'mute':
				message.push(0xb0, 0x06, 0x00, 0xb0, 0x26, 0x01)
				break
			case 'unmute':
				message.push(0xb0, 0x06, 0x00, 0xb0, 0x26, 0x00)
				break
			case 'toggle':
				message.push(0xb0, 0x60, 0x00)
				break
		}
		this.sendMIDIMessage(message)
	}

	setAbsValue(msb, lsb, vc, vf) {
		const message = [
			0xb0,
			0x63,
			parseInt(msb, 16),
			0xb0,
			0x62,
			parseInt(lsb, 16),
			0xb0,
			0x06,
			parseInt(vc, 16),
			0xb0,
			0x26,
			parseInt(vf, 16),
		]
		this.sendMIDIMessage(message)
		this.sendMIDIGetMessage(msb, lsb)
	}

	setRelValue(msb, lsb, direction) {
		const message = [
			0xb0,
			0x63,
			parseInt(msb, 16),
			0xb0,
			0x62,
			parseInt(lsb, 16),
			0xb0,
			direction == 'left' || direction == 'decrement' ? 0x61 : 0x60,
			0x00,
		]
		this.sendMIDIMessage(message)
		this.sendMIDIGetMessage(msb, lsb)
	}

	loadScene(scene) {
		const midiMessage = [0xb0, 0x00, 0x00, 0xc0, scene - 1]

		this.sendMIDIMessage(midiMessage)
	}

	controlSoftKey(key, state) {
		const midiMessage = [state == 'press' ? 0x90 : 0x80, parseInt(key, 16), state == 'press' ? 0x7f : 0x00]
		this.sendMIDIMessage(midiMessage)
	}

	sendMIDIMessage(hexMessage) {
		if (!this.tcpClient || this.tcpClient.destroyed) {
			console.log('warning', 'TCP connection is closed!')
			return
		}
		let buffer = Buffer.from(hexMessage, 'hex')
		this.tcpClient.write(buffer)
	}

	sendMIDIGetMessage(msb, lsb) {
		const midiMessage = [0xb0, 0x63, parseInt(msb, 16), 0xb0, 0x62, parseInt(lsb, 16), 0xb0, 0x60, 0x7f]

		this.sendMIDIMessage(midiMessage)
	}
}
