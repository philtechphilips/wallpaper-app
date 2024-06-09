import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { theme } from "../constants/theme";
import { capitalize, hp } from "../helpers/common";
import SectionView, { ColorFilterView, CommonFilterView } from "./filterView";
import { data } from "../constants/data";

const FiltersModal = ({ 
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters
 }) => {
  const snapPoints = useMemo(() => ["75%"], []);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={CustomBackDrop}
      //    onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>

            {Object.keys(sections).map((sectionName, index) => {
              let sectionView = sections[sectionName];
              let sectionData = data.filters[sectionName];
              let title = capitalize(sectionName);
              return (
                <View key={sectionName}>
                  <SectionView 
                  title={title} 
                  content={sectionView({
                     data: sectionData,
                     filters,
                     setFilters,
                     filterName: sectionName
                     })} />
                </View>
              );
            })}

            <View style={styles.buttons}>
            <Pressable style={styles.resetButton} onPress={onReset}>
            <Text style={[styles.buttonText, {color: theme.colors.neutral(0.9)}]}>Reset</Text>
            </Pressable>

            <Pressable style={styles.applyButton} onPress={onApply}>
            <Text style={[styles.buttonText, {color: theme.colors.white}]}>Apply</Text>
            </Pressable>
            </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections = {
  order: (props) => <CommonFilterView {...props} />,
  orientation: (props) => <CommonFilterView {...props} />,
  type: (props) => <CommonFilterView {...props} />,
  colors: (props) => <ColorFilterView {...props} />,
};


const CustomBackDrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];

  return (
    <Animated.View style={containerStyle}>
      <BlurView
        style={StyleSheet.absoluteFill}
        tint="dark"
        intensity={25}
      ></BlurView>
    </Animated.View>
  );
};

export default FiltersModal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  content: {
    flex: 1,
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    // width: "100%",
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderCurve: "continuous"
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.03),
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: theme.colors.grayBG
  },
  buttonText: {
    fontSize: hp(2.2)
  }
});
