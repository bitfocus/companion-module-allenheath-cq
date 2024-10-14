import {InstanceBase, InstanceStatus, runEntrypoint, TCPHelper, UDPHelper} from '@companion-module/base'
import * as net from 'net';

import {getActionDefinitions} from './actions.js'
import {ConfigFields} from './config.js'
import {getFeedbackDefinitions} from './feedbacks.js'
import { getPresetDefinitions } from './presets.js';
import {muteParameters, panMatrix, panValues, dbValues, levelMatrixInputs, levelMatrixOutputs} from './helpers.js';
import {variables} from './variables.js';

class GenericTcpUdpInstance extends InstanceBase {
  async init(config) {
    this.config = config;
    this.client = null;
    this.currentScene = null;

    // Add mute status variables
    const muteVariableDefinitions =
        muteParameters.map(param => ({
                             variableId: `mute_${param.label}`,
                             name: `Mute Status for ${param.label}`
                           }));

    const panVariableDefinitions = panMatrix.flatMap(
        param =>
            [{
              variableId: `pan_${param.label}_toLR`,
              name: `Pan for ${param.label} to LR`
            },
             {
               variableId: `pan_${param.label}_toOut12`,
               name: `Pan for ${param.label} to Out 1-2`
             },
             {
               variableId: `pan_${param.label}_toOut34`,
               name: `Pan for ${param.label} to Out 3-4`
             },
             {
               variableId: `pan_${param.label}_toOut56`,
               name: `Pan for ${param.label} to Out 5-6`
             }]);

    const volumeVariableDefinitionsInputs = levelMatrixInputs.flatMap(input => {
      const targets = Object.keys(input).filter(
          key => key !== 'label');  // Get all keys except 'label'

      // Create a variable definition for each target
      return targets.map(
          target => ({
            variableId:
                `volume_${input.label}_${target}`,  // Define unique variable ID
            name:
                `Volume for ${input.label} ${target}`  // Name for the variable
          }));
    });


    const volumeVariableDefinitionsOutputs =
        levelMatrixOutputs.map(param => ({
                             variableId: `volume_${param.label}`,
                             name: `Volume for ${param.label}`
                           }));

    // Merge with any other variable definitions you already have
    const allVariableDefinitions = [...variables, ...muteVariableDefinitions, ...panVariableDefinitions, ...volumeVariableDefinitionsInputs, ...volumeVariableDefinitionsOutputs];
    this.setVariableDefinitions(allVariableDefinitions);

    // Set initial values for all mute statuses (default is false)
    const initialMuteValues = muteParameters.reduce((acc, param) => {
      acc[`mute_${param.label}`] = param.state;
      return acc;
    }, {activeScene: null});

    this.setVariableValues(initialMuteValues);

    this.setActionDefinitions(getActionDefinitions(this));
    this.setFeedbackDefinitions(getFeedbackDefinitions(this));
    this.setPresetDefinitions(getPresetDefinitions(this));
    this.connectMixer();
  }

  connectMixer() {
    this.updateStatus(InstanceStatus.Connecting);
    this.tcpClient = new net.Socket();
    this.tcpClient.setKeepAlive(true);

    // Establish connection
    this.tcpClient.connect(this.config.port, this.config.host, () => {
      this.updateStatus(InstanceStatus.Ok);
      this.fetchAllMuteStatuses();

      // Clear any existing reconnect attempts on successful connection
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    });

    this.tcpClient.on('error', (err) => {
      console.error('TCP connection error:', err);
      this.updateStatus(InstanceStatus.ConnectionFailure, err.message);

      // Trigger reconnect if auto reconnect is enabled
      this.setupReconnect();
    });

    this.tcpClient.on('close', () => {
      console.log('Connection closed');
      this.updateStatus(InstanceStatus.Disconnected);

      // Trigger reconnect if auto reconnect is enabled
      this.setupReconnect();
    });

    this.tcpClient.on('data', (data) => {
      let hexMessage = data.toString('hex');
      // this.handleIncomingMessage(hexMessage);
      this.parseIncomingMessages(hexMessage);
    });
  }

  setupReconnect() {
    if (this.config.autoReconnect && !this.reconnectInterval) {
      this.reconnectInterval = setInterval(() => {
        console.log('Attempting to reconnect...');
        this.connectMixer();
      }, 5000);  // Try reconnecting every 5 seconds
    }
  }

  async configUpdated(config) {
    this.config = config;

    // If autoReconnect is disabled, clear any existing reconnection attempts
    if (!config.autoReconnect && this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }

    this.connectMixer();
  }

