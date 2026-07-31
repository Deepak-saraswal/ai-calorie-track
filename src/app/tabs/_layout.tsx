import { Tabs } from "expo-router";
import { View } from "react-native";

import {
  Add01Icon,
  Analytics01Icon,
  Home01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

import { Colors } from "@/constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
     screenOptions={{
  headerShown: false,
  tabBarShowLabel: false,

  tabBarStyle: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,

    height: 72,

    borderRadius: 36,

    backgroundColor: "#fff",

    borderTopWidth: 0,

    elevation: 12,
  },

  // 👇 Add these
  tabBarItemStyle: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 8,
  },

  tabBarIconStyle: {
    marginTop: 4,
  },

  tabBarActiveTintColor: Colors.primary,
  tabBarInactiveTintColor: "#9CA3AF",
}}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon
              icon={Home01Icon}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon
              icon={Analytics01Icon}
              size={24}
              color={color}
            />
          ),
        }}
      />

      

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon
              icon={UserIcon}
              size={24}
              color={color}
            />
          ),
        }}
      />
       <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: () => (
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: Colors.primary,

                justifyContent: "center",
                alignItems: "center",

                marginTop: 10,

                shadowColor: Colors.primary,
                shadowOpacity: 0.35,
                shadowRadius: 10,
                shadowOffset: {
                  width: 0,
                  height: 5,
                },

                elevation: 10,
              }}
            >
              <HugeiconsIcon
                icon={Add01Icon}
                size={30}
                color="#fff"
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}