import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  ImageBackground,
  Alert,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const { width } = Dimensions.get('window');
const dotSize = 40;
const gridSize = 3;
const spacing = 100;
const totalGridWidth = spacing * (gridSize - 1);
const startX = (width - totalGridWidth) / 2.5;
const startY = 330;
const correctPattern = [2, 6, 8, 4];

const defaultBackgroundImage = require('../../assets/eve.png');

const PatternLockScreen = ({ navigation }) => {
  const [currentPattern, setCurrentPattern] = useState([]);
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [backgroundImage, setBackgroundImage] = useState(
    defaultBackgroundImage,
  );
  const [isCustomBackground, setIsCustomBackground] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const containerRef = useRef(null);

  const offset = useRef({ x: 0, y: 0 });

  const dotPositions = Array.from({ length: 9 }, (_, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    return {
      id: i + 1,
      x: startX + col * spacing,
      y: startY + row * spacing,
    };
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  
    return () => backHandler.remove();
  }, []);

  
  useEffect(() => {
    containerRef.current?.measure((fx, fy, w, h, px, py) => {
      offset.current = { x: px, y: py };
    });
    loadBackgroundImage();
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedTime = `${hours % 12 || 12}:${
        minutes < 10 ? '0' : ''
      }${minutes} ${ampm}`;
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      const formattedDate = now.toLocaleDateString('en-US', options);
      setTime(formattedTime);
      setDate(formattedDate);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadBackgroundImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('backgroundImage');
      if (savedImage) {
        setBackgroundImage(savedImage);
        setIsCustomBackground(true);
      } else {
        setBackgroundImage(defaultBackgroundImage);
        setIsCustomBackground(false);
      }
    } catch (error) {
      console.log('Error loading background image:', error);
      setBackgroundImage(defaultBackgroundImage);
      setIsCustomBackground(false);
    }
  };

  const saveBackgroundImage = async imageUri => {
    try {
      await AsyncStorage.setItem('backgroundImage', imageUri);
      setIsCustomBackground(true);
    } catch (error) {
      console.log('Error saving background image:', error);
    }
  };
  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version < 30) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        if (
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          Alert.alert(
            'Permission Denied',
            'Camera and storage permissions are required to upload images.',
          );
          return false;
        }
      }
      return true;
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  };

  const showImagePicker = () => {
    const options = [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
    ];

    if (isCustomBackground) {
      options.push({ text: 'Reset to Default', onPress: resetToDefault });
    }

    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert('Select Image', 'Choose an option', options, {
      cancelable: true,
    });
  };

  const resetToDefault = async () => {
    try {
      await AsyncStorage.removeItem('backgroundImage');
      setBackgroundImage(defaultBackgroundImage);
      setIsCustomBackground(false);
    } catch (error) {
      console.log('Error resetting background image:', error);
    }
  };

  const openCamera = async () => {
    console.log('Requesting camera permission...');
    const hasPermission = await requestCameraPermission();
  
    if (!hasPermission) {
      console.log('Camera permission denied.');
      Alert.alert('Permission denied', 'Camera permission is required');
      return;
    }
  
    try {
      console.log('Camera permission granted. Launching camera...');
      setIsPickerOpen(true); // ⛔️ hide UI below picker
  
      const image = await ImagePicker.openCamera({
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });
  
      if (image && image.path) {
        console.log('Captured image path:', image.path);
        setBackgroundImage(image.path);
        await saveBackgroundImage(image.path);
      } else {
        console.log('No image returned from camera.');
      }
    } catch (error) {
      console.log('ImagePicker camera error:', error.message || error);
      Alert.alert('Camera Error', error.message || 'Unknown error');
    } finally {
      setIsPickerOpen(false); // ✅ show UI again
    }
  };
  

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setBackgroundImage(imageUri);
        saveBackgroundImage(imageUri);
      }
    });
  };

  const getDotAtTouch = (x, y) => {
    const TOUCH_RADIUS = 40; 
  
    for (let dot of dotPositions) {
      const dx = x - offset.current.x - (dot.x + dotSize / 2);
      const dy = y - offset.current.y - (dot.y + dotSize / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= TOUCH_RADIUS) return dot;
    }
    return null;
  };
  

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: evt => {
      const { pageX, pageY } = evt.nativeEvent;
      const touchedDot = getDotAtTouch(pageX, pageY);
    
      if (!touchedDot) return;
    
      setIsDrawing(true);
      setError('');
    
      setCurrentPattern(prev => {
        // If already drawing and dot is not in pattern, extend it
        if (prev.length > 0 && !prev.includes(touchedDot.id)) {
          const lastDotId = prev[prev.length - 1];
          const from = dotPositions.find(d => d.id === lastDotId);
          const to = touchedDot;
    
          if (from && to) {
            setLines(lines => [
              ...lines,
              {
                x1: from.x + dotSize / 2,
                y1: from.y + dotSize / 2,
                x2: to.x + dotSize / 2,
                y2: to.y + dotSize / 2,
              },
            ]);
          }
    
          return [...prev, touchedDot.id];
        }
    
        // Otherwise, start new pattern
        return [touchedDot.id];
      });
    },
    
    onPanResponderMove: evt => {
      if (!isDrawing) return;
      const { pageX, pageY } = evt.nativeEvent;
      const touchedDot = getDotAtTouch(pageX, pageY);
      if (touchedDot && !currentPattern.includes(touchedDot.id)) {
        const lastDotId = currentPattern[currentPattern.length - 1];
        const from = dotPositions.find(d => d.id === lastDotId);
        const to = touchedDot;
        if (from && to) {
          setLines(prev => [
            ...prev,
            {
              x1: from.x + dotSize / 2,
              y1: from.y + dotSize / 2,
              x2: to.x + dotSize / 2,
              y2: to.y + dotSize / 2,
            },
          ]);
        }
        setCurrentPattern([...currentPattern, touchedDot.id]);
      }
    },
    onPanResponderRelease: () => {
      setIsDrawing(false);
      if (
        currentPattern.length === correctPattern.length &&
        currentPattern.every((val, index) => val === correctPattern[index])
      ) {
        setIsUnlocked(true);
        setTimeout(() => navigation.replace('Home'), 500);
      } else {
        setError('Incorrect pattern. Try again.');
        setTimeout(() => {
          setCurrentPattern([]);
          setLines([]);
          setError('');
        }, 1000);
      }
    },
  });

  const renderContent = () => (
    <View
      style={styles.container}
      ref={containerRef}
      {...panResponder.panHandlers}
    >
      <View style={styles.overlay} />

      <View style={styles.lockIconContainer}>
        <Icon name={isUnlocked ? 'lock-open' : 'lock'} size={60} color="#fff" />
      </View>

      <Text style={styles.timeText}>{time}</Text>
      <Text style={styles.dateText}>{date}</Text>

      <Svg style={StyleSheet.absoluteFill}>
        {lines.map((line, index) => (
          <Line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#00f"
            strokeWidth={4}
          />
        ))}
      </Svg>

      {dotPositions.map(dot => (
        <View
          key={dot.id}
          style={[
            styles.dot,
            {
              left: dot.x,
              top: dot.y,
              backgroundColor: currentPattern.includes(dot.id)
                ? '#3b82f6'
                : 'rgba(102, 102, 102, 0.8)',
              borderColor: '#ccc',
              borderWidth: 2,
            },
          ]}
        />
      ))}

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.cameraContainer}>
        <View style={styles.imageWrapper}>
          <TouchableOpacity>
            <Image
              style={styles.img}
              source={require('../../assets/flashlight.png')}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.cameraButton} onPress={showImagePicker}>
          <Icon name="photo-camera" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={isCustomBackground ? { uri: backgroundImage } : backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {!isPickerOpen && renderContent()}
    </ImageBackground>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  lockIconContainer: {
    top: 50,
    left: '50%',
    transform: [{ translateX: -30 }],
    zIndex: 1,
  },
  timeText: {
    fontSize: 48,
    textAlign: 'center',
    color: '#fff',
    marginTop: 60,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  dateText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dot: {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    position: 'absolute',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cameraContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 40,
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  img: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },

  imageWrapper: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: 'rgba(68, 68, 68, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraButton: {
    backgroundColor: 'rgba(68, 68, 68, 0.8)',
    borderRadius: 30,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default PatternLockScreen;
