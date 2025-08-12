// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { API } from '../api/apiConfig';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API}/api/auth/login-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
      }

      const { accessToken, user } = data;

      console.log('Token recibido:', accessToken);
      console.log('Usuario:', user);

      // Guardar token en AsyncStorage
      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      navigation.replace('App Principal', { user });

    } catch (error) {
      alert(error.message || 'Error de red o servidor no disponible.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.loginContainer}>
          <Image
            source={require('../../assets/Prime_Gym.jpg')}
            style={styles.logo}
          />
          <Text style={styles.title}>Bienvenido a Prime Gym</Text>
          <Text style={styles.subtitle}>Accede a la plataforma de administración</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Usuario o Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Ingresa tu usuario o email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="Ingresa tu contraseña"
              secureTextEntry
            />
          </View>

          <CustomButton title="Iniciar Sesión" onPress={handleLogin} />

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordLink}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>&copy; 2025 DAT Solutions - Prime Gym</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loginContainer: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 25,
  },
  title: {
    color: '#1A1A1A',
    fontSize: 26,
    marginBottom: 10,
    fontWeight: '600',
  },
  subtitle: {
    color: '#4A4A4A',
    fontSize: 15,
    marginBottom: 35,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 22,
    width: '100%',
    alignItems: 'flex-start',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1A1A1A',
    fontSize: 14,
  },
  input: {
    width: '100%',
    padding: 14,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    fontSize: 16,
    color: '#4A4A4A',
  },
  forgotPasswordButton: {
    marginTop: 20,
  },
  forgotPasswordLink: {
    color: '#D90429',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  footerText: {
    marginTop: 30,
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default LoginScreen;