  async destroy() {
    if (this.tcpClient) {
      this.tcpClient.end();
      this.tcpClient.destroy();
      this.tcpClient.removeAllListeners();
      this.updateStatus(InstanceStatus.Disconnected);
      this.tcpClient = null;

      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    }
  }
  parseIncomingMessages(hexMessage) {
    console.info('Received package. Data (hex): ', hexMessage);
    const byteArray = this.hexToByteArray(hexMessage);
    let i = 0;

    while (i < byteArray.length) {
      // Check for a Scene Change packet (5 bytes)
      if (byteArray[i] === 0xB0 && byteArray[i + 1] === 0x00 &&
          byteArray[i + 2] === 0x00 && byteArray[i + 3] === 0xC0) {
        const scenePacket = byteArray.slice(i, i + 5);
        this.handleIncomingMessage(scenePacket);
        i += 5;  // Move past this scene change packet
      }
      // Check for a Mute Status packet (12 bytes sequence)
      else if (
          byteArray[i] === 0xB0 && byteArray[i + 1] === 0x63 &&  // MSB Header
          byteArray[i + 3] === 0xB0 &&
          byteArray[i + 4] === 0x62 &&  // LSB Header
          byteArray[i + 6] === 0xB0 &&
          byteArray[i + 7] === 0x06 &&  // Value 1 Header
          byteArray[i + 9] === 0xB0 &&
          byteArray[i + 10] === 0x26) {  // Value 2 Header

        const mutePacket = byteArray.slice(i, i + 12);
        this.handleIncomingMessage(mutePacket);
        i += 12;  // Move past this mute status packet
      }
      // If no known pattern found, log the unknown part and move forward
      else {
        console.info("Could not parse message - unknown format. Skipping one byte and trying again.")
        i++;  // Skip one byte and try to parse from the next one
      }
    }
  }

  findNearestDBLabel(vc, vf) {
    const data = (vc << 7) | vf;     // Calculate the input value
    let nearest = null;              // To hold the nearest value
    let nearestDistance = Infinity;  // To track the smallest distance

    // Iterate over the dbValues array
    dbValues.forEach(entry => {
      // Convert VC and VF from hexadecimal strings to integers
      const vcValue = parseInt(entry.VC, 16);
      const vfValue = parseInt(entry.VF, 16);

      // Calculate the combined value
      const entryValue = (vcValue << 7) | vfValue;

      // Calculate the distance from the input value
      const distance = Math.abs(data - entryValue);

      // Check if this entry is closer than the previous nearest
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = entry;  // Store the nearest entry
      }
    });

