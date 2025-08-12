import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import { API } from '../api/apiConfig';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const reportTypes = [
  { id: 'supp_consumption', title: 'Consumo de Suplementos', description: 'Ventas, tendencias, productos populares.' },
  { id: 'env_performance', title: 'Rendimiento Ambiental', description: 'Cumplimiento de rangos T°/Humedad.' },
  { id: 'access_activity', title: 'Actividad de Accesos', description: 'Registros detallados, permitidos/denegados.' },
];

const ReportsScreen = ({ navigation }) => {
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const onChangeStartDate = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleSelectReportType = (typeId) => {
    setSelectedReportType(typeId);
    setProductCategory('');
    setProductName('');
  };

 const handleDownloadReport = async (format = 'pdf') => {
  if (!startDate || !endDate) {
    Alert.alert('Advertencia', 'Selecciona una fecha de inicio y fin');
    return;
  }

  let endpoint = '';
  if (selectedReportType === 'env_performance') {
    endpoint = `${API}/api/report/reports/ambient`;
  } else if (selectedReportType === 'supp_consumption') {
    endpoint = `${API}/api/report/reports/sales`;
  } else if (selectedReportType === 'access_activity') {
    endpoint = `${API}/api/report/reports/access`;
  } else {
    Alert.alert('Advertencia', 'Este tipo de reporte no está disponible para descarga.');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${endpoint}?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al descargar el reporte');
    }

    const blob = await res.blob();
    const base64 = await blobToBase64(blob);

    const fileUri = FileSystem.documentDirectory + `reporte_${Date.now()}.pdf`;
    await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });

    await Sharing.shareAsync(fileUri);
    Alert.alert('Éxito', `Reporte ${format.toUpperCase()} generado y abierto correctamente.`);
  } catch (err) {
    Alert.alert('Error', err.message || 'Hubo un error al generar el reporte.');
  }
};

const blobToBase64 = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.readAsDataURL(blob);
});

  const renderSpecificFilters = () => {
    if (selectedReportType === 'supp_consumption') {
      return (
        <View style={styles.configRow}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Categoría de Producto:</Text>
            <Picker
              selectedValue={productCategory}
              onValueChange={setProductCategory}
              style={styles.picker}
            >
              <Picker.Item label="Todas" value="" />
              <Picker.Item label="Proteínas" value="proteinas" />
              <Picker.Item label="Creatinas" value="creatinas" />
              <Picker.Item label="Otros" value="otros" />
            </Picker>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre Producto (opcional):</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Proteína Whey"
              value={productName}
              onChangeText={setProductName}
            />
          </View>
        </View>
      );
    }

    return (
      <Text style={styles.noFiltersText}>
        No hay filtros adicionales para este tipo de reporte, además de las fechas.
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Reportes" navigation={navigation} />
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.reportsArea}>
          <Text style={styles.pageTitle}>Informes y Análisis de Operaciones</Text>

          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>1. Seleccione un Tipo de Reporte</Text>
            <View style={styles.reportSelectionGrid}>
              {reportTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.reportTypeCard,
                    selectedReportType === type.id && styles.reportTypeCardSelected,
                  ]}
                  onPress={() => handleSelectReportType(type.id)}
                >
                  <MaterialCommunityIcons
                    name={
                      type.id === 'supp_consumption' ? 'pill' :
                      type.id === 'env_performance' ? 'air-filter' :
                      type.id === 'access_activity' ? 'account-group' :
                      'file-document-outline'
                    }
                    size={40}
                    color="#D90429"
                  />
                  <Text style={styles.reportTypeTitle}>{type.title}</Text>
                  <Text style={styles.reportTypeDescription}>{type.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>2. Configure los Parámetros del Reporte</Text>
            <View style={styles.reportConfigurationPanel}>
              <View style={styles.configRow}>
  <View style={styles.formGroup}>
    <Text style={styles.label}>Fecha de Inicio:</Text>
    <TouchableOpacity
      style={styles.input}
      onPress={() => setShowStartPicker(true)}
    >
      <Text>{startDate || 'Seleccionar fecha'}</Text>
    </TouchableOpacity>
    {showStartPicker && (
      <DateTimePicker
        value={startDate ? new Date(startDate) : new Date()}
        mode="date"
        display="default"
        onChange={onChangeStartDate}
      />
    )}
  </View>

  <View style={styles.formGroup}>
    <Text style={styles.label}>Fecha de Fin:</Text>
    <TouchableOpacity
      style={styles.input}
      onPress={() => setShowEndPicker(true)}
    >
      <Text>{endDate || 'Seleccionar fecha'}</Text>
    </TouchableOpacity>
    {showEndPicker && (
      <DateTimePicker
        value={endDate ? new Date(endDate) : new Date()}
        mode="date"
        display="default"
        onChange={onChangeEndDate}
      />
    )}
  </View>
</View>

              <View style={styles.specificFiltersPlaceholder}>
                {renderSpecificFilters()}
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.btnDownloadPdf} onPress={() => handleDownloadReport('pdf')}>
                  <MaterialCommunityIcons name="file-pdf-box" size={20} color="#FFFFFF" style={styles.btnIcon} />
                  <Text style={styles.btnText}>Descargar PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  scrollViewContent: { flex: 1 },
  reportsArea: { padding: 20 },
  pageTitle: {
  fontSize: 20, // antes 28
  fontWeight: 'bold',
  color: '#1A1A1A',
  marginBottom: 10, // antes 15
},
  section: {
  marginBottom: 15, // antes 30
},
  sectionSubtitle: {
  fontSize: 16, // antes 22
  fontWeight: '500',
  color: '#4A4A4A',
  borderBottomWidth: 1, // más delgado
  borderBottomColor: '#D90429',
  paddingBottom: 4, // antes 8
  marginBottom: 12, // antes 20
},
  reportSelectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  reportTypeCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 6,
  padding: 12,
  width: '44%', // menos ancho
  marginHorizontal: '3%',
  marginBottom: 16,
  alignItems: 'center',
  borderLeftWidth: 4,
  borderLeftColor: '#DCDCDC',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 1,
},
  reportTypeCardSelected: {
    borderLeftColor: '#D90429',
    transform: [{ translateY: -3 }],
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  reportTypeTitle: {
  fontSize: 13, // antes 15
  fontWeight: '600',
  color: '#1A1A1A',
  textAlign: 'center',
  marginTop: 4, // antes 8
},
  reportTypeDescription: {
  fontSize: 11, // antes 12
  color: '#7f8c8d',
  textAlign: 'center',
  marginTop: 2, // antes 4
},
  reportConfigurationPanel: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  configRow: {
    flexDirection: 'column',
    marginBottom: 10,
    gap: 10,
  },
  formGroup: {
  width: '100%',
  marginBottom: 10, // antes 15
},
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#4A4A4A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#4A4A4A',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    color: '#4A4A4A',
  },
  noFiltersText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 14,
    paddingVertical: 10,
  },
  specificFiltersPlaceholder: { marginTop: 10 },
  actionsRow: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  btnDownloadPdf: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnDownloadCsv: {
    backgroundColor: '#2e7d32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnIcon: {
    marginRight: 8,
  },
});

export default ReportsScreen;
