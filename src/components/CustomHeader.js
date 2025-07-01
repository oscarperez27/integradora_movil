// src/components/CustomHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'; // Asegúrate de importar Alert
import { MaterialIcons } from '@expo/vector-icons';
// ELIMINA ESTA LÍNEA: import { useAuth } from '../context/AuthContext';

const CustomHeader = ({
  title,
  navigation,
  showBackButton = false,
  showMenuButton = true,
  showUserInfo = true, // Mantendremos esta prop, pero el contenido se simulará
  rightContent,
  headerStyle,
  titleStyle
}) => {
  // ELIMINA ESTAS LÍNEAS RELACIONADAS CON useAuth:
  // const { user, logout } = useAuth(); // Obtener información del usuario desde el contexto

  const handleBack = () => {
    navigation.goBack();
  };

  // REEMPLAZA handleLogout CON UNA FUNCIÓN SIMULADA O ELIMÍNALA TEMPORALMENTE
  // Si showUserInfo es true, necesitarás un handleLogout para el botón
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          onPress: () => navigation.replace('Login') // Por ahora, solo regresa al login
        }
      ]
    );
  };

  // Simula un usuario por ahora para que el UI se vea:
  const user = { name: 'Usuario Admin' }; // Simulación de usuario

  return (
    <View style={[styles.header, headerStyle]}>
      {/* Botón izquierdo (menú o retroceso) */}
      <View style={styles.leftContainer}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        ) : showMenuButton ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.openDrawer()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="menu" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Título central */}
      <View style={styles.titleContainer}>
        <Text style={[styles.headerTitle, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Contenido derecho (info usuario o contenido personalizado) */}
      <View style={styles.rightContainer}>
        {rightContent ? (
          rightContent
        ) : showUserInfo ? (
          <TouchableOpacity
            style={styles.userContainer}
            onPress={handleLogout} // Usa la función simulada
            activeOpacity={0.7}
          >
            <View style={styles.userInitialsCircle}>
              <Text style={styles.userInitials}>
                {/* Simula las iniciales del usuario */}
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInitialsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D90429',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitials: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // ELIMINA O COMENTA ESTE ESTILO, YA NO ES NECESARIO CON LA SIMULACIÓN:
  // userName: {
  //   marginRight: 8,
  //   fontSize: 14,
  //   color: '#4A4A4A',
  //   maxWidth: 120,
  // },
});

export default CustomHeader;