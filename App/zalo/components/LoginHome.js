import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, LogBox } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";


export default function LoginHome({ navigation }) {
    LogBox.ignoreAllLogs()
    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <SliderBox style={{ height: 400, width: "100%", maxWidth: 500 ,marginTop:60}}
                    autoplay
                    circleLoop
                    dotColor={"#0090ff"}
                    images={
                        [
                            require("../images/homeLogin.jpg"),
                            require("../images/homeLogin1.png"),
                            require("../images/homeLogin2.png"),
                            require("../images/homeLogin3.png"),
                            require("../images/homeLogin4.png")
                        ]
                    } />
                {/* <Image source={require("../images/homeLogin.jpg")} style={{height:600,width:"100%",maxWidth:500}}></Image> */}
            </View>
            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center", gap: 15 }}>
                <TouchableOpacity style={{ width: 240, height: 50, backgroundColor: "#0090ff", borderRadius: 30, alignItems: "center", justifyContent: "center" }}
                    onPress={() => {
                        navigation.navigate("Login")
                    }}
                >
                    <Text style={{ color: "white", fontWeight: 600, fontSize: 17 }}>ĐĂNG NHẬP</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: 240, height: 50, backgroundColor: "#f3f4f8", borderRadius: 30, alignItems: "center", justifyContent: "center" }}
                    onPress={() => {
                        navigation.navigate("Register_name")
                    }}
                >
                    <Text style={{ fontWeight: 600, fontSize: 17 }}>ĐĂNG KÝ</Text>
                </TouchableOpacity>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", flex: 0.2 }}>
            </View>
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