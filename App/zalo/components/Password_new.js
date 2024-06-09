import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import {IP} from '../IP';
 


export default function Password_new({ navigation, route}) {
    const {phonenumber } = route.params;
    const [rePassword, setRePassword] = useState("")
    const [password, setPassword] = useState("")
    const [er, setEr] = useState("")
    const [erRe, setErRe] = useState("")
    const handleSubmit = async () => {
        try {
          const response = await axios.put(IP+'/api/users/resetpassword', {
            phonenumber: phonenumber,
            password: password
          });
          console.log('Phản hồi từ server:', response.data);
          alert('Thành công');
          navigation.navigate('Login');
        } catch (error) {
            console.log(error)
            alert('Thất bại'+phonenumber+password);
        }
      };

    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, alignItems: "center", marginTop: 25 }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <Image source={require("../images/back.png")} style={{ height: 25, width: 25 }} />
                </TouchableOpacity>
                <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>Tạo mật khẩu</Text>
            </View>
            <Text style={{ marginTop: 20, marginLeft: 20, fontSize: 20, fontWeight: 500 }}>Mật khẩu mới</Text>
            <View style={{ padding: 15, gap: 30 }}>
                <View>
                    <TextInput style={{ borderBottomWidth: 2, borderBottomColor: "lightgrey", fontSize: 20, padding: 5 }}
                        placeholder='Mật khẩu' placeholderTextColor={"lightgray"}
                        value={password}
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        onBlur={() => {
                            if (password.length < 8) {
                                setEr("Mật khẩu từ 8 kí tự trở lên")
                            } else setEr("")
                        }}
                    />
                    <Text style={{ color: "red" }}>{er}</Text>
                </View>
            </View>
            <Text style={{ marginTop: 20, marginLeft: 20, fontSize: 20, fontWeight: 500 }}>Nhập lại mật khẩu</Text>
            <View style={{ padding: 15, gap: 30 }}>
                <View>
                    <TextInput style={{ borderBottomWidth: 2, borderBottomColor: "lightgrey", fontSize: 20, padding: 5 }}
                        placeholder='Nhập lại mật khẩu' placeholderTextColor={"lightgray"}
                        value={rePassword}
                        secureTextEntry={true}
                        onChangeText={setRePassword}
                        onBlur={() => {
                            if (password != rePassword) {
                                setErRe("Mật khẩu nhập lại không đúng")
                            } else setErRe("")
                        }}
                    />
                    <Text style={{ color: "red" }}>{erRe}</Text>
                </View>
            </View>
            <TouchableOpacity style={{ position: "absolute", right: 30, bottom: 30, backgroundColor: "#227ffd", width: 50, height: 50, borderRadius: 50, alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                    if (password.trim() != "" && rePassword.trim() != "" && er == "" && password == rePassword)
                        if (password == rePassword)
                            handleSubmit()
                        else
                            setErRe("Mật khẩu nhập lại không đúng")
                    else alert("Hãy nhập đủ thông tin")
                }}
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