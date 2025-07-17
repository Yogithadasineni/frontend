import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';

const SERVER = 'http://10.98.130.113:3000';
// const SERVER = 'https://backend-code-new.onrender.com'

export default function AssetDetailsScreen({ route }) {
  const { data, link } = route.params;
  const [asset, setAsset] = useState(data || null);
  const [loading, setLoading] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);

  useEffect(() => {
    if (!data && link) {
      const urlParams = new URLSearchParams(link.replace('asset://', ''));
      const assetid = urlParams.get('assetid');
      const name = urlParams.get('name');
      const category = urlParams.get('category');
      const purchaseDate = urlParams.get('purchaseDate');
      const photo = urlParams.get('photo');
      const documentsRaw = urlParams.get('documents');
      const documents = documentsRaw
        ? decodeURIComponent(documentsRaw).split(',').map(doc => doc.trim())
        : [];

      const parsedData = {
        assetid,
        name,
        category,
        purchaseDate,
        photo,
        documents,
        type: 'asset'
      };

      setAsset(parsedData);
    }
  }, [link]);

  const cleanUrl = (pathOrUrl) => {
    if (!pathOrUrl) return '';
    if (pathOrUrl.startsWith('http')) return pathOrUrl;
    return `${SERVER}${pathOrUrl.replace(/\\/g, '/')}`;
  };

  const handleOpenDoc = async (docPath) => {
    try {
      const fileUrl = cleanUrl(docPath);
      const fileName = decodeURIComponent(docPath.split('/').pop());
      const fileUri = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Download file using react-native-fs
      const downloadResult = await RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: fileUri,
      }).promise;

      if (downloadResult.statusCode === 200) {
        setPdfUri('file://' + fileUri);
        setPdfVisible(true);
      } else {
        throw new Error('Failed to download file');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to open document');
    }
  };

  if (loading || !asset) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const documentList = asset.documents || [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topContainer}>
        {asset.photo ? (
          <Image source={{ uri: cleanUrl(asset.photo) }} style={styles.bigPic} />
        ) : (
          <View style={[styles.bigPic, { backgroundColor: '#ccc' }]} />
        )}
        <View style={styles.detailsContainer}>
          <Text style={styles.text}>Asset ID: {asset.assetid}</Text>
          <Text style={styles.text}>Name: {asset.name}</Text>
          <Text style={styles.text}>Category: {asset.category}</Text>
          <Text style={styles.text}>Purchase Date: {asset.purchaseDate}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Asset Documents</Text>
      {Array.isArray(documentList) && documentList.length > 0 ? (
        <View style={styles.docGrid}>
          {documentList.map((doc, index) => (
            <TouchableOpacity
              key={index}
              style={styles.docBoxGrid}
              onPress={() => handleOpenDoc(doc)}
            >
              <Text style={styles.docTextGrid}>
                {decodeURIComponent(doc.split('/').pop())}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.noDocs}>No documents available</Text>
      )}

      <Modal visible={pdfVisible} animationType="slide">
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setPdfVisible(false)}>
            <Text style={styles.closeText}>✖ Close</Text>
          </TouchableOpacity>
        </View>
        {pdfUri ? (
          <Pdf
            source={{ uri: pdfUri }}
            style={styles.pdfViewer}
            onError={(error) => {
              console.log('PDF error:', error);
              Alert.alert('Error loading PDF');
            }}
          />
        ) : (
          <ActivityIndicator size="large" color="#6200ee" />
        )}
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  // bigPic: { width: 120, height: 120, borderRadius: 10, marginRight: 16 },
  bigPic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
    backgroundColor: '#ccc'
  },
  detailsContainer: { flex: 1 },
  text: { fontSize: 16, marginBottom: 6, color: '#222' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a73e8', marginBottom: 10 },
  docGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  docBoxGrid: {
    width: '45%',
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    padding: 10,
    margin: 5,
    alignItems: 'center'
  },
  docTextGrid: { fontSize: 14, color: '#333', textAlign: 'center' },
  noDocs: { fontSize: 16, color: '#999', marginBottom: 10 },
  modalHeader: {
    // backgroundColor: '#6200ee',
    padding: 4,
    alignItems: 'flex-end',
  },
  closeText: {
    color: '#ed2d1f',
    fontSize: 17,
    fontWeight: 'bold'
  },
  pdfViewer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff'
  }
});
