import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginHome from '../zalo/components/LoginHome';
import Login from '../zalo/components/Login';
import Register from './components/Register_name';
import Register1 from './components/Register_phone';
import Register2 from './components/Register_otp';
import Register3 from './components/Register_userinfo';
import Home from './components/Home';
import Profile_friend from './components/Profile_friend';
import Chat from './components/Chat';
import Personal from './components/Personal';
import GroupCreate from './components/GroupCreate';
import GroupDetail from './components/GroupDetail';
import FriendRequest from './components/FriendRequest';
import Friends_list from './components/Friends_list';
import Rest_Otp from './components/Reset_Otp';
import Password_new from './components/Password_new';
import Password_reset from './components/Password_reset';
import ChatGroup from './components/ChatGroup';
import  SocketProvider  from './context/SocketContext';
import { UserProvider } from './context/UserContext ';
import Ionicons from '@expo/vector-icons/Ionicons';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs({ route }) {
  const phonenumber = route.params.params
  const screen = route.params.Screen
  console.log("home",route.params)
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={screen}
    >
      <Tab.Screen name="Home" component={Home} initialParams={phonenumber}
        options={{
          tabBarLabel: 'Trang chính',
          tabBarIcon: ({ color }) => (
            <Ionicons name={"chatbubble-sharp"} color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen name="Friends_list" component={Friends_list} initialParams={phonenumber}
        options={{
          tabBarLabel: 'Danh bạ',
          tabBarIcon: ({ color }) => (
            <Ionicons name={"people"} color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen name="Personal" component={Personal} initialParams={phonenumber}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color }) => (
            <Ionicons name={"person"} color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (

    <UserProvider>
      <SocketProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="LoginHome"
            screenOptions={{
              headerShown: false,
            }}>
            {/* <Stack.Screen name="Register" component={Register} options={{headerShown:false}}/> */}
            <Stack.Screen name="ChatGroup" component={ChatGroup} />
            <Stack.Screen name="LoginHome" component={LoginHome} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register_phone" component={Register1} />
            <Stack.Screen name="Register_otp" component={Register2} />
            <Stack.Screen name="Register_userInfo" component={Register3} />
            <Stack.Screen name="Register_name" component={Register} />
            <Stack.Screen name="Profile_friend" component={Profile_friend} />
            <Stack.Screen name="FriendRequest" component={FriendRequest} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Reset_Otp" component={Rest_Otp} />
            <Stack.Screen name="Password_new" component={Password_new} />
            <Stack.Screen name="Password_reset" component={Password_reset} />
            <Stack.Screen name="HomeTabs" component={HomeTabs} />
            <Stack.Screen name="GroupCreate" component={GroupCreate} />
            <Stack.Screen name="GroupDetail" component={GroupDetail} />
          </Stack.Navigator>
        </NavigationContainer>
      </SocketProvider>
    </UserProvider>
  );
}
