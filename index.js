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
    this.setVariableDefinitions(variables);
    this.setVariableValues({activeScene: null});
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
      console.log('Received data (hex):', hexMessage);
      this.handleIncomingMessage(hexMessage);
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
  handleIncomingMessage(hexMessage) {
    const byteArray = this.hexToByteArray(hexMessage);

    // Handle Scene Change
    if (byteArray.length === 5) {
      const statusByte = byteArray[0];
      const sceneNumber = byteArray[4];

      if ((statusByte & 0xF0) === 0xB0) {
        this.currentScene = sceneNumber + 1;
        console.log('Current scene loaded:', this.currentScene);
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

          this.checkFeedbacks('mute');
        }
      }
    }
  }


  hexToByteArray(hex) {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
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
}

runEntrypoint(GenericTcpUdpInstance, [])
