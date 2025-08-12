import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { API } from '../api/apiConfig';
import CustomButton from '../components/CustomButton';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSendReset = async () => {
    try {
      const response = await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el correo');
      }

      Alert.alert('Éxito', 'Revisa tu correo para restablecer la contraseña.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Error al enviar la solicitud.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.box}>
          <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitle}>
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </Text>

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="usuario@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomButton title="Enviar correo de recuperación" onPress={handleSendReset} />

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
            <Text style={styles.backText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footer}>© 2025 DAT Solutions - Prime Gym</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  box: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#1A1A1A' },
  subtitle: { fontSize: 14, marginBottom: 25, color: '#4A4A4A' },
  label: { fontWeight: 'bold', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  backLink: { marginTop: 15 },
  backText: { color: '#D90429', textAlign: 'center', textDecorationLine: 'underline' },
  footer: { marginTop: 25, fontSize: 12, color: '#7f8c8d', textAlign: 'center' },
});

export default ForgotPasswordScreen;
