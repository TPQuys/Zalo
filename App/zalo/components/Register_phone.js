import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';



export default function Register_phone({ navigation,route }) {
    const [phonenumber, setPhonenumber] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const {username} = route.params;
        // const convertPhoneNumber = () => {
        //   if (phonenumber.length === 10 && !isNaN(phonenumber)) {
        //     const convertedNumber = `+84 ${phonenumber.slice(0, 4)}-${phonenumber.slice(4, 7)}-${phonenumber.slice(7)}`;
        //     setPhonenumber(convertedNumber);
        //     alert(convertedNumber);
        //   } else {
        //     alert('Số điện thoại không hợp lệ');
        //   }
        // };
    const handelCheckPassword = () => {
        if(password.length<6){
            alert("Warning: Mật khẩu phải chứa ít nhất 6 ký tự")
        }
        else if(password!=password2){
            alert("Mật khẩu nhập lại không khớp")
        }else{
            if (phonenumber.length === 10 && !isNaN(phonenumber)) {
                const convertedNumber = `+84 ${phonenumber.slice(0, 4)}-${phonenumber.slice(4, 7)}-${phonenumber.slice(7)}`;
                setPhonenumber(convertedNumber);
                navigation.push("Register_otp",{username:username,phonenumber:convertedNumber,password:password})
              } else {
                alert('Số điện thoại không hợp lệ');
              }
        }
    };
    
    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, alignItems: "center" }}>
                <TouchableOpacity           onPress={()=>{navigation.goBack()}}>
                    <Image source={require("../images/back.png")} style={{ height: 25, width: 25 }} />
                </TouchableOpacity>
                <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>Tạo tài khoản</Text>
            </View>
            <View style={{padding:15,backgroundColor:"#f3f4f6"}}>
                <Text>Nhập số điện thoại của bạn để tạo tài khoản mới</Text>
            </View>
            <View style={{ padding: 15, gap: 30 }}>
                <TextInput style={{ borderBottomWidth: 2, borderBottomColor: "lightgrey", fontSize: 20, padding: 5 }}
                    placeholder='Số điện thoại' placeholderTextColor={"lightgray"}
                    value={phonenumber}
                    onChangeText={text => setPhonenumber(text)}
                />
            </View>
            <View style={{padding:15,backgroundColor:"#f3f4f6"}}>
                <Text>Nhập mật khẩu của bạn</Text>
            </View>
            <View style={{ padding: 15, gap: 30 }}>
                <TextInput style={{ borderBottomWidth: 2, borderBottomColor: "lightgrey", fontSize: 20, padding: 5 }}
                    placeholder='mật khẩu' placeholderTextColor={"lightgray"}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
            </View>
            <View style={{padding:15,backgroundColor:"#f3f4f6"}}>
                <Text>Nhập lại mật khẩu</Text>
            </View>
            <View style={{ padding: 15, gap: 30 }}>
                <TextInput style={{ borderBottomWidth: 2, borderBottomColor: "lightgrey", fontSize: 20, padding: 5 }}
                    placeholder='Nhập lại mật khẩu' placeholderTextColor={"lightgray"}
                    secureTextEntry={true}
                    value={password2}
                    onChangeText={text => setPassword2(text)}
                />
            </View>
            <View style={{flexDirection:"row", padding:15}}>
            <Text>Bấm tiếp tục đồng nghĩa bạn đồng với các </Text>
            <TouchableOpacity><Text> Điều khoản </Text></TouchableOpacity>
             <Text>của chúng tôi</Text>
            </View>
            <TouchableOpacity style={{ position: "absolute", right: 30, bottom: 30, backgroundColor: "#227ffd", width: 50, height: 50, borderRadius: 50, alignItems: "center", justifyContent: "center" }}
                onPress={handelCheckPassword}
            >
               <Image source={require("../images/next.png")} style={{ height: 20, width: 20 }} /> 
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    Textbox: {
        borderWidth: 2,
        borderColor: "#514eb5",
        borderRadius: 15,
        padding: 10,
        width: "80%",
        fontSize: 17,
        backgroundColor: "#eaeaf5"
    }
});