// src/components/ZoneCard.js (versión optimizada)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ZoneCard = ({ 
  zoneName, 
  status, 
  temp, 
  humidity, 
  lastUpdated, 
  onDetailsPress
}) => {
  const statusConfig = {
    'Óptimo': {
      headerColor: '#27ae60',
      indicatorBg: '#d5f5e3',
      indicatorText: '#27ae60'
    },
    'Temperatura Alta': {
      headerColor: '#D90429',
      indicatorBg: '#fadbd8',
      indicatorText: '#D90429'
    },
    'Humedad Elevada': {
      headerColor: '#f39c12',
      indicatorBg: '#fef9e7',
      indicatorText: '#f39c12'
    },
    'Sensor Offline': {
      headerColor: '#7f8c8d',
      indicatorBg: '#ecf0f1',
      indicatorText: '#7f8c8d'
    }
  };

  const currentStatus = statusConfig[status] || statusConfig['Óptimo'];

  const formatValue = (value, unit) => 
    value === '--' ? value : `${value}${unit}`;

  return (
    <View style={styles.card}>
      <View style={[
        styles.cardHeader, 
        { borderTopColor: currentStatus.headerColor }
      ]}>
        <Text style={styles.zoneName} numberOfLines={1} ellipsizeMode="tail">
          {zoneName}
        </Text>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: currentStatus.indicatorBg }
        ]}>
          <Text style={[
            styles.statusText,
            { color: currentStatus.indicatorText }
          ]}>
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.dataPoint}>
          <Text style={styles.value}>{formatValue(temp, '°C')}</Text>
          <Text style={styles.label}>Temperatura</Text>
        </View>
        <View style={styles.dataPoint}>
          <Text style={styles.value}>{formatValue(humidity, '%')}</Text>
          <Text style={styles.label}>Humedad</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.lastUpdated}>
          <MaterialCommunityIcons name="clock-outline" size={12} color="#7f8c8d" />
          {' '}{lastUpdated}
        </Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onDetailsPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Ver detalles</Text>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={18} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    flex: 1,
    margin: 8,
    minHeight: 220, // Altura mínima para consistencia
  },
  cardHeader: {
    padding: 16,
    borderTopWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 10,
  },
  statusIndicator: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataPoint: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#7f8c8d',
    flex: 1,
  },
  button: {
    backgroundColor: '#D90429',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});

export default ZoneCard;