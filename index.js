import {InstanceBase, InstanceStatus, runEntrypoint, TCPHelper, UDPHelper} from '@companion-module/base'
import * as net from 'net';

import {getActionDefinitions} from './actions.js'
import {ConfigFields} from './config.js'
import {getFeedbackDefinitions} from './feedbacks.js'
import {muteParameters} from './helpers.js';
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

    // Merge with any other variable definitions you already have
    const allVariableDefinitions = [...variables, ...muteVariableDefinitions];
    this.setVariableDefinitions(allVariableDefinitions);

    // Set initial values for all mute statuses (default is false)
    const initialMuteValues = muteParameters.reduce((acc, param) => {
      acc[`mute_${param.label}`] = param.state;
      return acc;
    }, {activeScene: null});

    this.setVariableValues(initialMuteValues);

    this.setActionDefinitions(getActionDefinitions(this));
    this.setFeedbackDefinitions(getFeedbackDefinitions(this));
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
        i++;  // Skip one byte and try to parse from the next one
      }
    }
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
    // Handle Mute Status Messages
    else if (byteArray.length === 12) {
      if (byteArray[6] === 0xB0 && byteArray[7] === 0x06 &&
          byteArray[8] === 0x00) {
        const msb = byteArray[2];
        const lsb = byteArray[5];
        const muteState = byteArray[11];

        const parameter = muteParameters.find(
            param => param.msb === msb.toString(16).padStart(2, '0') &&
                param.lsb === lsb.toString(16).padStart(2, '0'));

        if (parameter) {
          parameter.state = muteState === 1;
          console.log(`Mute state for ${parameter.label}:`, parameter.state);
          this.setVariableValues(
              {[`mute_${parameter.label}`]: parameter.state});
          this.checkFeedbacks('mute');
        }
      }
    } else {
      console.log('Received unknown package. Data (hex): ', hexMessage);
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

  getConfigFields() {
    return ConfigFields
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

runEntrypoint(GenericTcpUdpInstance, [])
