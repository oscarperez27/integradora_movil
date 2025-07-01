// src/screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import WidgetCard from '../components/WidgetCard';
import CustomHeader from '../components/CustomHeader';

const DashboardScreen = ({ navigation }) => {
  const [alerts, setAlerts] = useState([
    { id: 'a1', type: 'danger', text: 'Temperatura alta', detail: 'Zona Cardio' },
    { id: 'a2', type: 'warning', text: 'Stock bajo', detail: 'Proteína Whey' },
    { id: 'a3', type: 'info', text: 'Sensor de Puerta Principal Offline', detail: '' },
  ]);

  const [accessData, setAccessData] = useState({
    currentPeople: 127,
    totalAccessesToday: 350,
  });

  const [environmentData, setEnvironmentData] = useState({
    avgTemp: '23°C',
    avgHumidity: '55%',
    status: 'Todos los valores en rango.',
    statusType: 'ok',
  });

  const [inventoryData, setInventoryData] = useState({
    lowStockProducts: 3,
    productsToReview: ['Proteína Whey', 'Barritas Energéticas', 'Creatina'],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Actualizando datos del dashboard...');
    }, 50000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader title="Panel de Control" navigation={navigation} />
      
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.dashboardArea}>
          <Text style={styles.dashboardTitle}>Dashboard General</Text>

          <View style={styles.widgetsGrid}>
            {/* Widget de Alertas */}
            <WidgetCard 
              title="Alertas Importantes" 
              iconName="alert-circle" 
              iconLibrary="MaterialCommunityIcons"
            >
              <View style={styles.alertList}>
                {alerts.map(alert => (
                  <View key={alert.id} style={styles.alertItem}>
                    <Text style={[styles.alertText, styles[`status${alert.type}Text`]]}>
                      {alert.text}
                      {alert.detail ? (
                        <Text style={styles.alertDetailText}> - {alert.detail}</Text>
                      ) : null}
                    </Text>
                  </View>
                ))}
              </View>
            </WidgetCard>

            {/* Widget de Accesos */}
            <WidgetCard 
              title="Accesos Hoy" 
              iconName="people" 
              iconLibrary="MaterialIcons"
            >
              <View style={styles.widgetDataContainer}>
                <Text style={styles.widgetValue}>{accessData.currentPeople}</Text>
                <Text style={styles.widgetLabel}>Personas Actualmente</Text>
              </View>
              <View style={styles.widgetDataContainer}>
                <Text style={styles.widgetValue}>{accessData.totalAccessesToday}</Text>
                <Text style={styles.widgetLabel}>Total Accesos del Día</Text>
              </View>
            </WidgetCard>

            {/* Widget de Ambiente */}
            <WidgetCard 
              title="Ambiente General" 
              iconName="thermometer-half" 
              iconLibrary="FontAwesome5"
            >
              <View style={styles.widgetDataContainer}>
                <Text style={styles.widgetValue}>{environmentData.avgTemp}</Text>
                <Text style={styles.widgetLabel}>Temperatura Promedio</Text>
              </View>
              <View style={styles.widgetDataContainer}>
                <Text style={styles.widgetValue}>{environmentData.avgHumidity}</Text>
                <Text style={styles.widgetLabel}>Humedad Promedio</Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={[styles.statusText, styles[`status${environmentData.statusType}Text`]]}>
                  {environmentData.status}
                </Text>
              </View>
            </WidgetCard>

            {/* Widget de Inventario */}
            <WidgetCard 
              title="Inventario Crítico" 
              iconName="box-open" 
              iconLibrary="FontAwesome5"
            >
              <View style={styles.widgetDataContainer}>
                <Text style={styles.widgetValue}>{inventoryData.lowStockProducts}</Text>
                <Text style={styles.widgetLabel}>Productos con Stock Bajo</Text>
              </View>
              <View style={styles.inventoryList}>
                <Text style={styles.widgetText}>
                  Revisar: {inventoryData.productsToReview.join(', ')}
                </Text>
              </View>
            </WidgetCard>
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
  dashboardArea: {
    padding: 20,
  },
  dashboardTitle: {
    fontSize: 28,
    color: '#1A1A1A',
    marginBottom: 25,
    fontWeight: 'bold',
  },
  widgetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  alertList: {
    width: '100%',
  },
  alertItem: {
    marginBottom: 8,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '500',
  },
  alertDetailText: {
    fontWeight: '400',
  },
  widgetDataContainer: {
    marginBottom: 12,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusokText: { 
    color: '#27ae60' 
  },
  statuswarningText: { 
    color: '#f39c12' 
  },
  statusdangerText: { 
    color: '#D90429' 
  },
  statusinfoText: { 
    color: '#3498db' 
  },
  widgetValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  widgetLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  widgetText: {
    fontSize: 15,
    marginVertical: 8,
  },
  inventoryList: {
    marginTop: 8,
  },
});

export default DashboardScreen;