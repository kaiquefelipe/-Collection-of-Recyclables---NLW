import React from 'react';
import { AppLoading } from 'expo'
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Routes from './src/Routes'
import { useFonts, Ubuntu_400Regular, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';

export default function App() {
	const [fontsloaded] = useFonts({
		Ubuntu_400Regular,
		Ubuntu_700Bold,
		Roboto_400Regular,
		Roboto_500Medium
	})

	if (!fontsloaded)
		return <AppLoading />

  	return (
		<>
			<StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      		<Routes />
		</>
  	);
};