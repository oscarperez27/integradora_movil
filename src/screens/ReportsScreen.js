// src/screens/ReportsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';

const reportTypes = [
  { id: 'gym_usage', title: 'Uso del Gimnasio', description: 'Afluencia, horas pico, uso de zonas.' },
  { id: 'supp_consumption', title: 'Consumo de Suplementos', description: 'Ventas, tendencias, productos populares.' },
  { id: 'env_performance', title: 'Rendimiento Ambiental', description: 'Cumplimiento de rangos T°/Humedad.' },
  { id: 'access_activity', title: 'Actividad de Accesos', description: 'Registros detallados, permitidos/denegados.' },
  { id: 'general_report', title: 'Reporte General', description: 'Resumen consolidado de operaciones.' },
];

const ReportsScreen = ({ navigation }) => {
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [gymZone, setGymZone] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productName, setProductName] = useState('');

  const handleSelectReportType = (typeId) => {
    setSelectedReportType(typeId);
    setGymZone('');
    setTimeRange('');
    setProductCategory('');
    setProductName('');
  };

  const handleGenerateReport = () => {
    alert(`Generando reporte de ${selectedReportType || 'General'} desde ${startDate} hasta ${endDate}`);
  };

  const handleDownloadPdf = () => {
    alert(`Descargando PDF de ${selectedReportType || 'General'}`);
  };

  const handleDownloadCsv = () => {
    alert(`Descargando CSV de ${selectedReportType || 'General'}`);
  };

  const renderSpecificFilters = () => {
    switch (selectedReportType) {
      case 'gym_usage':
        return (
          <View style={[styles.configRow, { flexDirection: 'column' }]}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Zona del Gimnasio:</Text>
              <Picker
                selectedValue={gymZone}
                onValueChange={setGymZone}
                style={styles.picker}
              >
                <Picker.Item label="Todas" value="" />
                <Picker.Item label="Zona Cardio" value="cardio" />
                <Picker.Item label="Pesas Libres" value="pesas_libres" />
                <Picker.Item label="Salón de Clases" value="salon_clases" />
              </Picker>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Franja Horaria:</Text>
              <Picker
                selectedValue={timeRange}
                onValueChange={setTimeRange}
                style={styles.picker}
              >
                <Picker.Item label="Todo el día" value="" />
                <Picker.Item label="Mañana (06-12)" value="morning" />
                <Picker.Item label="Tarde (12-18)" value="afternoon" />
                <Picker.Item label="Noche (18-22)" value="evening" />
              </Picker>
            </View>
          </View>
        );
      case 'supp_consumption':
        return (
          <View style={[styles.configRow, { flexDirection: 'column' }]}>
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
      default:
        return (
          <Text style={styles.noFiltersText}>
            No hay filtros adicionales para este tipo de reporte, además de las fechas.
          </Text>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Reportes" navigation={navigation} />
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.reportsArea}>
          <Text style={styles.pageTitle}>Informes y Análisis de Operaciones</Text>

          {/* Paso 1: Selección de tipo de reporte */}
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
                      type.id === 'gym_usage' ? 'dumbbell' :
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

          {/* Paso 2: Configurar parámetros */}
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>2. Configure los Parámetros del Reporte</Text>
            <View style={styles.reportConfigurationPanel}>
              <View style={styles.configRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Fecha de Inicio:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="AAAA-MM-DD"
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Fecha de Fin:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="AAAA-MM-DD"
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </View>
              </View>

              <View style={styles.specificFiltersPlaceholder}>
                {renderSpecificFilters()}
              </View>

              {/* Acciones */}
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.btnGenerate} onPress={handleGenerateReport}>
                  <MaterialCommunityIcons name="play-circle-outline" size={20} color="#FFFFFF" style={styles.btnIcon} />
                  <Text style={styles.btnText}>Generar Reporte</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDownloadPdf} onPress={handleDownloadPdf}>
                  <MaterialCommunityIcons name="file-pdf-box" size={20} color="#FFFFFF" style={styles.btnIcon} />
                  <Text style={styles.btnText}>Descargar PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDownloadCsv} onPress={handleDownloadCsv}>
                  <MaterialCommunityIcons name="file-excel-box" size={20} color="#FFFFFF" style={styles.btnIcon} />
                  <Text style={styles.btnText}>Descargar CSV</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  section: { marginBottom: 30 },
  sectionSubtitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#4A4A4A',
    borderBottomWidth: 2,
    borderBottomColor: '#D90429',
    paddingBottom: 8,
    marginBottom: 20,
  },
  reportSelectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  reportTypeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    width: '46%',
    marginHorizontal: '2%',
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#DCDCDC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  reportTypeCardSelected: {
    borderLeftColor: '#D90429',
    transform: [{ translateY: -3 }],
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  reportTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 10,
  },
  reportTypeDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
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
    width: '100%', // ✅ ahora cada campo ocupa todo el ancho disponible
    marginBottom: 15,
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
    paddingVertical: 10,
    paddingHorizontal: 12,
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
  btnGenerate: {
    backgroundColor: '#D90429',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
