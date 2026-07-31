import { useUser } from "@clerk/expo";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { getUserProfile } from "../../lib/profileService";
import Report from "../report";


export default function Analytics(){

const {user}=useUser();

const [loading,setLoading]=useState(true);
const [hasPlan,setHasPlan]=useState(false);


useEffect(()=>{

async function load(){

 if(!user) return;


 const profile=await getUserProfile(user.id);


 if(profile?.aiPlan){
    setHasPlan(true);
 }


 setLoading(false);

}


load();

},[user]);



if(loading){

return(
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>

<ActivityIndicator size="large"/>

<Text>
Generating your plan...
</Text>

</View>
)

}


return(

<View
style={{
flex:1,
justifyContent:"center",
alignItems:"center"
}}
>

{
hasPlan ?

<Report/>

:

<Text>
Generating your plan...
</Text>

}


</View>

)

}