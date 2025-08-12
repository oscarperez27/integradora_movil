import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import CustomHeader from '../components/CustomHeader';
import { API } from '../api/apiConfig';

// Roles disponibles
const ROLES = [
  { _id: '68703a8cbe19d4a7e175ea1a', name: 'Admin' },
  { _id: '68703aa9be19d4a7e175ea1c', name: 'Empleado' },
];

// Mapa id->nombre para mostrar roles
const roleNamesMap = ROLES.reduce((acc, role) => {
  acc[role._id] = role.name;
  return acc;
}, {});

const ConfirmModal = ({ visible, message, onConfirm, onCancel }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.confirmModalBackground}>
      <View style={styles.confirmModalContainer}>
        <Text style={styles.confirmMessage}>{message}</Text>
        <View style={styles.confirmButtons}>
          <TouchableOpacity
            style={[styles.btnConfirm, { backgroundColor: '#d9534f' }]}
            onPress={onConfirm}
          >
            <Text style={styles.btnConfirmText}>Eliminar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnConfirm, { backgroundColor: '#6c757d' }]}
            onPress={onCancel}
          >
            <Text style={styles.btnConfirmText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const EmployeeScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  role: ROLES[0]._id, // solo un rol (string)
});

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    return token || '';
  };

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${API}/api/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });
      const data = await res.json();
      setEmployees(data.filter(e => e.status !== false));
    } catch (error) {
      Alert.alert('Error', 'Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openCreateForm = () => {
  setEditingEmployee(null);
  setFormData({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: ROLES[0]._id,
  });
  setShowForm(true);
};

  const openEditForm = (employee) => {
  setEditingEmployee(employee);
  setFormData({
    firstName: employee.firstName || '',
    lastName: employee.lastName || '',
    username: employee.username || '',
    email: employee.email || '',
    password: '',
    role: employee.roles && employee.roles.length > 0
      ? (typeof employee.roles[0] === 'string' ? employee.roles[0] : employee.roles[0]._id)
      : ROLES[0]._id,
  });
  setShowForm(true);
};

  const handleSubmit = async () => {
  if (
    !formData.firstName.trim() ||
    !formData.lastName.trim() ||
    !formData.username.trim() ||
    !formData.email.trim() ||
    (!editingEmployee && !formData.password) ||
    !formData.role // **aquí validamos role, no roles**
  ) {
    Alert.alert('Error', 'Completa todos los campos requeridos');
    return;
  }
  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    Alert.alert('Error', 'Correo no válido');
    return;
  }

  setSubmitLoading(true);

  try {
    const token = await getToken();
    const url = editingEmployee
      ? `${API}/api/auth/users/${editingEmployee._id}`
      : `${API}/api/auth/users/create`;
    const method = editingEmployee ? 'PUT' : 'POST';

    // Convertimos el id a nombre del rol para enviar
    const rolesNames = [roleNamesMap[formData.role] || formData.role];

    const body = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      roles: rolesNames,
    };

    if (!editingEmployee || (editingEmployee && formData.password.trim() !== '')) {
      body.password = formData.password;
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      Alert.alert('Error', data.message || 'Error guardando usuario');
      setSubmitLoading(false);
      return;
    }

    Alert.alert('Éxito', editingEmployee ? 'Usuario actualizado' : 'Usuario creado');
    setShowForm(false);
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      role: ROLES[0]._id,
    });
    fetchEmployees();
  } catch {
    Alert.alert('Error', 'Error guardando usuario');
  } finally {
    setSubmitLoading(false);
  }
};

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/auth/users/delete/${confirmDeleteId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Error', data.message || 'Error eliminando usuario');
        return;
      }
      Alert.alert('Éxito', 'Usuario eliminado');
      setConfirmDeleteId(null);
      fetchEmployees();
    } catch {
      Alert.alert('Error', 'Error eliminando usuario');
    }
  };

  const getRoleNamesForDisplay = (roles) => {
    if (!Array.isArray(roles)) return '';
    return roles.map(r => roleNamesMap[r] || r).join(', ');
  };

  const renderEmployee = ({ item }) => (
    <View style={styles.employeeCard}>
      <Text style={styles.employeeName}>{item.firstName} {item.lastName}</Text>
      <Text style={styles.employeeInfo}>Usuario: {item.username}</Text>
      <Text style={styles.employeeInfo}>Email: {item.email}</Text>
      <Text style={styles.employeeInfo}>Rol: {getRoleNamesForDisplay(item.roles)}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnEdit} onPress={() => openEditForm(item)}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDelete} onPress={() => setConfirmDeleteId(item._id)}>
          <Text style={styles.btnText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d9534f" />
        <Text style={styles.loadingText}>Cargando empleados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Gestión de Empleados" navigation={navigation} />

      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.btnAdd} onPress={openCreateForm}>
          <Text style={styles.btnAddText}>+ Nuevo Empleado</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={employees}
        keyExtractor={item => item._id}
        renderItem={renderEmployee}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Modal formulario */}
      <Modal visible={showForm} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={styles.modalBackground}
        >
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editingEmployee ? 'Editar Usuario' : 'Nuevo Usuario'}</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={formData.firstName}
              onChangeText={text => handleChange('firstName', text)}
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={formData.lastName}
              onChangeText={text => handleChange('lastName', text)}
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              value={formData.username}
              onChangeText={text => handleChange('username', text)}
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.input}
              placeholder="Correo"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
            {!editingEmployee && (
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={formData.password}
                onChangeText={text => handleChange('password', text)}
                placeholderTextColor="#666"
              />
            )}
            {editingEmployee && (
              <TextInput
                style={styles.input}
                placeholder="Contraseña (dejar vacío para no cambiar)"
                secureTextEntry
                value={formData.password}
                onChangeText={text => handleChange('password', text)}
                placeholderTextColor="#666"
              />
            )}

             <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>Rol:</Text>
