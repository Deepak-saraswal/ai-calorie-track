import { UserProfile } from "@/lib/profileStorage";
import { useUser } from "@clerk/expo";
import { HugeiconsIcon } from "@hugeicons/react-native";

import {
  Calendar01Icon,
  Dumbbell01Icon,
  RulerIcon,
  Target02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";

import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Colors } from "../constants/colors";


const TOTAL_STEPS = 5;


export default function Onboarding() {

  const { user } = useUser();


  const [step, setStep] = useState(1);


  const [gender, setGender] =
    useState<
      "Male" | "Female" | "Other" | null
    >(null);


  const [goal, setGoal] =
    useState<
      "Gain Weight" |
      "Lose Weight" |
      "Maintain Weight" |
      null
    >(null);


  const [workout, setWorkout] =
    useState<
      "2-3 Days" |
      "3-4 Days" |
      "5-7 Days" |
      null
    >(null);


  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");


  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weight, setWeight] = useState("");



  function validate() {

    if (step === 1 && !gender) {
      Alert.alert("Select gender");
      return false;
    }


    if (step === 2 && !goal) {
      Alert.alert("Select your goal");
      return false;
    }


    if (step === 3 && !workout) {
      Alert.alert("Select workout frequency");
      return false;
    }


    if (step === 4 && (!day || !month || !year)) {
      Alert.alert("Enter your birthday");
      return false;
    }


    if (step === 5 && (!feet || !weight)) {
      Alert.alert("Enter height and weight");
      return false;
    }


    return true;

  }



  function next() {

    if (!validate()) return;


    if (step === TOTAL_STEPS) {

      saveData();

      return;

    }


    setStep(step + 1);

  }



  function back() {

    if (step > 1)
      setStep(step - 1);

  }




async function saveData() {
  if (!user) return;

  try {
    const profile: UserProfile = {
      gender: gender!,
      goal: goal!,
      workout: workout!,
      birthDate: `${day}-${month}-${year}`,
      height: {
        feet: Number(feet),
        inches: Number(inches || 0),
      },
      weight: Number(weight),
    };

    router.push({
      pathname: "/generating-plan",
      params: {
        profile: JSON.stringify(profile),
      },
    });
  } catch (error) {
    console.log(error);

    Alert.alert(
      "Error",
      "Unable to continue."
    );
  }
}



  return (

    <LinearGradient
      colors={[
        Colors.gradientStart,
        Colors.gradientMiddle,
        Colors.gradientEnd
      ]}
      style={styles.container}
    >


      <SafeAreaView style={styles.safeArea}>


        <Text style={styles.counter}>
          Step {step} of {TOTAL_STEPS}
        </Text>



        <View style={styles.progressBg}>

          <View
            style={[
              styles.progress,
              {
                width: `${step * 20}%`
              }
            ]}
          />

        </View>



        <View style={styles.card}>


          {
            step === 1 &&

            <>

              <Header
                icon={UserIcon}
                title="Choose your gender"
              />


              <Option
                title="Male"
                selected={gender === "Male"}
                onPress={() => setGender("Male")}
              />


              <Option
                title="Female"
                selected={gender === "Female"}
                onPress={() => setGender("Female")}
              />


              <Option
                title="Other"
                selected={gender === "Other"}
                onPress={() => setGender("Other")}
              />

            </>

          }



          {
            step === 2 &&

            <>

              <Header
                icon={Target02Icon}
                title="What's your goal?"
              />


              <Option
                title="Gain Weight"
                selected={goal === "Gain Weight"}
                onPress={() => setGoal("Gain Weight")}
              />


              <Option
                title="Lose Weight"
                selected={goal === "Lose Weight"}
                onPress={() => setGoal("Lose Weight")}
              />


              <Option
                title="Maintain Weight"
                selected={goal === "Maintain Weight"}
                onPress={() => setGoal("Maintain Weight")}
              />

            </>

          }



          {
            step === 3 &&

            <>

              <Header
                icon={Dumbbell01Icon}
                title="Workout schedule"
              />


              <Option
                title="2-3 Days"
                selected={workout === "2-3 Days"}
                onPress={() => setWorkout("2-3 Days")}
              />


              <Option
                title="3-4 Days"
                selected={workout === "3-4 Days"}
                onPress={() => setWorkout("3-4 Days")}
              />


              <Option
                title="5-7 Days"
                selected={workout === "5-7 Days"}
                onPress={() => setWorkout("5-7 Days")}
              />

            </>

          }



          {
            step === 4 &&

            <>

              <Header
                icon={Calendar01Icon}
                title="Your birthday"
              />


              <View style={styles.row}>


                <Input
                  placeholder="DD"
                  value={day}
                  setValue={setDay}
                />


                <Input
                  placeholder="MM"
                  value={month}
                  setValue={setMonth}
                />


                <Input
                  placeholder="YYYY"
                  value={year}
                  setValue={setYear}
                />


              </View>


            </>

          }



          {
            step === 5 &&

            <>

              <Header
                icon={RulerIcon}
                title="Body measurements"
              />


              <Text style={styles.label}>
                Height
              </Text>


              <View style={styles.row}>


                <Input
                  placeholder="Feet"
                  value={feet}
                  setValue={setFeet}
                />


                <Input
                  placeholder="Inches"
                  value={inches}
                  setValue={setInches}
                />


              </View>


              <Text style={styles.label}>
                Weight (KG)
              </Text>


              <Input
                placeholder="70"
                value={weight}
                setValue={setWeight}
              />


            </>

          }



        </View>




        <View style={styles.actions}>


          {
            step > 1 &&
            <Pressable
              style={styles.back}
              onPress={back}
            >

              <Text>
                Back
              </Text>

            </Pressable>
          }



          <Pressable
            style={styles.next}
            onPress={next}
          >

            <Text style={styles.nextText}>
              {
                step === 5
                  ? "Finish"
                  : "Continue"
              }
            </Text>

          </Pressable>


        </View>



      </SafeAreaView>


    </LinearGradient>

  );

}





