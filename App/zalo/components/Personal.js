import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import {IP} from '../IP';
import { UserContext } from '../context/UserContext ';

export default function Personal({ navigation, route}) {
    const { user, updateUser } = useContext(UserContext);
    const phonenumber=route.params.phonenumber;
    const [setting,setSetting] = useState(false)
    console.log(user)
    // alert(phonenumber)
    
    return (
        <View style={{ backgroundColor: "#f3f4f6", flex: 1 }}>
            <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, marginTop: 25, justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity>
                        <Ionicons name='search' size={25} color={"white"}></Ionicons>
                    </TouchableOpacity>
                    <TextInput style={{ fontSize: 17, padding: 10, color: "white" }}
                        placeholder='Tìm kiếm' placeholderTextColor={"lightgrey"}
                    />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                    onPress={()=>setSetting(true)}
                    ><Ionicons name='settings-outline' color={"white"} size={25} /></TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white" }}>
                <Image source={{uri:user.avatarpicture}} style={{ width: 60, height: 60, margin: 20, borderRadius: 30 }} />
                <View style={{ gap: 5, flex: 1 }}>
                    <Text style={{ fontWeight: 600, fontSize: 20 }}>{user.username}</Text>
                    <TouchableOpacity 
                    onPress={()=>{
                        navigation.push("Profile_friend", { friend:user, phonenumber })
                    }}
                    >
                    <Text style={{ fontSize: 15, color: "grey" }}>Xem trang cá nhân</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                onPress={()=>navigation.push("Login")}
                ><Ionicons name='swap-horizontal-outline' size={25} color={"#227ffd"} style={{ margin: 20 }} /></TouchableOpacity>
            </View>
            <View style={{backgroundColor:"white",marginTop:10}}>
                <TouchableOpacity style={{flexDirection:"row",alignItems:"center",borderBottomWidth:0.5,borderBottomColor:"lightgrey"}}>
                    <Ionicons name='wallet-outline' size={30} color={"#227ffd"} style={{margin:15}}/>
                    <View>
                        <Text  style={{ fontWeight: 600, fontSize: 20 }}>Ví QR</Text>
                        <Text style={{ fontSize: 15, color: "grey" }}>Lưu trữ và xuất trình các mã QR quan trọng</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:"row",alignItems:"center",borderBottomWidth:0.5,borderBottomColor:"lightgrey"}}>
                    <Ionicons name='cloud-outline' size={30} color={"#227ffd"} style={{margin:15}}/>
                    <View>
                        <Text  style={{ fontWeight: 600, fontSize: 20 }}>Clound của tôi</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{backgroundColor:"white",marginTop:10}}>
                <TouchableOpacity style={{flexDirection:"row",alignItems:"center",borderBottomWidth:0.5,borderBottomColor:"lightgrey"}}>
                    <Ionicons name='pie-chart-outline' size={30} color={"#227ffd"} style={{margin:15}}/>
                    <View>
                        <Text  style={{ fontWeight: 600, fontSize: 20 }}>Dung lượng và dữ liệu</Text>
                        <Text style={{ fontSize: 15, color: "grey" }}>Quản lý dữ liệu Zôla của bạn</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{backgroundColor:"white",marginTop:10}}>
                <TouchableOpacity style={{flexDirection:"row",alignItems:"center",borderBottomWidth:0.5,borderBottomColor:"lightgrey"}}>
                    <Ionicons name='shield-outline' size={30} color={"#227ffd"} style={{margin:15}}/>
                    <View>
                        <Text  style={{ fontWeight: 600, fontSize: 20 }}>Tài khoản và ảo mật</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:"row",alignItems:"center",borderBottomWidth:0.5,borderBottomColor:"lightgrey"}}>
                    <Ionicons name='lock-closed-outline' size={30} color={"#227ffd"} style={{margin:15}}/>
                    <View>
                        <Text  style={{ fontWeight: 600, fontSize: 20 }}>Quyền riêng tư</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {setting ?
                <View style={{ position: "absolute", alignSelf: "center", backgroundColor: "white", height: "100%", width: "100%", zIndex: 2,margin:25}}>
                    <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, alignItems: "center" }}>
                        <TouchableOpacity
                            onPress={() => {
                                setSetting(false)
                            }}
                        >
                        <Ionicons name='arrow-back' size={25} color={"white"} />
                            {/* <Image source={require("../images/back.png")} style={{ height: 25, width: 25 }} /> */}
                        </TouchableOpacity>

                        <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>Cài đặt</Text>
                    </View>
                </View>
                : null}
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