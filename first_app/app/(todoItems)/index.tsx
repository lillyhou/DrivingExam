import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '@/utils/todoItems/index.styles';
import { getTodoItems } from '@/utils/todoItems/apiClient';
import { isErrorResponse } from '@/utils/apiClient';
import { TodoItem } from '@/types/TodoItem';

export default function TodoItemsScreen() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  async function loadItems() {
    const response = await getTodoItems();
    if (isErrorResponse(response)) {
      console.error('Fehler beim Laden:', response.message);
      return;
    }
    setItems(response);
  }

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const categories = Array.from(
    new Set(items.map((item) => item.categoryName))
  );

  const filteredItems = selectedCategory
    ? items.filter((item) => item.categoryName === selectedCategory)
    : items;

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
        mode="dropdown"
      >
        <Picker.Item label="Alle Kategorien" value={null} />
        {categories.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.guid}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}