import React, {useContext, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { UserContext } from '../context/UserContext ';
import {IP} from '../IP';

export default function Login({ navigation,route }) {
    const [phoneNumber, setPhoneNumber] = useState('0348968518');
    const [password, setPassword] = useState('123456');
    const { updateUser } = useContext(UserContext);
    const handleSubmit = async () => {
        try {
          const response = await axios.post(IP+'/api/auth/login', {
            phonenumber: phoneNumber,
            password: password
          });
          updateUser(response.data);
          console.log('Phản hồi từ server:', response.data);
          navigation.push('HomeTabs', { Screen: 'Home',params: { phonenumber: phoneNumber } });
        } catch (error) {
            alert('Số điện thoại hoặc mật khẩu không chính xác');
        }
      };
     
    return (
        <View style={{backgroundColor:"white", flex:1 }}>
            <View style={{width:"100%",backgroundColor:"#227ffd",flexDirection:"row",padding:10,alignItems:"center",marginTop:25}}>
                <TouchableOpacity
                onPress={()=>{
                    navigation.push("LoginHome")
                }}
                >
                    <Image source={require("../images/back.png")} style={{height:25,width:25}}/>
                </TouchableOpacity>
                <Text style={{color:"white",margin:10,fontSize:15,fontWeight:400}}>ĐĂNG NHẬP</Text>
            </View>
            <View style={{padding:15,backgroundColor:"#f3f4f6"}}>
                <Text>Vui lòng nhập số điện thoại và mật khẩu để đăng nhập.</Text>
            </View>
            <View style={{marginTop:20,padding:15,gap:30}}>
                <TextInput style={{borderBottomWidth:2,borderBottomColor:"lightgrey",fontSize:20,padding:5}}
                    placeholder='Số điện thoại' placeholderTextColor={"lightgray"}
                    value={phoneNumber}
                    onChangeText={text => setPhoneNumber(text)}
                />
                <TextInput style={{borderBottomWidth:2,borderBottomColor:"lightgrey",fontSize:20,padding:5}}
                    placeholder='Mật khẩu' placeholderTextColor={"lightgray"}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
            </View>
            <View style={{padding:15,backgroundColor:"#f3f4f6"}}>
                <Text>Quên mật khẩu ?.</Text>
                <TouchableOpacity
                onPress={()=>{
                    navigation.navigate("Password_reset")
                }}
                >
                    <Text style={{color:"#227ffd"}}>Nhấn vào đây</Text>
                </TouchableOpacity>
            </View>
        <TouchableOpacity style={{position:"absolute",right:30,bottom:30,backgroundColor:"#227ffd",width:50,height:50,borderRadius:50,alignItems:"center",justifyContent:"center"}}
        onPress={handleSubmit}
        >
        <Image source={require("../images/next.png")} style={{height:20,width:20}}/>
        </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    Textbox :{
        borderWidth:2,
        borderColor:"#514eb5",
        borderRadius:15,
        padding:10,
        width:"80%",
        fontSize:17,
        backgroundColor:"#eaeaf5"
    }
  });