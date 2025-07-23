// src/screens/MonitoringScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import ZoneCard from '../components/ZoneCard';
import CustomHeader from '../components/CustomHeader';
import { API } from '../api/apiConfig';

const { width } = Dimensions.get('window');

const zonas = [
  { id: '1', name: 'Zona de ejercicios Cardio', key: 'zona1' },
  { id: '2', name: 'Área de Pesas Libres', key: 'zona2' },
  { id: '3', name: 'Salón de Clases Grupales', key: 'zona3' },
];

const MonitoringScreen = ({ navigation }) => {
  const [zoneData, setZoneData] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [expandedZone, setExpandedZone] = useState(null);

  const fetchZoneData = useCallback(async () => {
    setLoading(true);
    setAlertMessage(null);

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const today = `${yyyy}-${mm}-${dd}`;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token disponible');

      const data = await Promise.all(
        zonas.map(async (zona) => {
          const [tempRes, humRes] = await Promise.all([
            fetch(`${API}/api/sensor/temperatureByZone?zona=${zona.key}&startDate=${today}&endDate=${today}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API}/api/sensor/humidityByZone?zona=${zona.key}&startDate=${today}&endDate=${today}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          if (!tempRes.ok || !humRes.ok) {
            throw new Error(`Error al obtener datos para la zona ${zona.name}`);
          }

          const tempData = await tempRes.json();
          const humData = await humRes.json();

          const lastTemp = tempData.length > 0 ? tempData[tempData.length - 1].valor : 0;
          const lastHum = humData.length > 0 ? humData[humData.length - 1].valor : 0;

          let status = 'Óptimo';
          if (lastTemp > 26) status = 'Temperatura Alta';
          if (lastHum > 70) status = 'Humedad Elevada';

          const tempPoints = tempData.map((d) => d.valor);
          const humPoints = humData.map((d) => d.valor);
          const timeLabels = tempData.map((d) => {
            const date = new Date(d.timestamp);
            return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
          });

          setGraphData((prev) => ({
            ...prev,
            [zona.key]: {
              labels: timeLabels,
              temperature: tempPoints,
              humidity: humPoints,
            },
          }));

          return {
            id: zona.id,
            zoneKey: zona.key,
            zoneName: zona.name,
            status,
            temp: lastTemp,
            humidity: lastHum,
            lastUpdated: 'Hace 1 min',
          };
        })
      );

      setZoneData(data);
    } catch (error) {
      setAlertMessage(error.message || 'Error al cargar datos de sensores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchZoneData();
  }, [fetchZoneData]);

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 1,
    labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    propsForDots: { r: '3', strokeWidth: '1', stroke: '#2980b9' },
  };

  const renderChart = (label, data, color = '#3498db') => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{label}</Text>
      <LineChart
        data={{
          labels: data.labels.slice(-6),
          datasets: [{ data: data.dataset.slice(-6) }],
        }}
        width={width - 40}
        height={220}
        yAxisSuffix="°"
        chartConfig={{ ...chartConfig, color: () => color }}
        bezier
        style={styles.chartStyle}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10 }}>Cargando datos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Monitoreo Ambiental" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.monitoringArea}>
          <Text style={styles.pageTitle}>Estado Ambiental del Gimnasio</Text>

          <View style={styles.statusOverview}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Estado General: </Text>
              <Text style={styles.sensorsOk}>Todos los sensores Online</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Alertas: </Text>
              <Text style={styles.alertsActive}>
                {
                  zoneData.filter(
                    (z) =>
                      z.status.toLowerCase().includes('alta') ||
                      z.status.toLowerCase().includes('elevada')
                  ).length
                }{' '}
                Activas
              </Text>
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
                  onDetailsPress={() =>
                    setExpandedZone((prev) => (prev === zone.zoneKey ? null : zone.zoneKey))
                  }
                />
                {expandedZone === zone.zoneKey && graphData[zone.zoneKey] && (
                  <>
                    {renderChart(`Temperatura - ${zone.zoneName}`, {
                      labels: graphData[zone.zoneKey].labels,
                      dataset: graphData[zone.zoneKey].temperature,
                    })}
                    {renderChart(`Humedad - ${zone.zoneName}`, {
                      labels: graphData[zone.zoneKey].labels,
                      dataset: graphData[zone.zoneKey].humidity,
                    }, '#27ae60')}
                  </>
                )}
              </View>
            ))}
          </View>

          {alertMessage && (
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>{alertMessage}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContentContainer: { paddingBottom: 40 },
  monitoringArea: { padding: 20 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 25 },
  statusOverview: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
    elevation: 2,
  },
  overviewItem: { flexDirection: 'row', marginBottom: 5 },
  overviewLabel: { fontSize: 16, color: '#4A4A4A' },
  sensorsOk: { color: '#2e7d32', fontWeight: 'bold', fontSize: 16 },
  alertsActive: { color: '#D90429', fontWeight: 'bold', fontSize: 16 },
  zoneGrid: { flexDirection: 'column' },
  cardItem: { marginBottom: 15 },
  chartContainer: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chartStyle: { borderRadius: 8 },
  alertBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8d7da',
    borderRadius: 5,
  },
  alertText: { color: '#721c24' },
});

export default MonitoringScreen;
