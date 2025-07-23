import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../api/apiConfig';
import CustomHeader from '../components/CustomHeader';
import { Picker } from '@react-native-picker/picker';

const initialFormState = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  role: '', // solo un rol
};

const EmployeScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    return token || '';
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${API}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          Alert.alert('Error', 'No autorizado. Por favor inicia sesión de nuevo.');
          setEmployees([]);
          return;
        }
        throw new Error('Error cargando empleados');
      }
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al cargar empleados');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEmployees();
  };

  const openCreateModal = () => {
    setForm(initialFormState);
    setEditId(null);
    setModalVisible(true);
  };

  const openEditModal = (employee) => {
    setForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      username: employee.username,
      email: employee.email,
      password: '',
      role: employee.roles.length > 0 ? employee.roles[0] : '',
    });
    setEditId(employee._id);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Seguro quieres eliminar este empleado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteEmployee(id),
        },
      ]
    );
  };

  const deleteEmployee = async (id) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error eliminando empleado');
      Alert.alert('Éxito', 'Empleado eliminado');
      fetchEmployees();
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo eliminar el empleado');
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      (!editId && !form.password) ||
      !form.role
    ) {
      Alert.alert('Error', 'Por favor rellena todos los campos obligatorios, incluyendo el rol');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      Alert.alert('Error', 'Correo electrónico no válido');
      return;
    }

    if (!editId && form.password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setSubmitLoading(true);

    try {
      const token = await getToken();
      const body = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        roles: [form.role],
      };
      if (!editId) {
        body.password = form.password;
      } else if (form.password.trim().length > 0) {
        body.password = form.password;
      }

      const url = editId ? `${API}/api/auth/users/${editId}` : `${API}/api/auth/users`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al guardar empleado');
      }

      Alert.alert('Éxito', `Empleado ${editId ? 'actualizado' : 'creado'}`);
      setModalVisible(false);
      setForm(initialFormState);
      setEditId(null);
      fetchEmployees();
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al guardar empleado');
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderEmployee = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
      <Text style={styles.text}>Username: {item.username}</Text>
      <Text style={styles.text}>Email: {item.email}</Text>
      <Text style={styles.text}>Roles: {item.roles.join(', ')}</Text>
      <Text style={styles.text}>
        Status: <Text style={{ color: item.status ? '#4CAF50' : '#B00020' }}>
          {item.status ? 'Activo' : 'Inactivo'}
        </Text>
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.buttonEdit} onPress={() => openEditModal(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonDelete} onPress={() => handleDelete(item._id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Gestión de Empleados" navigation={navigation} />

      <View style={{ padding: 16 }}>
        <TouchableOpacity style={styles.buttonCreate} onPress={openCreateModal}>
          <Text style={styles.buttonText}>Crear Nuevo Empleado</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#B00020" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item._id}
          renderItem={renderEmployee}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#B00020']} />
          }
          ListEmptyComponent={<Text style={styles.empty}>No hay empleados disponibles.</Text>}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        />
      )}

      {/* Modal Crear / Editar empleado */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{editId ? 'Editar Empleado' : 'Crear Nuevo Empleado'}</Text>

            <Text style={styles.label}>Nombre(s) *</Text>
            <TextInput
              style={styles.input}
              value={form.firstName}
              onChangeText={v => handleInputChange('firstName', v)}
              placeholder="Nombre(s)"
            />

            <Text style={styles.label}>Apellido(s) *</Text>
            <TextInput
              style={styles.input}
              value={form.lastName}
              onChangeText={v => handleInputChange('lastName', v)}
              placeholder="Apellido(s)"
            />

            <Text style={styles.label}>Usuario *</Text>
            <TextInput
              style={styles.input}
              value={form.username}
              onChangeText={v => handleInputChange('username', v)}
              placeholder="Usuario"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Correo electrónico *</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={v => handleInputChange('email', v)}
              placeholder="email@dominio.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>
              Contraseña {editId ? '(dejar vacío para no cambiar)' : '*'}
            </Text>
            <TextInput
              style={styles.input}
              value={form.password}
              onChangeText={v => handleInputChange('password', v)}
              placeholder="Contraseña"
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={styles.label}>Rol *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.role}
                onValueChange={(itemValue) => handleInputChange('role', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona un rol..." value="" />
                <Picker.Item label="Admin" value="Admin" />
                <Picker.Item label="Employee" value="Employee" />
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.buttonCreate, { flex: 1, marginRight: 8 }]}
                onPress={handleSubmit}
                disabled={submitLoading}
              >
                <Text style={styles.buttonText}>{submitLoading ? 'Guardando...' : 'Guardar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonDelete, { flex: 1, marginLeft: 8 }]}
                onPress={() => setModalVisible(false)}
                disabled={submitLoading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#00000020',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    color: '#B00020',
  },
  text: {
    color: '#4A4A4A',
    marginBottom: 2,
    fontSize: 14,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#B00020',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  buttonCreate: {
    backgroundColor: '#B00020',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonEdit: {
    backgroundColor: '#D32F2F',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonDelete: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 16,
    color: '#B00020',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: '#F9F9F9',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#F9F9F9',
    overflow: 'hidden',
  },
  picker: {
    height: 44,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});

export default EmployeScreen;
