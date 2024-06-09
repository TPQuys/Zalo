import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker'
import axios from 'axios';
import {IP} from '../IP';

export default function Register_userInfo({ navigation, route }) {
    const { username, phonenumber, password } = route.params;
    const [checked, setChecked] = useState(0);
    const [date, setDate] = useState(new Date())
    const [show,setShow] = useState(false)
    const onChange = (event,selectedDate) =>{
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(new Date(currentDate));
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post(IP+'/api/auth/register', {
            username: username,
            password: password,
            phonenumber: phonenumber,
            gender: checked,
            birth: date
          });
          // Xử lý phản hồi từ server nếu cần
          navigation.push("Login")
          console.log('Phản hồi từ server:', response.data);
        } catch (error) {
          // Xử lý lỗi nếu có
          console.error('Lỗi khi đăng ký:', error);
        }
      };
    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, alignItems: "center" }}>
                <TouchableOpacity  onPress={()=>{navigation.goBack()}}>
                    <Image source={require("../images/back.png")} style={{ height: 25, width: 25 }} />
                </TouchableOpacity>
                <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>Ngày sinh và giới tính</Text>
            </View>
            <View style={{ padding: 15, backgroundColor: "#f3f4f6" }}>
                <Text>Hãy chọn ngày sinh và giới tính của bạn</Text>
            </View>
            <Text style={{ marginTop: 20, marginLeft: 20, fontSize: 20, fontWeight: 500 }}>Giới tính</Text>
            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 100 }}>
                <View style={{justifyContent: "center", alignItems: "center",margin:10}}>
                    <Image source={require("../images/male.jpg")} style={{ height: 100, width: 90 }} ></Image>
                    <RadioButton
                        value="first"
                        status={checked === 0 ? 'checked' : 'unchecked'}
                        onPress={() => setChecked(0)}
                    />
                    <Text>Nam</Text>
                </View>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                    <Image source={require("../images/female.jpg")} style={{ height: 100, width: 65}} ></Image>
                    <RadioButton
                        value="second"
                        status={checked === 1 ? 'checked' : 'unchecked'}
                        onPress={() => setChecked(1)}
                    />
                    <Text>Nữ /</Text>
                </View>
            </View>
            <View style={{height:10,backgroundColor:"#f3f4f6"}}/>
            <View>
            <Text style={{ marginTop: 20, marginLeft: 20, fontSize: 20, fontWeight: 500 }}>Ngày sinh</Text>
            {show && (<DateTimePicker mode='date' display='spinner' value={date} onChange={onChange}/>)}
            <View style={{alignItems:"center",justifyContent:"center"}}>
            <TouchableOpacity style={{backgroundColor:"#227ffd",padding:20,borderRadius:10}}
                onPress={()=>{
                    setShow(true)
                }}
            ><Text style={{color:"white",fontWeight:600}}>Chọn ngày sinh</Text>
            </TouchableOpacity>
            <Text>{date.getDate()+'/'+ date.getMonth() +"/"+date.getFullYear()}</Text>
            </View>
            </View>
            <TouchableOpacity style={{ position: "absolute", right: 30, bottom: 30, backgroundColor: "#227ffd", width: 50, height: 50, borderRadius: 50, alignItems: "center", justifyContent: "center" }}
                onPress={handleSubmit}
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