import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MasonryFlashList } from '@shopify/flash-list'
import ImageCard from './imageCard'
import { getColumnCount, wp } from '../helpers/common'

const ImageGrid = ({images, router}) => {
    const column = getColumnCount(); 

  return (
    <View >
      <MasonryFlashList
        data={images}
        numColumns={column}
        initialNumberToRender = {1000}
        contentContainerStyle={styles.listContainerStyle}
        renderItem={({ item, index }) => <ImageCard item={item} router={router} index={index} />}
        estimatedItemSize={200}
      />
    </View>
  )
}

export default ImageGrid

const styles = StyleSheet.create({
    container: {
        minHeight: 3,
        width: wp(100)
    },

    listContainerStyle: {
        paddingHorizontal: wp(4)
    }
})