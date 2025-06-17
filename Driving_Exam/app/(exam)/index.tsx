import { Module } from "@/types/Modules";
import { isErrorResponse } from "@/utils/apiClient";
import { getModules } from '@/utils/modules/apiClient';
import { styles } from '@/utils/modules/index.styles';
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';


export default function ExamModulesIndexScreen(){
    const [modules, setModules] = useState<Module[]>([]);

    async function loadModules(){
        const response = await getModules();
        if(isErrorResponse(response)){
            console.error("Error fetching modules:", response.message);
            return;
        }
        setModules(response);
    }

    useFocusEffect(
        useCallback(() => {
            loadModules();
        }, [])
    );

    

    return(
        <View style={styles.container}>
      <FlatList
        data={modules}
        keyExtractor={(item) => item.guid.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}
          onPress={() => router.push(`/(exam)/${item.guid}?name=${encodeURIComponent(item.name + " Exam")}`)}>
            
            <Text style={styles.title}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}