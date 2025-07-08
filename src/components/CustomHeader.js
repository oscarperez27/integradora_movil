// src/components/CustomHeader.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CustomHeader = ({
  title,
  navigation,
  showBackButton = false,
  showMenuButton = true,
  showUserInfo = true,
  rightContent,
  headerStyle,
  titleStyle
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const user = { name: 'Usuario Admin' };

  const handleBack = () => {
    navigation.goBack();
  };

  
  const handleUserMenu = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', onPress: () => navigation.replace('Login'), style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  const handleGoToProfile = () => {
    setMenuVisible(false);
    navigation.navigate('Perfil');
  };

  return (
    <View style={[styles.header, headerStyle]}>
      <View style={styles.leftContainer}>
        {showBackButton ? (
          <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        ) : showMenuButton ? (
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.openDrawer()}>
            <MaterialIcons name="menu" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.titleContainer}>
        <Text style={[styles.headerTitle, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        {rightContent ? (
          rightContent
        ) : showUserInfo ? (
          <>
            <TouchableOpacity style={styles.userContainer} onPress={() => setMenuVisible(true)}>
              <View style={styles.userInitialsCircle}>
                <Text style={styles.userInitials}>
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>

            <Modal transparent={true} visible={menuVisible} animationType="fade">
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={() => setMenuVisible(false)}
              >
                <View style={styles.menu}>
                  <TouchableOpacity style={styles.menuItem} onPress={handleGoToProfile}>
                    <Text style={styles.menuText}>Perfil de administrador</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem} onPress={handleUserMenu}>
                    <Text style={styles.menuText}>Cerrar sesión</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          </>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    width: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
});

export default CustomHeader;
