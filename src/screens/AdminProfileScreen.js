// src/screens/AdminProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AdminProfileScreen = ({ navigation }) => {
  const [adminName, setAdminName] = useState('Usuario Admin');
  const [adminEmail, setAdminEmail] = useState('admin@primegym.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState('');

  const handleSaveProfile = () => {
    if (adminPassword !== adminPasswordConfirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    Alert.alert('Guardar Perfil', 'Perfil actualizado correctamente');
  };

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
          <MaterialCommunityIcons name="content-save" size={20} color="white" />
          <Text style={styles.saveButtonText}>Guardar Perfil</Text>
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