import { Regex } from '@companion-module/base'

export const ConfigFields = [
	{
		type: 'textinput',
		id: 'host',
		label: 'Mixer IP',
		tooltip: 'Enter the IP address of the CQ mixer and make sure it is reachable from your network.',
		width: 8,
		regex: Regex.IP,
	},
	{
		type: 'number',
		id: 'port',
		label: 'Mixer Port',
		default: 51325,
		width: 4,
		tooltip:
			"The default port is 51325 - if you don't have any complex network setups, you don't need to change this port. ",
		regex: Regex.PORT,
	},
	{
		type: 'checkbox',
		id: 'autoReconnect',
		label: 'Auto Reconnect',
		default: true,
	},
]
