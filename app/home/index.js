import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import Categories from "../../components/categories";
import { apiCall } from "../../api";
import ImageGrid from "../../components/imageGrid";
import { debounce } from "lodash";
import FiltersModal from "../../components/filtersModal";

let page = 1;

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const [search, setSearch] = useState("");
  const searchInputRefrence = useRef(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState(null);
  const [isEndReached, setEndReached] = useState(false);
  const scrollRef = useRef(null);

  const modalRef = useRef(null);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearch("");
    searchInputRefrence?.current?.clear();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };
    if (category) params.category = category;
    fetchImages(params, false);
  };

  const handleSearch = (text) => {
    setSearch(text);

    if (text.length > 2) {
      page = 1;
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, q: text, ...filters }, false);
    }

    if (text == "") {
      page = 1;
      setImages([]);
      searchInputRefrence?.current?.clear();
      setActiveCategory(null);
      fetchImages({ page, ...filters }, false);
    }
  };

  const hadleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = true) => {
    let result = await apiCall(params);
    if (result.success && result?.data?.hits) {
      if (append) {
        setImages([...images, ...result.data.hits]);
      } else {
        setImages([...result.data.hits]);
      }
    }
  };

  const openFiltersModal = () => {
    modalRef?.current?.present();
  };

  const closeFiltersModal = () => {
    modalRef?.current?.close();
  };

  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFiltersModal();
  };

  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFiltersModal();
  };

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setEndReached(true);
        ++page;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params);
      }
    } else if (isEndReached) {
      setEndReached(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}
      >
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            placeholder="Search for photos..."
            style={styles.searchInput}
            placeholderTextColor="#888"
            // value={search}
            ref={searchInputRefrence}
            onChangeText={hadleTextDebounce}
          />
          {search && (
            <Pressable onPress={() => setSearch("")} style={styles.closeIcon}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            handleCategoryChange={handleCategoryChange}
          />
        </View>

        <View>
          {images && images.length > 0 && <ImageGrid images={images} />}
        </View>

        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>

      <FiltersModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFiltersModal}
        onApply={applyFilters}
        onReset={resetFilters}
      />
      <StatusBar barStyle="dark-content" />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
    color: theme.colors.neutral(0.6),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
});
