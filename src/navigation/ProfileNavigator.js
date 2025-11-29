import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "../screen/profile/ProfileScreen";
import LevelScreen from "../screen/profile/LevelScreen";
import PenggemarScreen from "../screen/profile/PenggemarScreen";
import PendapatanScreen from "../screen/profile/PendapatanScreen";
import GameCenterScreen from "../screen/profile/GameCenterScreen";
import BergabungScreen from "../screen/profile/BergabungScreen";
import ApplyAgencyScreen from "../screen/agencyscreen/ApplyAgencyScreen";
import ApplyHostScreen from "../screen/agencyscreen/ApplyHostScreen";

/* ✅ Import Edit Profile yang benar */
import EditProfileScreen from "../screen/profile/EditProfileScreen";

/* ✅ Import Detail Profile Screens */
import ProfilePictureScreen from "../screen/profile/ProfilePictureScreen";
import NicknameScreen from "../screen/profile/NicknameScreen";
import GenderScreen from "../screen/profile/GenderScreen";
import AgeScreen from "../screen/profile/AgeScreen";
import SignatureScreen from "../screen/profile/SignatureScreen";
import FollowListScreen from "../screen/profile/FollowListScreen";
import RechargeScreen from "../screen/profile/RechargeScreen";
import BCAScreen from "../screen/profile/Recharge/BCAScreen";
import MandiriScreen from "../screen/profile/Recharge/MandiriScreen";
import BRIScreen from "../screen/profile/Recharge/BRIScreen";
import BSSScreen from "../screen/profile/Recharge/BSSScreen";
import DANAScreen from "../screen/profile/Recharge/DANAScreen";
import OVOScreen from "../screen/profile/Recharge/OVOScreen";
import GoPayScreen from "../screen/profile/Recharge/GoPayScreen";
import LinkAjaScreen from "../screen/profile/Recharge/LinkAjaScreen";
import ShopeeScreen from "../screen/profile/Recharge/ShopeeScreen";
import BankPaymentScreen from "../screen/profile/Recharge/BankPaymentScreen";
import EwalletPaymentScreen from "../screen/profile/Recharge/EwalletPaymentScreen";
import PaymentSuccessScreen from "../screen/profile/Recharge/PaymentSuccessScreen";
import GooglePlayBillingScreen from "../screen/profile/Recharge/GooglePlayBillingScreen";
import SettingsScreen from "../screen/profile/SettingsScreen";
import AboutUsScreen from "../screen/profile/AboutUsScreen";
import PersonalitySettingsScreen from "../screen/profile/PersonalitySettingsScreen";
import PrivacySettingsScreen from "../screen/profile/PrivacySettingsScreen";
import LanguageSettingsScreen from "../screen/profile/LanguageSettingsScreen";
import BlacklistScreen from "../screen/profile/BlacklistScreen";
import ShopScreen from "../screen/profile/ShopScreen";
import AgencyDashboardScreen from "../screen/profile/AgencyDashboardScreen";
import AgencyHostListScreen from "../screen/profile/AgencyHostListScreen";
import AgencyHostIncomeScreen from "../screen/profile/AgencyHostIncomeScreen";
import AgencyLiveStatsScreen from "../screen/profile/AgencyLiveStatsScreen";
import AgencySalaryApprovalScreen from "../screen/profile/AgencySalaryApprovalScreen";
import AgencyTotalIncomeScreen from "../screen/profile/AgencyTotalIncomeScreen";

// Assume ExchangeScreen and ExchangeHistoryScreen are in the same directory or a similar structure
// You might need to adjust the import path based on your actual file structure
import ExchangeScreen from "../screen/profile/ExchangeScreen";
import ExchangeHistoryScreen from "../screen/profile/ExchangeHistoryScreen";

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />

      {/* ✅ Screen Edit Profile FIXED */}
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />

      {/* ✅ Detail Profile Screens */}
      <Stack.Screen name="ProfilePictureScreen" component={ProfilePictureScreen} />
      <Stack.Screen name="NicknameScreen" component={NicknameScreen} />
      <Stack.Screen name="GenderScreen" component={GenderScreen} />
      <Stack.Screen name="AgeScreen" component={AgeScreen} />
      <Stack.Screen name="SignatureScreen" component={SignatureScreen} />
      <Stack.Screen name="FollowListScreen" component={FollowListScreen} />

      <Stack.Screen
        name="RechargeScreen"
        component={RechargeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BCAScreen"
        component={BCAScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MandiriScreen"
        component={MandiriScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BRIScreen"
        component={BRIScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BSSScreen"
        component={BSSScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DANAScreen"
        component={DANAScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OVOScreen"
        component={OVOScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GoPayScreen"
        component={GoPayScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LinkAjaScreen"
        component={LinkAjaScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShopeeScreen"
        component={ShopeeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BankPaymentScreen"
        component={BankPaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EwalletPaymentScreen"
        component={EwalletPaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentSuccessScreen"
        component={PaymentSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GooglePlayBillingScreen"
        component={GooglePlayBillingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="LevelScreen" component={LevelScreen} />
      <Stack.Screen name="PenggemarScreen" component={PenggemarScreen} />
      <Stack.Screen
        name="Pendapatan"
        component={PendapatanScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Exchange"
        component={ExchangeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExchangeHistory"
        component={ExchangeHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="GameCenterScreen" component={GameCenterScreen} />
      <Stack.Screen name="BergabungScreen" component={BergabungScreen} />
      <Stack.Screen name="ApplyAgency" component={ApplyAgencyScreen} />
      <Stack.Screen name="ApplyHost" component={ApplyHostScreen} />
      <Stack.Screen name="ShopScreen" component={ShopScreen} />

      {/* Settings Screens */}
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
      <Stack.Screen name="PersonalitySettingsScreen" component={PersonalitySettingsScreen} />
      <Stack.Screen name="PrivacySettingsScreen" component={PrivacySettingsScreen} />
      <Stack.Screen name="LanguageSettingsScreen" component={LanguageSettingsScreen} />
      <Stack.Screen name="BlacklistScreen" component={BlacklistScreen} />

      {/* Agency Dashboard Routes */}
      <Stack.Screen name="AgencyDashboard" component={AgencyDashboardScreen} />
      <Stack.Screen name="AgencyHostList" component={AgencyHostListScreen} />
      <Stack.Screen name="AgencyHostIncome" component={AgencyHostIncomeScreen} />
      <Stack.Screen name="AgencyLiveStats" component={AgencyLiveStatsScreen} />
      <Stack.Screen name="AgencySalaryApproval" component={AgencySalaryApprovalScreen} />
      <Stack.Screen name="AgencyTotalIncome" component={AgencyTotalIncomeScreen} />
    </Stack.Navigator>
  );
}