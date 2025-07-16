import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AssetDetailsScreen from './components/AssetsDetailsScreen';
import AssetsFrom from './components/AssetsForm';
import DocumentViewerScreen from './components/DocumentViewerScreen';
import EmployeeDetailsScreen from './components/EmloyeeDetailsScreen';
import EmployeeFrom from './components/EmployeeForm';
import AssetListScreen from './screens/AssetListScreen';
import EmployeeListScreen from './screens/EmployeeListScreen';
import HomeScreen from './screens/HomeScreen';

import AdminScreen from './components/AdminScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">

        {/* Main Home */}
        {/* <Stack.Screen name="Home" component={HomeScreen} options={{ title: ' ' }} /> */}


  {/* Instead of HomeScreen being a normal screen, it's a nested stack */}
  <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />


  <Stack.Screen name="AdminScreen" component={AdminScreen}  options={{ headerShown: false}}/>




        {/* Forms */}
        {/* <Stack.Screen name="EmployeeFrom" component={EmployeeFrom} options={{ title: 'Employee Form' }} />
        <Stack.Screen name="AssetsFrom" component={AssetsFrom} options={{ title: 'Assets Form' }} /> */}

        <Stack.Screen name="EmployeeForm" component={EmployeeFrom} options={{ title: 'Employee Form' }} />
        <Stack.Screen name="AssetForm" component={AssetsFrom} options={{ title: 'Asset Form' }} />


        {/* Details Screens */}
        <Stack.Screen name="EmployeeDetails" component={EmployeeDetailsScreen} options={{ title: 'Employee Details' }} />
        {/* <Stack.Screen name="AssetDetails" component={AssetsDetailsScreen} options={{ title: 'Asset Details' }} /> */}
        <Stack.Screen name="AssetsDetailsScreen" component={AssetDetailsScreen} />

        {/* Lists (optional) */}
        <Stack.Screen name="Employees" component={EmployeeListScreen} options={{ title: 'Employees List' }} />
        <Stack.Screen name="Assets" component={AssetListScreen} options={{ title: 'Assets List' }} />


        <Stack.Screen name="DocumentViewerScreen" component={DocumentViewerScreen} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
