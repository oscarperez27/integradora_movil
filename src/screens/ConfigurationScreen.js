// src/screens/ConfigurationScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import CustomHeader from '../components/CustomHeader';

const initialSensorsData = [
  {
    id: 's1',
    name: 'TEMP-CARDIO-01',
    type: 'Temperatura/Humedad (DHT11)',
    zone: 'Zona Cardio',
    status: 'online',
    battery: '85%',
  },
  {
    id: 's2',
    name: 'MOV-PESAS-01',
    type: 'Movimiento (PIR)',
    zone: 'Área de Pesas Libres',
    status: 'online',
    battery: 'N/A (Cableado)',
  },
  {
    id: 's3',
    name: 'ACCESO-PPL-01',
    type: 'Acceso (RFID)',
    zone: 'Puerta Principal',
    status: 'offline',
    battery: 'N/A',
  },
  {
    id: 's4',
    name: 'HUM-VESTIDOR-M',
    type: 'Humedad (DHT11)',
    zone: 'Vestidores Hombres',
    status: 'low-battery',
    battery: '15%',
  },
];

const ConfigurationScreen = ({ navigation }) => {
  // Datos estáticos (ya no cambia)
  const gymName = 'Prime Gym Durango';
  const gymAddress = 'Av. Siempre Viva 123, Col. Centro';
  const gymPhone = '618-123-4567';
  const gymZones = 'Zona Cardio, Área de Pesas Libres, Salón de Clases Grupales, Recepción, Vestidores';
  const sensors = initialSensorsData;

  const getSensorStatus = (status) => {
    switch (status) {
      case 'online':
        return { text: 'En línea', color: '#2ecc71' };
      case 'offline':
        return { text: 'Desconectado', color: '#e74c3c' };
      case 'low-battery':
        return { text: 'Batería baja', color: '#f1c40f' };
      default:
        return { text: 'Desconocido', color: '#7f8c8d' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Configuración" navigation={navigation} />

      <ScrollView
        style={styles.scrollViewContent}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.settingsArea}>
          <Text style={styles.pageTitle}>Configuración del Sistema</Text>
          <Text style={styles.pageSubtitle}>Ajustes generales y administración</Text>

          {/* Información del Gimnasio */}
          <View style={styles.settingsCard}>
            <Text style={styles.cardTitle}>Información del Gimnasio</Text>

            <View style={styles.formGrid}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nombre del Gimnasio</Text>
                <Text style={styles.staticText}>{gymName}</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Dirección</Text>
                <Text style={styles.staticText}>{gymAddress}</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Teléfono</Text>
                <Text style={styles.staticText}>{gymPhone}</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Logo Actual</Text>
                <Image
                  source={require('../../assets/Prime_Gym.jpg')}
                  style={styles.gymLogo}
                />
              </View>
            </View>

            <View style={styles.fullWidthGroup}>
              <Text style={styles.label}>Zonas del Gimnasio</Text>
              <Text style={[styles.staticText, styles.zonesText]}>{gymZones}</Text>
            </View>
          </View>

          {/* Gestión de Sensores */}
          <View style={styles.settingsCard}>
            <Text style={styles.cardTitle}>Gestión de Sensores</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.sensorColumn]}>Sensor</Text>
                  <Text style={[styles.tableHeaderCell, styles.typeColumn]}>Tipo</Text>
                  <Text style={[styles.tableHeaderCell, styles.zoneColumn]}>Zona</Text>
                  <Text style={[styles.tableHeaderCell, styles.statusColumn]}>Estado</Text>
                  <Text style={[styles.tableHeaderCell, styles.batteryColumn]}>Batería</Text>
                  <Text style={[styles.tableHeaderCell, styles.actionsColumn]}></Text>
                </View>

                {sensors.map((sensor) => {
                  const status = getSensorStatus(sensor.status);
                  return (
                    <View key={sensor.id} style={styles.tableRow}>
                      <Text style={[styles.tableCell, styles.sensorColumn]}>{sensor.name}</Text>
                      <Text style={[styles.tableCell, styles.typeColumn]}>{sensor.type}</Text>
                      <Text style={[styles.tableCell, styles.zoneColumn]}>{sensor.zone}</Text>
                      <View style={[styles.tableCell, styles.statusColumn, { flexDirection: 'row', alignItems: 'center' }]}>
                        <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                        <Text>{status.text}</Text>
                      </View>
                      <Text style={[styles.tableCell, styles.batteryColumn]}>{sensor.battery}</Text>
                      <View style={[styles.tableCell, styles.actionsColumn]}>
                        {/* Aquí no hay botones */}
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  scrollViewContent: { flex: 1 },
  scrollContentContainer: { paddingBottom: 30 },
  settingsArea: { padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 5 },
  pageSubtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 20 },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    paddingBottom: 10,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  formGroup: { width: '48%', marginBottom: 15 },
  fullWidthGroup: { width: '100%', marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '500', color: '#4A4A4A', marginBottom: 8 },

  staticText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    paddingHorizontal: 12,
  },

  zonesText: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  gymLogo: {
    width: 60,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DCDCDC',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableHeaderCell: {
    fontWeight: '600',
    fontSize: 12,
    color: '#4A4A4A',
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  tableCell: { fontSize: 14, color: '#4A4A4A', textAlign: 'left' },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  sensorColumn: { width: 180 },
  typeColumn: { width: 200 },
  zoneColumn: { width: 150 },
  statusColumn: { width: 120 },
  batteryColumn: { width: 100 },
  actionsColumn: { width: 100 },
});

export default ConfigurationScreen;
