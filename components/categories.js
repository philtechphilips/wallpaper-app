import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { data } from "../constants/data";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";

const Categories = ({ activeCategory, handleCategoryChange }) => {
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.flatlistContainer}
      showsHorizontalScrollIndicator={false}
      data={data.categories}
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => (
        <CategoryItem title={item} index={index} isActive={activeCategory===item} handleCategoryChange={handleCategoryChange} />
      )}
    />
  );
};

const CategoryItem = ({ title, index, isActive, handleCategoryChange }) => {
  return (
    <View key={index}>
      <Pressable onPress={() => handleCategoryChange(isActive ? null : title)} style={[styles.category]}>
        <Text style={[styles.title]}>{title}</Text>
      </Pressable>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingHorizontal: wp(4),
    gap: 8
  },

  category: {
    padding: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous'
  },

  title: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.medium,
    textTransform: "capitalize"
  }
});