function Header({
  icon,
  title
}: any) {

  return (

    <View style={styles.header}>


      <HugeiconsIcon
        icon={icon}
        size={42}
        color={Colors.primary}
      />


      <Text style={styles.title}>
        {title}
      </Text>


    </View>

  )

}





function Option({
  title,
  selected,
  onPress
}: any) {

  return (

    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        selected && styles.selected
      ]}
    >


      <Text style={styles.optionText}>
        {title}
      </Text>


    </Pressable>

  )

}





function Input({
  placeholder,
  value,
  setValue
}: any) {

  return (

    <TextInput

      placeholder={placeholder}

      value={value}

      onChangeText={(text)=>setValue(text)}


      keyboardType="numeric"

      style={styles.input}

    />

  )

}





const styles = StyleSheet.create({

  container: {
    flex: 1
  },


  safeArea: {
    flex: 1,
    padding: 24
  },


  counter: {
    fontSize: 16,
    fontWeight: "700"
  },


  progressBg: {
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginTop: 10
  },


  progress: {
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 20
  },


  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 24,
    marginTop: 40
  },


  header: {
    alignItems: "center",
    marginBottom: 30
  },


  title: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 15
  },


  option: {
    height: 60,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 14
  },


  selected: {
    borderColor: Colors.primary,
    backgroundColor: "#eef7ff"
  },


  optionText: {
    fontSize: 17,
    fontWeight: "700"
  },


  row: {
    flexDirection: "row",
    gap: 12
  },


  input:{

height:55,
borderWidth:1,
borderColor:"#ddd",
borderRadius:16,
paddingHorizontal:15,
fontSize:17,
marginBottom:20,
color:"#111",
},


  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10
  },


  actions: {
    flexDirection: "row",
    gap: 15,
    marginTop: 25
  },


  back: {
    flex: 1,
    height: 55,
    borderRadius: 18,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center"
  },


  next: {
    flex: 2,
    height: 55,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },


  nextText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 17
  }

});