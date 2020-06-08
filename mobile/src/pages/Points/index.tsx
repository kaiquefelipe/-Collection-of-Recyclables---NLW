import React, { useState, useEffect } from 'react'
import { View, Image, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, Platform } from 'react-native';
import styles from './styles'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import api from '../../services/api'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions';

interface Item {
	id: number,
	title: string,
	image_url: string
}

interface Point {
	id: number,
	name: string,
	image: string,
	image_url: string,
	latitude: number,
	longitude: number
}

interface Param {
	uf: string,
	city: string
}

const Points = () => {
	const[items, setItems] = useState<Item[]>([]);
	const[points, setPoints] = useState<Point[]>([]);
	const[selectedItems, setSelectedItems] = useState<number[]>([]);
    const [initialPosition, setinitialPosition] = useState<[number, number]>([0, 0]);

	const navigation = useNavigation();
	const route = useRoute();

	const routeParams = route.params as Param;

	useEffect(() => {
		async function loadPosition(){
			
			const { status } = Platform.OS === 'ios' ? await Location.getPermissionsAsync() : await Permissions.askAsync(Permissions.LOCATION);;
			if(status !== "granted") {
				Alert.alert('Ooooopppssss', 'Precisamos de sua permissão para obter a localização')
				return;
			}

			const location = await Location.getCurrentPositionAsync();
			const { latitude, longitude } = location.coords;
			setinitialPosition([latitude, longitude]);
		}
		loadPosition()
	}, []);

	useEffect(() => {
		api.get('items')
		.then(response => {
			setItems(response.data)
		})
	}, []);

	useEffect(() => {
		api.get('points', {
			params: {
				city: routeParams.city,
				uf: routeParams.uf,
				items: selectedItems
			}
		})
		.then(response => {
			setPoints(response.data)
		})
	}, [selectedItems]);

	function handlerNavigateBack(){
		navigation.goBack();
	}

	function handleNavigateToDetai(id: number){
		navigation.navigate('Detail', { id })
	}

	function handlerSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id)

        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id)

            setSelectedItems(filteredItems)
        }
        else
            setSelectedItems([ ...selectedItems, id])
    }

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<TouchableOpacity onPress={handlerNavigateBack}>
					<Icon name="arrow-left" size={20} color="#34cb79"/>
				</TouchableOpacity>
				<Text style={styles.title}>Bem Vindo.</Text>
				<Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
				
				<View style={styles.mapContainer}>
					{ initialPosition[0] !== 0 && (
						<MapView style={styles.map} initialRegion={{ 
							latitude: initialPosition[0], 
							longitude: initialPosition[1],
							latitudeDelta: 0.014,
							longitudeDelta: 0.014
						}}>
							{
								points.map(item => (
									<Marker 
										style={styles.mapMarker}
										coordinate={{ 
											latitude: item.latitude, 
											longitude: item.longitude
										}}
										onPress={() => handleNavigateToDetai(item.id)}
										key={String(item.id)}
									>
										<View style={styles.mapMarkerContainer}>
											<Image 
												style={styles.mapMarkerImage}
												source={{ uri: item.image_url }}
											/>
											<Text style={styles.mapMarkerTitle}>{item.name}</Text>
										</View>
									</Marker>
								))
							}
						</MapView>)
					}
				</View>
			</View>
			<View style={styles.itemsContainer}>
				<ScrollView 
					horizontal 
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingHorizontal: 20 }}
				>
					{
						items.map(item => (
							<TouchableOpacity 
								style={[
									styles.item,
									selectedItems.includes(item.id) ? styles.selectedItem : {}
								]} 
								onPress={() => handlerSelectItem(item.id)} 
								key={String(item.id)}
								activeOpacity={0.6}
							>
								<SvgUri width={42} height={42} uri={item.image_url} />
								<Text style={styles.itemTitle}>{item.title}</Text>
							</TouchableOpacity>
						))
					}
					
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

export default Points;
