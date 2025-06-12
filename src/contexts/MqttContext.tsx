// src/contexts/MqttContext.tsx
"use client";

import type { MqttClient } from 'mqtt';
import mqtt from 'mqtt';
import type { ReactNode} from 'react';
import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

const MQTT_BROKER_URL = 'wss://broker.emqx.io:8084/mqtt'; // Default public broker
const MQTT_CONNECT_OPTIONS = {
  keepalive: 60,
  clientId: `hydrocontrol_client_${Math.random().toString(16).substring(2, 8)}`, // Unique client ID
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000, // milliseconds
  connectTimeout: 30 * 1000, // milliseconds
};

type MqttMessageHandler = (topic: string, payload: Buffer, packet: mqtt.IPublishPacket) => void;

interface MqttContextType {
  client: MqttClient | null;
  isConnected: boolean;
  subscribe: (topic: string, onMessage: MqttMessageHandler, qos?: mqtt.QoS) => void;
  unsubscribe: (topic: string, onMessage: MqttMessageHandler) => void;
  publish: (topic: string, message: string | Buffer, qos?: mqtt.QoS, retain?: boolean) => void;
}

export const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const MqttProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messageHandlersRef = useRef<Map<string, Set<MqttMessageHandler>>>(new Map());

  useEffect(() => {
    console.log('MQTT: Attempting to connect...');
    const mqttClient = mqtt.connect(MQTT_BROKER_URL, MQTT_CONNECT_OPTIONS);
    setClient(mqttClient);

    mqttClient.on('connect', () => {
      console.log('MQTT: Connected to broker');
      setIsConnected(true);
      // Resubscribe to topics if any were registered before connection
      messageHandlersRef.current.forEach((handlers, topic) => {
        if (handlers.size > 0) {
          mqttClient.subscribe(topic, (err) => {
            if (err) {
              console.error(`MQTT: Failed to resubscribe to ${topic}`, err);
            } else {
              console.log(`MQTT: Resubscribed to ${topic}`);
            }
          });
        }
      });
    });

    mqttClient.on('reconnect', () => {
      console.log('MQTT: Reconnecting...');
      setIsConnected(false);
    });

    mqttClient.on('close', () => {
      console.log('MQTT: Connection closed');
      setIsConnected(false);
    });

    mqttClient.on('error', (error) => {
      console.error('MQTT: Connection error:', error);
      // mqttClient.end(); // No need to manually end, it will try to reconnect based on reconnectPeriod
      setIsConnected(false);
    });

    mqttClient.on('message', (topic, payload, packet) => {
      // console.log(`MQTT: Message received on ${topic}: ${payload.toString()}`);
      const handlers = messageHandlersRef.current.get(topic);
      if (handlers) {
        handlers.forEach(handler => handler(topic, payload, packet));
      }
    });

    return () => {
      if (mqttClient) {
        console.log('MQTT: Disconnecting...');
        mqttClient.end(true); // Force close, don't try to reconnect
        setIsConnected(false);
        setClient(null);
      }
    };
  }, []);

  const subscribe = useCallback((topic: string, onMessage: MqttMessageHandler, qos: mqtt.QoS = 0) => {
    if (!client) {
      console.warn('MQTT: Client not initialized. Cannot subscribe.');
      return;
    }
    
    if (!messageHandlersRef.current.has(topic)) {
      messageHandlersRef.current.set(topic, new Set());
    }
    const handlers = messageHandlersRef.current.get(topic);
    if (handlers && !handlers.has(onMessage)) {
      handlers.add(onMessage);
      if (isConnected && client.connected) { // Only subscribe if connected
        client.subscribe(topic, { qos }, (err) => {
          if (err) {
            console.error(`MQTT: Failed to subscribe to ${topic}`, err);
          } else {
            console.log(`MQTT: Subscribed to ${topic}`);
          }
        });
      } else {
         console.log(`MQTT: Queued subscription for ${topic} (client not connected yet).`);
      }
    }
  }, [client, isConnected]);

  const unsubscribe = useCallback((topic: string, onMessage: MqttMessageHandler) => {
    if (!client) return;

    const handlers = messageHandlersRef.current.get(topic);
    if (handlers) {
      handlers.delete(onMessage);
      if (handlers.size === 0) {
        messageHandlersRef.current.delete(topic);
        if (isConnected && client.connected) { // Only unsubscribe if connected
            client.unsubscribe(topic, (err) => {
            if (err) {
              console.error(`MQTT: Failed to unsubscribe from ${topic}`, err);
            } else {
              console.log(`MQTT: Unsubscribed from ${topic}`);
            }
          });
        }
      }
    }
  }, [client, isConnected]);

  const publish = useCallback((topic: string, message: string | Buffer, qos: mqtt.QoS = 0, retain: boolean = false) => {
    if (client && isConnected) {
      client.publish(topic, message, { qos, retain }, (err) => {
        if (err) {
          console.error(`MQTT: Failed to publish to ${topic}`, err);
        } else {
          // console.log(`MQTT: Published to ${topic}: ${message}`);
        }
      });
    } else {
      console.warn('MQTT: Client not connected. Cannot publish.');
    }
  }, [client, isConnected]);

  return (
    <MqttContext.Provider value={{ client, isConnected, subscribe, unsubscribe, publish }}>
      {children}
    </MqttContext.Provider>
  );
};
