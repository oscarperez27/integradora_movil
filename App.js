import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { 
  MaterialCommunityIcons, 
  FontAwesome5, 
  Ionicons,
  FontAwesome,
  Feather,
  MaterialIcons
} from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importa todas tus pantallas
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MonitoringScreen from './src/screens/MonitoringScreen';
import AccessControlScreen from './src/screens/AccessControlScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import ConfigurationScreen from './src/screens/ConfigurationScreen';
import AdminProfileScreen from './src/screens/AdminProfileScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Componente Personalizado para el Contenido del Drawer (Sidebar)
const CustomDrawerContent = (props) => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.drawerContainer,
      { paddingTop: insets.top }
    ]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.sidebarLogo}>
          <Image source={require('./assets/Prime_Gym.jpg')} style={styles.logoImage} />
          <Text style={styles.logoText}>Prime Gym</Text>
        </View>
        <View style={styles.sidebarNav}>
          {/* Dashboard */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('DashboardTab')}
          >
            <MaterialIcons name="dashboard" size={24} color="#f0f0f0" style={styles.icon} />
            <Text style={styles.drawerItemText}>Dashboard</Text>
          </TouchableOpacity>

          {/* Monitoreo Ambiental */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('MonitoringTab')}
          >
            <MaterialCommunityIcons name="chart-areaspline" size={24} color="#f0f0f0" style={styles.icon} />
            <Text style={styles.drawerItemText}>Monitoreo Ambiental</Text>
          </TouchableOpacity>

          {/* Control de Acceso */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('AccessControlTab')}
          >
            <MaterialCommunityIcons name="fingerprint" size={24} color="#f0f0f0" style={styles.icon} />
            <Text style={styles.drawerItemText}>Control de Acceso</Text>
          </TouchableOpacity>

          {/* Inventario */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('InventoryTab')}
          >
            <FontAwesome5 name="boxes" size={22} color="#f0f0f0" style={styles.icon} />
            <Text style={styles.drawerItemText}>Inventario</Text>
          </TouchableOpacity>

          {/* Reportes */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('ReportsTab')}
          >
            <Feather name="file-text" size={24} color="#f0f0f0" style={styles.icon} />
            <Text style={styles.drawerItemText}>Reportes</Text>
          </TouchableOpacity>

          {/* Configuración */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('ConfigurationTab')}
          >
            <Ionicons name="settings-sharp" size={24} color="#f0f0f0" style={styles.icon} />
            <Text style={styles.drawerItemText}>Configuración</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Drawer Navigator Principal
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="DashboardTab"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#2c3e50',
          width: 240,
        },
      }}
    >
      <Drawer.Screen 
        name="DashboardTab" 
        component={DashboardScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="MonitoringTab" 
        component={MonitoringScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons name="chart-areaspline" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="AccessControlTab" 
        component={AccessControlScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons name="fingerprint" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="InventoryTab" 
        component={InventoryScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <FontAwesome5 name="boxes" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="ReportsTab" 
        component={ReportsScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Feather name="file-text" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="ConfigurationTab" 
        component={ConfigurationScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="settings-sharp" size={size} color={color} />
          )
        }}
      />
    </Drawer.Navigator>
  );
};

// Navegador Raíz (Autenticación y App Principal)
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="App Principal"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Perfil" 
        component={AdminProfileScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos para el CustomDrawerContent
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  scrollView: {
    flex: 1,
  },
  sidebarLogo: {
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoImage: {
    maxWidth: '80%',
    height: 100,
    resizeMode: 'contain',
  },
  logoText: {
    marginTop: 10,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sidebarNav: {
    paddingHorizontal: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 5,
  },
  drawerItemText: {
    color: '#f0f0f0',
    fontSize: 16,
    marginLeft: 15,
  },
  icon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  drawerItemActive: {
    backgroundColor: '#D90429',
  },
  drawerItemTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});