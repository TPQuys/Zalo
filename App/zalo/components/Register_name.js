import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';



export default function Register_name({ navigation }) {
    const [username, setUsername] = useState('');
    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, alignItems: "center" }}>
                <TouchableOpacity
                    onPress={()=>{
                        navigation.goBack()
                }}
                >
                    <Image source={require("../images/back.png")} style={{ height: 25, width: 25 }} />
                </TouchableOpacity>
                <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>Tạo tài khoản</Text>
            </View>
            <Text style={{marginTop:20,marginLeft:20,fontSize:20,fontWeight:500}}>Họ và tên</Text>
            <View style={{ padding: 15, gap: 30 }}>
                <TextInput style={{ borderBottomWidth: 2, borderBottomColor: "lightgrey", fontSize: 20, padding: 5 }}
                    placeholder='Tên' placeholderTextColor={"lightgray"}
                    value={username}
                    onChangeText={text => setUsername(text)}
                />
            </View>
            <View style={{ margin: 23, gap: 10 }}>
                <Text>Lưu ý khi đặt tên:</Text>
                <Text style={{ marginLeft: 10 }}>- Không vi phạm Quy định đặt tên </Text>
                <Text style={{ marginLeft: 10 }}>- Nên sử dụng tên thật để giúp bạn bè dễ nhận ra ban.</Text>
            </View>
            <TouchableOpacity style={{ position: "absolute", right: 30, bottom: 30, backgroundColor: "#227ffd", width: 50, height: 50, borderRadius: 50, alignItems: "center", justifyContent: "center" }}
                onPress={()=>navigation.push("Register_phone",{username:username})}
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