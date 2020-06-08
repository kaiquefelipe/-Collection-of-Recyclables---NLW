import React, { useState, useEffect } from 'react'
import { View, Image, Text, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import styles from './styles'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import api from '../../services/api'
import { AppLoading } from 'expo';
import * as MailComposer from 'expo-mail-composer';


interface Param {
	id: number
}

interface Data {
	point:{
		name: string,
		image: string,
		image_url: string,
		email: string,
		whatsapp: string,
		city: string,
		uf: string,
	},
	items: {
		title: string
	}[]
}

const Detail = () => {
	const[data, setData] = useState<Data>({} as Data);

	const navigation = useNavigation();
	const route = useRoute();

	const routeParams = route.params as Param;

	useEffect(() => {
		api.post(`points/${routeParams.id}`)
		.then(response => {
			setData(response.data)
		})
	}, [routeParams.id]);

	function handlerNavigateBack(){
		navigation.goBack();
	}

	function handlerComposeMail(){
		MailComposer.composeAsync({
			subject: 'Interesse na coleta de resíduos',
			recipients: [data.point.email]
		});
	}

	function handlerWhatsApp(){
		Linking.openURL(`Whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse na coleta de resíduos.`)
	}

	if(!data.point) return <AppLoading />;

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<TouchableOpacity onPress={handlerNavigateBack}>
					<Icon name="arrow-left" size={20} color="#34cb79"/>
				</TouchableOpacity>
				
				<Image style={styles.pointImage} source={{ uri: data.point.image_url }}/>

				<Text style={styles.pointName}>{data.point.name}</Text>
				<Text style={styles.pointItems}>
					{
						data.items.map(item => item.title).join(', ')
					}
				</Text>

				<View style={styles.address}>
					<Text style={styles.addressTitle}>Endereço</Text>
					<Text style={styles.addressContent}>{data.point.city + ', ' + data.point.uf}</Text>
				</View>
			</View>
			<View style={styles.footer}>
				<RectButton style={styles.button} onPress={handlerWhatsApp}>
					<FontAwesome name="whatsapp" size={20} color="#FFF"/>
                    <Text style={styles.buttonText}>WhatsApp</Text>
                </RectButton>
                <RectButton style={styles.button} onPress={handlerComposeMail}>
					<Icon name='mail' size={20} color="#FFF"/>
                    <Text style={styles.buttonText}>Email</Text>
                </RectButton>
            </View>
		</SafeAreaView>
	);
}
export default Detail;