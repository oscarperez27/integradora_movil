// src/screens/DashboardScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import WidgetCard from "../components/WidgetCard";
import CustomHeader from "../components/CustomHeader";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { API } from "../api/apiConfig";

const statusColors = {
  ok: "#27ae60",
  warning: "#f39c12",
  danger: "#D90429",
  info: "#3498db",
};

const DashboardScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [accessData, setAccessData] = useState({
    actuales: 0,
    entradas: 0,
    salidas: 0,
  });
  const [environmentData, setEnvironmentData] = useState({
    avgTemp: "--",
    avgHumidity: "--",
    status: "Cargando...",
    statusType: "info",
  });
  const [inventoryData, setInventoryData] = useState({
    lowStockProducts: 0,
    productsToReview: [],
  });

  const [token, setToken] = useState("");

  // Obtener token de AsyncStorage al montar componente
  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error obteniendo token:", error);
      }
    };
    getToken();
  }, []);

  const getTodayDates = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const today = `${yyyy}-${mm}-${dd}`;
    return { startDate: today, endDate: today };
  };

  const calcAverage = (arr) => {
    if (!arr.length) return "--";
    const sum = arr.reduce((a, b) => a + b, 0);
    return (sum / arr.length).toFixed(1);
  };

  const fetchAllData = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const { startDate, endDate } = getTodayDates();

      const headers = { Authorization: `Bearer ${token}` };

      const [peopleRes, tempRes, humRes, productRes] = await Promise.all([
        fetch(`${API}/api/sensor/people-countToday`, { headers }),
        fetch(`${API}/api/sensor/temperature?startDate=${startDate}&endDate=${endDate}`, { headers }),
        fetch(`${API}/api/sensor/humidity?startDate=${startDate}&endDate=${endDate}`, { headers }),
        fetch(`${API}/api/product/products`, { headers }),
      ]);

      const [peopleData, tempData, humData, productData] = await Promise.all([
        peopleRes.json(),
        tempRes.json(),
        humRes.json(),
        productRes.json(),
      ]);

      if (peopleRes.ok) {
        setAccessData({
          actuales: peopleData.actuales || 0,
          entradas: peopleData.entradas || 0,
          salidas: peopleData.salidas || 0,
        });
      }

      if (tempRes.ok) {
        const temps = tempData.map((d) => d.valor).filter((v) => typeof v === "number");
        const avgTemp = calcAverage(temps);
        let statusType = "ok",
          status = "Temperatura normal";
        if (avgTemp === "--") {
          statusType = "info";
          status = "Sin datos de temperatura";
        } else if (avgTemp > 28) {
          statusType = "warning";
          status = "Temperatura alta";
        } else if (avgTemp < 10) {
          statusType = "danger";
          status = "Temperatura baja";
        }
        setEnvironmentData((env) => ({ ...env, avgTemp, status, statusType }));
      }

      if (humRes.ok) {
        const hums = humData.map((d) => d.valor).filter((v) => typeof v === "number");
        setEnvironmentData((env) => ({ ...env, avgHumidity: calcAverage(hums) }));
      }

      if (productRes.ok) {
        const lowStock = productData.filter((p) => p.stock <= 5 && p.status === true);
        setInventoryData({
          lowStockProducts: lowStock.length,
          productsToReview: lowStock.map((p) => p.name),
        });
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (isLoading)
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10 }}>Cargando datos...</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Panel de Control" navigation={navigation} />
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.dashboardArea}>
          <Text style={styles.dashboardTitle}>Dashboard General</Text>

          <View style={styles.widgetsGrid}>
            {/* Widget de Alertas */}
            <WidgetCard title="Alertas Importantes" iconName="alert-circle" iconLibrary="MaterialCommunityIcons">
              <View style={styles.alertList}>
                {inventoryData.lowStockProducts > 0 ? (
                  inventoryData.productsToReview.map((name, idx) => (
                    <View key={idx} style={styles.alertItem}>
                      <Text style={[styles.alertText, { color: statusColors.warning }]}>
                        Stock bajo - <Text style={styles.alertDetailText}>{name}</Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={[styles.alertText, { color: statusColors.ok }]}>Sin alertas</Text>
                )}
              </View>
            </WidgetCard>

            {/* Widget de Accesos */}
            <WidgetCard title="Accesos Hoy" iconName="people" iconLibrary="MaterialIcons">
              <View style={styles.widgetDataContainer}>
                <Text style={styles.widgetValue}>{accessData.actuales}</Text>
                <Text style={styles.widgetLabel}>Personas Actualmente</Text>
              </View>
              <View style={styles.widgetDataContainer}>
                <Text style={styles.widgetValue}>{accessData.entradas}</Text>
                <Text style={styles.widgetLabel}>Entradas Hoy</Text>
              </View>
              <View style={styles.widgetDataContainer}>
                <Text style={styles.widgetValue}>{accessData.salidas}</Text>
                <Text style={styles.widgetLabel}>Salidas Hoy</Text>
              </View>
            </WidgetCard>

            {/* Widget de Ambiente */}
            <WidgetCard title="Ambiente General" iconName="thermometer-half" iconLibrary="FontAwesome5">
              <View style={styles.widgetDataContainer}>
                <Text style={styles.widgetValue}>{environmentData.avgTemp} °C</Text>
                <Text style={styles.widgetLabel}>Temperatura Promedio</Text>
              </View>
              <View style={styles.widgetDataContainer}>
                <Text style={styles.widgetValue}>{environmentData.avgHumidity} %</Text>
                <Text style={styles.widgetLabel}>Humedad Promedio</Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={[styles.statusText, { color: statusColors[environmentData.statusType] }]}>
                  {environmentData.status}
                </Text>
              </View>
            </WidgetCard>

            {/* Widget de Inventario */}
            <WidgetCard title="Inventario Crítico" iconName="box-open" iconLibrary="FontAwesome5">
              <View style={styles.widgetDataContainer}>
                <Text style={styles.widgetValue}>{inventoryData.lowStockProducts}</Text>
                <Text style={styles.widgetLabel}>Productos con Stock Bajo</Text>
              </View>
              <View style={styles.inventoryList}>
                <Text style={styles.widgetText}>
                  Revisar: {inventoryData.productsToReview.join(", ") || "Ninguno"}
                </Text>
              </View>
            </WidgetCard>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContent: {
    flex: 1,
  },
  dashboardArea: {
    padding: 20,
  },
  dashboardTitle: {
    fontSize: 28,
    color: "#1A1A1A",
    marginBottom: 25,
    fontWeight: "bold",
  },
  widgetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  alertList: {
    width: "100%",
  },
  alertItem: {
    marginBottom: 8,
  },
  alertText: {
    fontSize: 14,
    fontWeight: "500",
  },
  alertDetailText: {
    fontWeight: "400",
  },
  widgetDataContainer: {
    marginBottom: 12,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  widgetValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 5,
  },
  widgetLabel: {
    fontSize: 14,
    color: "#7f8c8d",
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
