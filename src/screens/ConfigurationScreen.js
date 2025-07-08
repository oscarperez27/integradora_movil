// src/screens/ConfigurationScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  const [gymName, setGymName] = useState('Prime Gym Durango');
  const [gymAddress, setGymAddress] = useState('Av. Siempre Viva 123, Col. Centro');
  const [gymPhone, setGymPhone] = useState('618-123-4567');
  const [gymZones, setGymZones] = useState('Zona Cardio, Área de Pesas Libres, Salón de Clases Grupales, Recepción, Vestidores');

  const [sensors, setSensors] = useState(initialSensorsData);

  const handleSaveGymInfo = () => {
    Alert.alert(
      'Guardar Información',
      '¿Desea guardar los cambios en la información del gimnasio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Guardar', onPress: () => console.log('Guardando info gimnasio') },
      ]
    );
  };

  const handleAddNewSensor = () => {
    Alert.alert('Añadir Sensor');
  };

  const handleEditSensor = (sensorName) => {
    Alert.alert(`Editar sensor ${sensorName}?`,);
  };

  const handleRestartSensor = (sensorName) => {
    Alert.alert(
      'Reiniciar Sensor',
      `¿Está seguro de reiniciar el sensor ${sensorName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reiniciar', onPress: () => console.log('Reiniciando sensor') },
      ]
    );
  };

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
                <TextInput
                  style={styles.input}
                  value={gymName}
                  onChangeText={setGymName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Dirección</Text>
                <TextInput
                  style={styles.input}
                  value={gymAddress}
                  onChangeText={setGymAddress}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  value={gymPhone}
                  onChangeText={setGymPhone}
                  keyboardType="phone-pad"
                />
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
              <TextInput
                style={styles.textarea}
                value={gymZones}
                onChangeText={setGymZones}
                multiline
                placeholder="Separar zonas por comas"
                placeholderTextColor="#95a5a6"
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSaveGymInfo}
            >
              <MaterialCommunityIcons name="content-save" size={20} color="white" />
              <Text style={styles.buttonText}>Guardar Información</Text>
            </TouchableOpacity>
          </View>

          {/* Gestión de Sensores */}
          <View style={styles.settingsCard}>
            <Text style={styles.cardTitle}>Gestión de Sensores</Text>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleAddNewSensor}
            >
              <MaterialCommunityIcons name="plus-circle" size={20} color="white" />
              <Text style={styles.buttonText}>Añadir Sensor</Text>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.sensorColumn]}>Sensor</Text>
                  <Text style={[styles.tableHeaderCell, styles.typeColumn]}>Tipo</Text>
                  <Text style={[styles.tableHeaderCell, styles.zoneColumn]}>Zona</Text>
                  <Text style={[styles.tableHeaderCell, styles.statusColumn]}>Estado</Text>
                  <Text style={[styles.tableHeaderCell, styles.batteryColumn]}>Batería</Text>
                  <Text style={[styles.tableHeaderCell, styles.actionsColumn]}>Acciones</Text>
                </View>

                {sensors.map((sensor) => {
                  const status = getSensorStatus(sensor.status);
                  return (
                    <View key={sensor.id} style={styles.tableRow}>
                      <Text style={[styles.tableCell, styles.sensorColumn]}>{sensor.name}</Text>
                      <Text style={[styles.tableCell, styles.typeColumn]}>{sensor.type}</Text>
                      <Text style={[styles.tableCell, styles.zoneColumn]}>{sensor.zone}</Text>
                      <View style={[styles.tableCell, styles.statusColumn]}>
                        <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                        <Text>{status.text}</Text>
                      </View>
                      <Text style={[styles.tableCell, styles.batteryColumn]}>{sensor.battery}</Text>
                      <View style={[styles.tableCell, styles.actionsColumn]}>
                        <TouchableOpacity onPress={() => handleEditSensor(sensor.name)}>
                          <MaterialCommunityIcons name="pencil" size={20} color="#3498db" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRestartSensor(sensor.name)}>
                          <MaterialCommunityIcons name="restart" size={20} color="#f39c12" />
                        </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    padding: 12,
    fontSize: 14,
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
  },
  gymLogo: {
    width: 60,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DCDCDC',
  },
  primaryButton: {
    backgroundColor: '#D90429',
    padding: 12,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
  statusColumn: { width: 120, flexDirection: 'row', alignItems: 'center' },
  batteryColumn: { width: 100 },
  actionsColumn: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ConfigurationScreen;
