import { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Scanner from '../components/Scanner';

const { height } = Dimensions.get('window');
const SERVER = 'http://10.98.130.113:3000';

export default function HomeScreen({ navigation }) {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [savedDetails, setSavedDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterVisible, setFilterVisible] = useState(false);

  const parseParams = (query) => {
    const params = {};
    query.split('&').forEach(part => {
      const [key, value] = part.split('=');
      params[key] = decodeURIComponent(value || '');
    });
    return params;
  };

  const cleanUrl = (pathOrUrl) => {
    if (!pathOrUrl) return '';
    if (pathOrUrl.startsWith('http')) return pathOrUrl;
    return `${SERVER}${pathOrUrl.replace(/\\/g, '/')}`;
  };

  const parseLink = (data) => {
    if (data.startsWith('emp://')) {
      const params = parseParams(data.replace('emp://', ''));
      return {
        type: 'employee',
        empid: params.empid || 'N/A',
        name: params.name || 'N/A',
        dept: params.dept || 'N/A',
        phone: params.phone || 'N/A',
        address: params.address || 'N/A',
        profilePic: params.photo ? { uri: `${SERVER}/uploads/${params.photo}` } : null,
        training: params.training ? params.training.split('-').map(t => t.trim()).filter(t => t !== '') : []
      };
    }

    if (data.startsWith('asset://')) {
      const params = parseParams(data.replace('asset://', ''));
      const rawPhoto = params.photo ? decodeURIComponent(params.photo) : null;
      const cleanedPhoto = rawPhoto ? rawPhoto.replace(/\\/g, '/') : null;

      return {
        type: 'asset',
        assetid: params.assetid || '',
        name: params.name || '',
        category: params.category || '',
        purchaseDate: params.purchaseDate || '',
        photo: cleanedPhoto,
        profilePic: cleanedPhoto ? { uri: cleanUrl(cleanedPhoto) } : null,
        documents: params.documents ? decodeURIComponent(params.documents).split(',').filter(Boolean) : []
      };
    }

    return null;
  };

  const handleScan = (rawData) => {
    const parsed = parseLink(rawData);
    if (parsed?.type) {
      setScannedData(parsed);
    } else {
      setScannedData(null);
    }
    setShowScanner(false);
  };

  const handleSave = () => {
    if (scannedData) {
      setSavedDetails([scannedData, ...savedDetails]);
      setScannedData(null);
    }
  };

  const renderDetails = (item) => {
    if (item.type === 'employee') {
      return (
        <>
          <Text style={styles.detailText}>👤 ID: {item.empid}</Text>
          <Text style={styles.detailText}>👨 Name: {item.name}</Text>
          <Text style={styles.detailText}>🏢 Dept: {item.dept}</Text>
          <Text style={styles.detailText}>📞 Phone: {item.phone}</Text>
          <Text style={styles.detailText}>🏠 Address: {item.address}</Text>
        </>
      );
    } else if (item.type === 'asset') {
      return (
        <>
          <Text style={styles.detailText}>🔧 Asset ID: {item.assetid}</Text>
          <Text style={styles.detailText}>📦 Name: {item.name}</Text>
          <Text style={styles.detailText}>📁 Category: {item.category}</Text>
          <Text style={styles.detailText}>📅 Purchase Date: {item.purchaseDate}</Text>
        </>
      );
    }
    return null;
  };

  const filteredList = savedDetails.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = item.type === 'employee'
      ? item.empid.toLowerCase().includes(query) || item.name.toLowerCase().includes(query) || item.dept.toLowerCase().includes(query)
      : item.assetid.toLowerCase().includes(query) || item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);

    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesQuery && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        {/* <Image source={require('../assets/images/logooo.png')} style={styles.logo} /> */}
        <Text style={styles.headerTitle}>EMS</Text>
        <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('AdminScreen')}>
          <Text style={styles.adminText}>Admin</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scanSection}>
        <TouchableOpacity style={styles.scanButton} onPress={() => setShowScanner(true)}>
          <Text style={styles.scanButtonText}>Scan QR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search by Employee"
          placeholderTextColor="#999"
          value={filterType === 'employee' ? searchQuery : ''}
          onChangeText={(text) => {
            setFilterType('employee');
            setSearchQuery(text);
          }}
        />
        <TextInput
          style={styles.searchBox}
          placeholder="Search by Asset"
          placeholderTextColor="#999"
          value={filterType === 'asset' ? searchQuery : ''}
          onChangeText={(text) => {
            setFilterType('asset');
            setSearchQuery(text);
          }}
        />
      </View>

      {showScanner && (
        <View style={styles.scannerContainer}>
          <Scanner onScan={handleScan} onClose={() => setShowScanner(false)} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {scannedData && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Just Scanned:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {scannedData.profilePic && <Image source={scannedData.profilePic} style={styles.profilePic} />}
              <View style={{ marginLeft: 10 }}>{renderDetails(scannedData)}</View>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}

        {savedDetails.length > 0 && (
          <View style={styles.savedTitleRow}>
            <Text style={styles.savedTitle}>Saved Scans</Text>
            <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
              <Text style={styles.filterText}>Filter ▾</Text>
            </TouchableOpacity>
          </View>
        )}

        {filteredList.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.savedCard}
            onPress={() => {
              if (item.type === 'employee') {
                navigation.navigate('EmployeeDetails', { empid: item.empid });
              } else {
                navigation.navigate('AssetsDetailsScreen', { data: item });
              }
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.profilePic && <Image source={item.profilePic} style={styles.profilePic} />}
              <View style={{ marginLeft: 10 }}>{renderDetails(item)}</View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={filterVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { setFilterType('all'); setFilterVisible(false); }}><Text style={styles.modalItem}>All</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { setFilterType('employee'); setFilterVisible(false); }}><Text style={styles.modalItem}>Employee</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { setFilterType('asset'); setFilterVisible(false); }}><Text style={styles.modalItem}>Asset</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fb' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between', backgroundColor: '#fff', elevation: 4 },
  logo: { width: 80, height: 80, resizeMode: 'contain' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  adminButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#6200ee', borderRadius: 6 },
  adminText: { color: '#fff', fontWeight: 'bold' },
  scanSection: { justifyContent: 'center', alignItems: 'center', padding: 10 },
  scanButton: { backgroundColor: '#6200ee', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, elevation: 3 },
  scanButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  scannerContainer: { height: height * 0.48, margin: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: '#6200ee' },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  detailText: { fontSize: 16, marginBottom: 4, color: '#333' },
  saveButton: { backgroundColor: '#6200ee', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10, marginTop: 14 },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16, textAlign: 'center' },
  savedTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  savedTitle: { fontSize: 18, fontWeight: '700', color: '#444' },
  filterButton: { padding: 6, borderRadius: 6, backgroundColor: '#6200ee' },
  filterText: { color: '#fff', fontWeight: '600' },
  savedCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginBottom: 12, elevation: 1 },
  profilePic: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ddd' },
  searchRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10, marginTop: 10 },
  searchBox: { flex: 1, marginHorizontal: 5, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#fff', color: '#000' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 20, width: 200 },
  modalItem: { paddingVertical: 10, fontSize: 16, color: '#000' }
});