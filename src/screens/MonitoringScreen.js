// src/screens/MonitoringScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import ZoneCard from '../components/ZoneCard';
import CustomHeader from '../components/CustomHeader';

// Obtener dimensiones de la pantalla para calcular anchos responsivos
const { width } = Dimensions.get('window');

// Datos simulados para tarjetas de zona
const initialZoneData = [
  {
    id: '1',
    zoneName: 'Zona de ejercicios Cardio',
    status: 'Óptimo',
    temp: 22,
    humidity: 50,
    lastUpdated: 'Hace 1 min',
  },
  {
    id: '2',
    zoneName: 'Área de Pesas Libres',
    status: 'Temperatura Alta',
    temp: 28,
    humidity: 58,
    lastUpdated: 'Hace 2 min',
  },
  {
    id: '3',
    zoneName: 'Salón de Clases Grupales',
    status: 'Humedad Elevada',
    temp: 24,
    humidity: 75,
    lastUpdated: 'Hace 1 min',
  },
  {
    id: '4',
    zoneName: 'Recepción',
    status: 'Sensor Offline',
    temp: '--',
    humidity: '--',
    lastUpdated: 'Última conexión: Hace 2 horas',
  },
];

const MonitoringScreen = ({ navigation }) => {
  const [zoneData, setZoneData] = useState(initialZoneData);
  const [overallStatus, setOverallStatus] = useState('Todos los sensores Online');
  const [activeAlerts, setActiveAlerts] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Actualizando datos de monitoreo...');
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDetailsPress = (zoneName) => {
    Alert.alert(
      'Detalles de Zona',
      `Mostraría detalles específicos para: ${zoneName}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Monitoreo Ambiental" navigation={navigation} />
      
      <ScrollView 
        style={styles.scrollViewContent}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.monitoringArea}>
          <Text style={styles.pageTitle}>Estado Ambiental del Gimnasio</Text>

          <View style={styles.statusOverview}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Estado General: </Text>
              <Text style={styles.sensorsOk}>{overallStatus}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Alertas: </Text>
              <Text style={styles.alertsActive}>{activeAlerts} Activas</Text>
            </View>
          </View>

          <View style={styles.zoneGrid}>
            {zoneData.map((zone) => (
              <View key={zone.id} style={styles.cardItem}>
                <ZoneCard
                  zoneName={zone.zoneName}
                  status={zone.status}
                  temp={zone.temp}
                  humidity={zone.humidity}
                  lastUpdated={zone.lastUpdated}
                  onDetailsPress={() => handleDetailsPress(zone.zoneName)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollViewContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  monitoringArea: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 28,
    color: '#1A1A1A',
    marginBottom: 25,
    fontWeight: 'bold',
  },
  statusOverview: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  overviewItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  overviewLabel: {
    fontSize: 16,
    color: '#4A4A4A',
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  sensorsOk: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 16,
  },
  alertsActive: {
    color: '#D90429',
    fontWeight: 'bold',
    fontSize: 16,
  },
  zoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardItem: {
    width: width > 500 ? '48%' : '100%', // Responsivo para tablets y móviles
    marginBottom: 15,
    aspectRatio: 1.5, // Mantener relación de aspecto consistente
  },
});

export default MonitoringScreen;