<View style={styles.rolesContainer}>
  {ROLES.map(role => {
    const selected = formData.role === role._id;
    return (
      <TouchableOpacity
        key={role._id}
        style={[styles.roleOption, selected && styles.roleOptionSelected]}
        onPress={() => handleChange('role', role._id)}
      >
        <Text style={[styles.roleOptionText, selected && styles.roleOptionTextSelected]}>
          {role.name}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>

            {submitLoading ? (
              <ActivityIndicator size="large" color="#d9534f" />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.btnSave} onPress={handleSubmit}>
                  <Text style={styles.btnSaveText}>{editingEmployee ? 'Actualizar' : 'Guardar'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => {
                    setShowForm(false);
                    setEditingEmployee(null);
                  }}
                >
                  <Text style={styles.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal confirmar eliminación */}
      <ConfirmModal
        visible={!!confirmDeleteId}
        message="¿Seguro que deseas eliminar este empleado?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // solo botón a la derecha
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },

  btnAdd: {
    backgroundColor: '#d9534f', // rojo principal
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#d9534faa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },
  btnAddText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14, // un poco más pequeño para que no se salga
  },

  employeeCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#00000010',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  employeeName: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 6,
    color: '#343a40',
  },
  employeeInfo: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 2,
  },

  actions: {
    flexDirection: 'row',
    marginTop: 14,
    justifyContent: 'flex-end',
  },
  btnEdit: {
    backgroundColor: '#cce5ff', // azul clarito suave para editar
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    shadowColor: '#99ccff44',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  btnDelete: {
    backgroundColor: '#f8d7da', // rojo clarito para eliminar
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#f5c6cb88',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  btnText: {
    color: '#212529',
    fontWeight: '600',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#495057',
  },

  modalBackground: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff', // fondo blanco sólido para el modal
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // espacio arriba para notch/status bar
    justifyContent: 'flex-start', // contenido empieza abajo, no centrado
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 22,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: '#f8f9fa',
    color: '#212529',
    fontSize: 16,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    marginBottom: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  modalBackground: {
  flex: 1,
  backgroundColor: '#fff', // fondo blanco sólido para el modal
  paddingTop: Platform.OS === 'ios' ? 50 : 20, // espacio arriba para notch/status bar
  paddingHorizontal: 20,
  justifyContent: 'flex-start', // contenido empieza abajo, no centrado
},
picker: {
  height: 50,
  width: '100%',
  color: '#212529',
},

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },

  btnSave: {
    backgroundColor: '#d9534f', // rojo
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#d9534faa',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
    minWidth: 120,
  },
  btnSaveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },

  btnCancel: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#6c757daa',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
    minWidth: 120,
  },
  btnCancelText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },

  confirmModalBackground: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  confirmModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 22,
    width: '90%',
    maxWidth: 360,
  },
  confirmMessage: {
    fontSize: 18,
    color: '#212529',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnConfirm: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  btnConfirmText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  rolesContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
  marginBottom: 18,
},

roleOption: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#ced4da',
  backgroundColor: '#f8f9fa',
  marginRight: 10,
  marginBottom: 10,
},

roleOptionSelected: {
  backgroundColor: '#d9534f',
  borderColor: '#d9534f',
},

roleOptionText: {
  color: '#212529',
  fontWeight: '600',
},

roleOptionTextSelected: {
  color: '#fff',
},
});

export default EmployeeScreen;
