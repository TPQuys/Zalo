import React, { useState, useRef } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { firebaseConfig } from '../filebase/firebaseconfig'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import firebase from 'firebase/compat/app';

export default function Reset_Otp({ navigation, route }) {
    const {phonenumber } = route.params;
    const [code, setCode] = useState('');
    const [verificationId, setVerificationId] = useState(null);
    const RecaptchaVerifier = useRef(null);

    const sendOTP = () => {
        try {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            phoneProvider
                .verifyPhoneNumber(phonenumber, RecaptchaVerifier.current)
                .then(setVerificationId);
        } catch (error) {
            alert('Failed to send OTP');
            console.log(error);
        }
    };
    const confirmOTP = () => {
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                code
            );
            firebase.auth().signInWithCredential(credential).then(() => {
                const sanitizedNumber = phonenumber.replace(/\D/g, ''); // Xóa tất cả các ký tự không phải số
                if (sanitizedNumber.length < 13 && sanitizedNumber.startsWith('84')) {
                    const convertedNumber = sanitizedNumber.substring(2).split('-').join('');
                    alert(convertedNumber);
                    navigation.push("Password_new", {phonenumber: convertedNumber})
                } else {
                    alert('Số điện thoại không hợp lệ');
                }
            })
        } catch (error) {
            alert('Invalid OTP');
        }
    };
    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <FirebaseRecaptchaVerifierModal
                ref={RecaptchaVerifier}
                firebaseConfig={firebaseConfig}
            />
            <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, alignItems: "center" }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <Image source={require("../images/back.png")} style={{ height: 25, width: 25 }} />
                </TouchableOpacity>
                <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>Nhập mã kích hoạt</Text>
            </View>
            <View style={{ padding: 15, backgroundColor: "#f3f4f6" }}>
                <Text>{phonenumber} Mã xác thực đang được gửi đến số điện thoại của bạn, vui lòng không chia sẻ mã xác thực để tránh mất tài khoản</Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", margin: 30 }}>
                <Image source={require("../images/otp.png")} style={{ width: 100, height: 100 }} />
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", marginLeft: 15,gap:10 }}>
                <TextInput style={{ borderBottomWidth: 2, borderBottomColor: "lightgrey", fontSize: 20, padding: 5,textAlign:"center" }}
                    placeholder='Enter OTP' placeholderTextColor={"lightgray"}
                    value={code}
                    onChangeText={text => setCode(text)}
                />
                <TouchableOpacity style={{ width: 240, height: 50, backgroundColor: "#0090ff", borderRadius: 30, alignItems: "center", justifyContent: "center" }}
                    onPress={sendOTP}
                >
                    <Text style={{ color: "white", fontWeight: 600, fontSize: 17 }}>Nhận otp</Text>
                </TouchableOpacity>
                {/* <OTPInput value={OTP} onChange={setOTP} autoFocus OTPLength={6} otpType="number" disabled={false} /> */}
                <TouchableOpacity style={{ width: 240, height: 50, backgroundColor: "#0090ff", borderRadius: 30, alignItems: "center", justifyContent: "center" }}
                    onPress={confirmOTP}
                >
                    <Text style={{ color: "white", fontWeight: 600, fontSize: 17 }}>xác thực otp</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}