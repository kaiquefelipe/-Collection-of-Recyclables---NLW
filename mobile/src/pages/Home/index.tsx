import React, { useEffect, useState } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { View, Image, Text, ImageBackground, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import RNPickerSelect from 'react-native-picker-select';
import { AppLoading } from 'expo';

interface IBGEUfResponse {
    sigla: string
}

interface Data {
    label: string,
    value: string
}

interface IBGECitiesResponse {
    nome: string
}

const Home = () =>{
    const [ufs, setUfs] = useState<Data[]>([]);
    const [city, setCities] = useState<Data[]>([]);
    const [selectedUf, setSelectedUf] = useState("0");
    const [selectedCity, setSelectedCity] = useState("0");


    const navigation = useNavigation();

    function handlerNavigateToPoints(){
        navigation.navigate('Points', {
            uf: selectedUf,
            city: selectedCity
        });
    }

    function handlerSelectedUf(value: string){
        setSelectedUf(value);
    }

    function handlerSelectedCity(value: string){
        setSelectedCity(value);
    }

    useEffect(() => {
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        .then(response => {
            const ufInitials = response.data.map(uf => {return {label: uf.sigla, value: uf.sigla}})
            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        if(selectedUf === "0") return;

        axios.get<IBGECitiesResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
        .then(response => {
            const cities = response.data.map(item => {return {label: item.nome, value: item.nome}})
            setCities(cities);
        });
    }, [selectedUf]);

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground 
                source={require('../../assets/home-background.png')}
                style={styles.container} 
                imageStyle={{ width: 274,  height: 368}}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudando pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>
                
                <View style={styles.footer}>
                    {
                        ufs[0] &&
                        <RNPickerSelect
                            onValueChange={handlerSelectedUf}
                            items={ufs}
                            value={selectedUf}
                            placeholder={{
                                label: 'Selecione o estado...',
                                value: null,
                            }}
                            InputAccessoryView={() => null}
                            useNativeAndroidPickerStyle={false}
                            style={pickerSelectStyles}
                            Icon={() => {
                                return <Icon name="chevron-down" size={24} color="gray" />;
                            }}
                        />
                    }

                    <RNPickerSelect
                        onValueChange={handlerSelectedCity}
                        items={city}
                        value={selectedCity}
                        placeholder={{
                            label: 'Selecione o Município...',
                            value: null,
                        }}
                        InputAccessoryView={() => null}
                        useNativeAndroidPickerStyle={false}
                        style={pickerSelectStyles}
                        Icon={() => {
                            return <Icon name="chevron-down" size={24} color="gray" />;
                        }}
                    />

                    <RectButton style={styles.button} onPress={handlerNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24}/>
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
    inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
        paddingRight: 30,
    },
    iconContainer: {
      top: 20,
      right: 15,
    },
  });

export default Home;