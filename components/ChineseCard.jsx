import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import * as Speech from 'expo-speech';
import { MicrophoneIcon } from 'react-native-heroicons/outline';
import colors from '../constants/colors.js';
import { Context } from '../Context.jsx';

const styles = StyleSheet.create({
  listItem: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: colors.primary,
    // borderColor: 'black',
    // borderWidth: 1,
    color: 'white',
  },
  characters: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chineseText: {
    marginRight: 5,
    color: 'white',
  },
});

const ChineseCard = ({ item }) => {
  const { store } = useContext(Context);
  const { speechSpeed, speechPitch } = store;

  const speakText = (text) => {
    try {
      Speech.speak(text, { language: 'zh-CN', rate: speechSpeed, pitch: speechPitch });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.listItem}>
      <View style={styles.characters}>
        <Text style={styles.chineseText}>{item.characters}</Text>
        <TouchableOpacity onPress={() => speakText(item.characters)}>
          <MicrophoneIcon color="white" size={16} fill="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.chineseText}>{item.pinyin}</Text>
      <Text style={styles.chineseText}>{item.translation}</Text>
    </View>
  ); };

export default ChineseCard;
