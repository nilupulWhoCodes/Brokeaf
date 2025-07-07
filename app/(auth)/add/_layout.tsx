import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddGrocery from './addGrocery';

const AddGroceryLayout = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="add"
        component={AddGrocery}
        options={{
          title: 'Welcome',
          headerShown: false,
          statusBarHidden: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AddGroceryLayout;
