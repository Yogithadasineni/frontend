import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export default function AssetListScreen() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://10.186.170.113:3000/assets');  // Update URL if needed
      if (!res.ok) throw new Error('Failed to fetch assets');
      const data = await res.json();
      setAssets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.assetId}>ID: {item.assetid}</Text>
      <Text style={styles.name}>Name: {item.name}</Text>
      <Text style={styles.category}>Category: {item.category}</Text>
      <Text style={styles.date}>Purchased: {item.purchaseDate}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={assets}
      keyExtractor={(item) => item.assetid}
      renderItem={renderItem}
      contentContainerStyle={assets.length ? styles.listContainer : styles.center}
      ListEmptyComponent={<Text style={styles.emptyText}>No assets found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  itemContainer: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
    elevation: 2
  },
  assetId: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4
  },
  name: {
    fontSize: 15,
    marginBottom: 2
  },
  category: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2
  },
  date: {
    fontSize: 13,
    color: '#888'
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