    return nearest;  // Return the nearest db value entry
  }

  findNearestPanLabel(vc, vf) {
    const data = (vc << 7) | vf;     // Calculate the input value
    let nearest = null;              // To hold the nearest value
    let nearestDistance = Infinity;  // To track the smallest distance

    // Iterate over the dbValues array
    panValues.forEach(entry => {
      // Convert VC and VF from hexadecimal strings to integers
      const vcValue = parseInt(entry.VC, 16);
      const vfValue = parseInt(entry.VF, 16);

      // Calculate the combined value
      const entryValue = (vcValue << 7) | vfValue;

      // Calculate the distance from the input value
      const distance = Math.abs(data - entryValue);

      // Check if this entry is closer than the previous nearest
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = entry;  // Store the nearest entry
      }
    });

    return nearest;  // Return the nearest pan value entry
  }

  handleIncomingMessage(byteArray) {
    // Handle Scene Change
    if (byteArray.length === 5) {
      if (byteArray[0] == 0xB0 && byteArray[1] == 0x00 &&
          byteArray[2] == 0x00 && byteArray[3] == 0xC0) {
        this.currentScene = byteArray[4] + 1;
        this.setVariableValues({activeScene: this.currentScene});
        this.checkFeedbacks('sceneActive');
      }
    }
    // Handle Parameter Status Messages (Mute, Volume, Pan)
    else if (byteArray.length === 12) {
      const msb = byteArray[2];
      const lsb = byteArray[5];
      const valueCoarse = byteArray[8];
      const valueFine = byteArray[11];

      // Handle Mute Packets (MSB: 0x00 to 0x04)
      if (msb >= 0x00 && msb <= 0x04) {
        const parameter = muteParameters.find(
            param =>
                param.msb === msb.toString(16).padStart(2, '0').toUpperCase() &&
                param.lsb === lsb.toString(16).padStart(2, '0').toUpperCase());

        if (parameter) {
          const muteState = byteArray[11];
          parameter.state = muteState === 1;
          this.setVariableValues(
              {[`mute_${parameter.label}`]: parameter.state});
          this.checkFeedbacks('mute');
        }
      }
      // Handle Volume Packets - Inputs and FX to Outputs and FX
      else if (msb >= 0x40 && msb <= 0x4E) {
        const parameter = levelMatrixInputs.find(
            param => Object.values(param).some(
                target => target.msb ===
                        msb.toString(16).padStart(2, '0').toUpperCase() &&
                    target.lsb ===
                        lsb.toString(16).padStart(2, '0').toUpperCase()));

        if (parameter) {
          // Identify the specific target (e.g., toLR, toOut12, etc.)
          const target = Object.keys(parameter).find(
              key => parameter[key].msb ===
                      msb.toString(16).padStart(2, '0').toUpperCase() &&
                  parameter[key].lsb ===
                      lsb.toString(16).padStart(2, '0').toUpperCase());

          const nearestLabel = this.findNearestDBLabel(valueCoarse, valueFine);

          if (target) {
            // Set the volume value for the identified channel and target
            this.setVariableValues(
                {[`volume_${parameter.label}_${target}`]: nearestLabel.label});

            // Log and update feedback for the volume control
            console.log(
                `Received level for ${parameter.label} ${target}:`,
                nearestLabel.label, 'dB');
          } else {
            console.log('Did not find volume target.');
          }
        }
      }
      // Handle Volume Packets - Outputs, FX unit inputs, and DCAs
      else if (msb == 0x4F) {
        const parameter = levelMatrixOutputs.find(
            param =>
                param.msb === msb.toString(16).padStart(2, '0').toUpperCase() &&
                param.lsb === lsb.toString(16).padStart(2, '0').toUpperCase());

        if (parameter) {
          const nearestLabel = this.findNearestDBLabel(valueCoarse, valueFine);

          if (nearestLabel) {
            // Set the volume value for the identified channel
            this.setVariableValues(
                {[`volume_${parameter.label}`]: nearestLabel.label});

            // Log and update feedback for the volume control
            console.log(
                `Received level for ${parameter.label}:`, nearestLabel.label, 'dB');
          } else {
            console.log('Did not find volume label or volume target.');
          }
        }
      }
      // Handle Pan Packets (MSB: 0x50 to 0x56)
      else if (msb >= 0x50 && msb <= 0x56) {
        const parameter = panMatrix.find(
            param => Object.values(param).some(
                target => target.msb ===
                        msb.toString(16).padStart(2, '0').toUpperCase() &&
                    target.lsb ===
                        lsb.toString(16).padStart(2, '0').toUpperCase()));

        if (parameter) {
          // Identify the specific target (e.g., toLR, toOut12, etc.)
          const target = Object.keys(parameter).find(
              key => parameter[key].msb ===
                      msb.toString(16).padStart(2, '0').toUpperCase() &&
                  parameter[key].lsb ===
                      lsb.toString(16).padStart(2, '0').toUpperCase());

          const nearestLabel = this.findNearestPanLabel(valueCoarse, valueFine);

          if (nearestLabel && target) {
            // Set the pan value for the identified channel and target
            this.setVariableValues(
                {[`pan_${parameter.label}_${target}`]: nearestLabel.label});

            // Log and update feedback for the pan control
            console.log(
                `Pan level for ${parameter.label} ${target}:`, nearestLabel.label);
            this.checkFeedbacks('pan');
          } else {
            console.log('Did not find pan value label or pan target.');
          }
        }
      }
    } else {
      console.log(
          'Received unknown package. Data (hex): ',
          byteArray.map(byte => byte.toString(16).padStart(2, '0')).join(' '));
    }
  }



  async fetchAllMuteStatuses() {
    for (let i = 0; i < muteParameters.length; i++) {
      const {msb, lsb} = muteParameters[i];
      const midiMessage = [
        0xB0, 0x63, parseInt(msb, 16), 0xB0, 0x62, parseInt(lsb, 16), 0xB0,
        0x60, 0x7F
      ];
      this.sendMIDIMessage(midiMessage);
      await this.delay(50);
    }
  }


  hexToByteArray(hex) {
    const bytes = [];

    for (let i = 0; i < hex.length; i += 2) {
      // Use slice() instead of substr()
      bytes.push(parseInt(hex.slice(i, i + 2), 16));
    }

    return bytes;
  }

  sendMIDIMessage(hexMessage) {
    if (!this.tcpClient || this.tcpClient.destroyed) {
      console.log('warning', 'TCP connection is closed!');
      return;
    }
    let buffer = Buffer.from(hexMessage, 'hex');
    this.tcpClient.write(buffer);
  }

  sendMIDIGetMessage(msb, lsb) {
    const midiMessage = [
      0xB0, 0x63, parseInt(msb, 16), 0xB0, 0x62,
      parseInt(lsb, 16), 0xB0, 0x60, 0x7F
    ];

    this.sendMIDIMessage(midiMessage)
  }

  getConfigFields() {
    return ConfigFields
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

runEntrypoint(GenericTcpUdpInstance, [])
