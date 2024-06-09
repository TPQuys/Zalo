import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';



export default function Password_reset({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const handleSubmit = async () => {
        if (phoneNumber.length === 10 && !isNaN(phoneNumber)) {
            const convertedNumber = `+84 ${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7)}`;
            setPhoneNumber(convertedNumber);
            navigation.push("Reset_Otp",{phonenumber:convertedNumber})
          } else {
            alert('Số điện thoại không hợp lệ');
          }
      };
    return (
        <View style={{backgroundColor:"white", flex:1 }}>
            <View style={{width:"100%",backgroundColor:"#227ffd",flexDirection:"row",padding:10,alignItems:"center"}}>
                <TouchableOpacity
                onPress={()=>{
                    navigation.goBack("LoginHome")
                }}
                >
                    <Image source={require("../images/back.png")} style={{height:25,width:25}}/>
                </TouchableOpacity>
                <Text style={{color:"white",margin:10,fontSize:15,fontWeight:400}}>Lấy lại mật khẩu</Text>
            </View>
            <View style={{padding:15,backgroundColor:"#f3f4f6"}}>
                <Text>Nhập số điện thoại để lấy lại mật khẩu</Text>
            </View>
            <View style={{marginTop:20,padding:15,gap:30}}>
                <TextInput style={{borderBottomWidth:2,borderBottomColor:"lightgrey",fontSize:20,padding:5}}
                    placeholder='Số điện thoại' placeholderTextColor={"lightgray"}
                    value={phoneNumber}
                    onChangeText={text => setPhoneNumber(text)}
                />
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