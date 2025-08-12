import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { 
  MaterialCommunityIcons, 
  FontAwesome5, 
  Ionicons,
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
import OrderScreen from './src/screens/OrderScreen';
import EmployeScreen from './src/screens/EmployeScreen';
import ViewPDFScreen from './src/screens/ViewPDFScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const linking = {
  prefixes: ['primegym://'],
  config: {
    screens: {
      ResetPassword: 'reset-password',
    },
  },
};

// Contenido personalizado del drawer
const CustomDrawerContent = (props) => {
  const { navigation, userRole } = props;
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

          {/* Gestión de Clientes */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('AccessControlTab')}
          >
            <MaterialCommunityIcons name="account-group" size={24} color="#f0f0f0" style={styles.icon} />
            <Text style={styles.drawerItemText}>Gestión de Clientes</Text>
          </TouchableOpacity>

          {/* Inventario */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('InventoryTab')}
          >
            <FontAwesome5 name="warehouse" size={22} color="#f0f0f0" style={styles.icon} />
            <Text style={styles.drawerItemText}>Inventario</Text>
          </TouchableOpacity>

          {/* Órdenes */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('OrderTab')}
          >
            <FontAwesome5 name="boxes" size={22} color="#f0f0f0" style={styles.icon} />
            <Text style={styles.drawerItemText}>Órdenes</Text>
          </TouchableOpacity>

          {/* Gestión de Empleados — solo admins */}
          {userRole === 'admin' && (
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigation.navigate('EmployeTab')}
            >
              <MaterialCommunityIcons name="account-tie" size={24} color="#f0f0f0" style={styles.icon} />
              <Text style={styles.drawerItemText}>Gestión de Empleados</Text>
            </TouchableOpacity>
          )}

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

const ADMIN_ROLE_IDS = ['68703a8cbe19d4a7e175ea1a'];

const DrawerNavigatorWrapper = ({ route }) => {
  const user = route?.params?.user;
  const userRoles = user?.roles || [];

  // Si alguno de los roles es admin
  const isAdmin = userRoles.some(roleId => ADMIN_ROLE_IDS.includes(roleId));

  const userRole = isAdmin ? 'admin' : 'user';

  return <DrawerNavigator userRole={userRole} />;
};

// Drawer Navigator principal con control de roles
const DrawerNavigator = ({ userRole }) => {
  return (
    <Drawer.Navigator
      initialRouteName="DashboardTab"
      drawerContent={(props) => <CustomDrawerContent {...props} userRole={userRole} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#2c3e50',
          width: 200,
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
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="InventoryTab" 
        component={InventoryScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <FontAwesome5 name="warehouse" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="OrderTab" 
        component={OrderScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <FontAwesome5 name="boxes" size={size} color={color} />
          )
        }}
      />
      {/* Solo admins ven esta pantalla */}
      {userRole === 'admin' && (
        <Drawer.Screen 
          name="EmployeTab" 
          component={EmployeScreen}
          options={{
            drawerIcon: ({color, size}) => (
              <MaterialCommunityIcons name="account-tie" size={size} color={color} />
            )
          }}
        />
      )}
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

// Navegador raíz con estado simulado de rol
export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="App Principal"
          component={DrawerNavigatorWrapper}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Perfil" 
          component={AdminProfileScreen} 
        />
        <Stack.Screen 
          name="ViewPDF" 
          component={ViewPDFScreen} 
          options={{ title: 'Visualizador de Reporte' }}
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen}
        />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPasswordScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
});
