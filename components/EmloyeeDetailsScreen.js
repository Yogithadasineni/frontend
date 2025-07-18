

import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';



// const SERVER = 'https://backend-code-new.onrender.com';

    const SERVER = 'http://10.98.130.113:3000';


export default function EmployeeDetailsScreen({ route }) {
  const { empid } = route.params;
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${SERVER}/emp/employee/${empid}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch employee data');
        return res.json();
      })
      .then(data => {
        setEmployee(data);
      })
      .catch(err => alert(err.message))
      .finally(() => setLoading(false));
  }, [empid]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!employee) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#f00' }}>Employee not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        {employee.photo ? (
          <Image
            source={{ uri: `${SERVER}/uploads/${employee.photo}` }}
            style={styles.bigPic}
          />
        ) : (
          <View style={[styles.bigPic, { backgroundColor: '#ccc' }]} />
        )}
        <View style={styles.detailsContainer}>
          <Text style={styles.text}>Employee ID: {employee.empid}</Text>
          <Text style={styles.text}>Name: {employee.name}</Text>
          <Text style={styles.text}>Department: {employee.dept}</Text>
          <Text style={styles.text}>Phone: {employee.phone}</Text>
          <Text style={styles.text}>Address: {employee.address}</Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
  <Text style={styles.trainingHeader}>Training Details</Text>
  <View>
    {employee.training && employee.training.length > 0 ? (
      employee.training.map((item, idx) => (
        <Text key={idx} style={styles.trainingItem}>
          {idx + 1}. {item}
        </Text>
      ))
    ) : (
      <Text style={styles.trainingItem}>None</Text>
    )}
  </View>
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  bigPic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
    backgroundColor: '#ccc'
  },
  detailsContainer: { flex: 1 },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: '#222'
  },
  bottomContainer: { flex: 1 },
  trainingHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a73e8',
    marginBottom: 10
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6
  },
  
  trainingItem: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',

    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eef',
    padding: 10,
    borderRadius: 8,
    marginTop: 6
  },
  trainingText: {
    fontSize: 16
  },
});

 