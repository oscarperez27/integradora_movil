// src/screens/AdminProfileScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../api/apiConfig'; // Asegúrate de tener tu URL de API configurada

const AdminProfileScreen = ({ navigation }) => {
  const [adminName, setAdminName] = useState('');
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (!storedUser) {
          Alert.alert('Error', 'No se encontró la sesión del usuario');
          return;
        }
        const user = JSON.parse(storedUser);
        setUserData(user);
        setAdminName(user.username || '');
        setAdminFirstName(user.firstName || '');
        setAdminLastName(user.lastName || '');
        setAdminEmail(user.email || '');
      } catch (error) {
        console.error('Error cargando info del usuario', error);
      }
    };

    loadUserInfo();
  }, []);

  const handleSaveProfile = async () => {
    if (adminPassword && adminPassword !== adminPasswordConfirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(`${API}/api/auth/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: adminName,
          email: adminEmail,
          ...(adminPassword && {
            password: adminPassword,
            confirmPassword: adminPasswordConfirm,
          }),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        Alert.alert('Error', data.message || 'No se pudo actualizar el perfil');
        return;
      }

      // Actualizar localStorage
      const updatedUser = {
        ...userData,
        username: adminName,
        email: adminEmail,
      };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      setAdminPassword('');
      setAdminPasswordConfirm('');
    } catch (error) {
      console.error('Error al actualizar perfil', error);
      Alert.alert('Error', 'Error de red o del servidor');
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#D90429" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Editar Perfil</Text>

        <Text style={styles.label}>Nombre de Usuario</Text>
        <TextInput style={styles.input} value={adminName} onChangeText={setAdminName} />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          value={adminEmail}
          onChangeText={setAdminEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Nueva Contraseña</Text>
        <TextInput
          style={styles.input}
          value={adminPassword}
          onChangeText={setAdminPassword}
          secureTextEntry
          placeholder="Dejar en blanco para no cambiar"
          placeholderTextColor="#95a5a6"
        />

        <Text style={styles.label}>Confirmar Contraseña</Text>
        <TextInput
          style={styles.input}
          value={adminPasswordConfirm}
          onChangeText={setAdminPasswordConfirm}
          secureTextEntry
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialCommunityIcons name="content-save" size={20} color="white" />
              <Text style={styles.saveButtonText}>Guardar Perfil</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, color: '#333', marginTop: 10 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#D90429',
    marginTop: 20,
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AdminProfileScreen;
