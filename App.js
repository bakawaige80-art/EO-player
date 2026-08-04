import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, SafeAreaView, Modal, Animated, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

// --- COMPLETE QURAN RECITATION TRACKS (Ordered from Wal-Adiyat to Al-Nasr) ---
const QURAN_TRACKS = [
  { 
    id: '10', 
    title: 'Surah Wal-Adiyat', 
    durationMillis: 95000, 
    durationFormatted: '1:35', 
    reciter: "Sheikh Ja'afar Mahmoud Adam",
    uri: require('./assets/Audio/Wal-Adiyat.mp3') 
  },
  { 
    id: '8', 
    title: 'Surah Al-Qariat', 
    durationMillis: 85000, 
    durationFormatted: '1:25', 
    reciter: "Sheikh Ja'afar Mahmoud Adam",
    uri: require('./assets/Audio/Al-Qariat.mp3') 
  },
  { 
    id: '2', 
    title: 'Surah At-takathur', 
    durationMillis: 90000, 
    durationFormatted: '1:30', 
    reciter: "Sheikh Ja'afar Mahmoud Adam",
    uri: require('./assets/Audio/At-takathur.mp3') 
  },
  { 
    id: '11', 
    title: 'Surah Al-Asr', 
    durationMillis: 55000, 
    durationFormatted: '0:55', 
    reciter: "Sheikh Ja'afar Mahmoud Adam",
    uri: require('./assets/Audio/Al-Asr.mp3') 
  },
  { 
    id: '3', 
    title: 'Surah Al-Humazah', 
    durationMillis: 80000, 
    durationFormatted: '1:20', 
    reciter: "Sheikh Ja'afar Mahmoud Adam",
    uri: require('./assets/Audio/Al-Humazah.mp3') 
  },
  { 
    id: '9', 
    title: 'Surah Al-Quraysh', 
    durationMillis: 65000, 
    durationFormatted: '1:05', 
    reciter: "Sheikh Ja'afar Mahmoud Adam",
    uri: require('./assets/Audio/Al-Quraysh.mp3') 
  },
  { 
    id: '6', 
    title: 'Surah Al-Maun', 
    durationMillis: 100000, 
    durationFormatted: '1:40', 
    reciter: "Sheikh Ja'afar Mahmoud Adam",
    uri: require('./assets/Audio/Al-Maun.mp3') 
  },
  { 
    id: '5', 
    title: 'Surah Al-Kauthar', 
    durationMillis: 50000, 
    durationFormatted: '0:50', 
    reciter: "Sheikh Ja'afar Mahmoud Adam",
    uri: require('./assets/Audio/Al-Kauthar.mp3') 
  },
  { 
    id: '4', 
    title: 'Surah Al-Kafirun', 
    durationMillis: 70000, 
    durationFormatted: '1:10', 
    reciter: "Sheikh Ja'afar Mahmoud Adam",
    uri: require('./assets/Audio/Al-Kafirun.mp3') 
  },
  { 
    id: '7', 
    title: 'Surah Al-Nasr', 
    durationMillis: 60000, 
    durationFormatted: '1:00', 
    reciter: "Sheikh Ja'afar Mahmoud Adam",
    uri: require('./assets/Audio/Al-Nasr.mp3') 
  },
];

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  
  // Audio Playback States
  const [sound, setSound] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Favorites State (stores array of track IDs)
  const [favorites, setFavorites] = useState([]);

  // Progress States
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(1);

  // Repeat Mode State ('all' loops the list by default, 'one' repeats single track, 'off' loops list)
  const [repeatMode, setRepeatMode] = useState('all');

  const repeatModeRef = useRef(repeatMode);
  const currentSongRef = useRef(currentSong);
  const soundRef = useRef(sound);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  // Audio Mode Configuration
  useEffect(() => {
    async function configureAudio() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.log("Error configuring audio mode", e);
      }
    }
    configureAudio();
  }, []);

  // Animated Values for the Audio Bars
  const anim1 = useRef(new Animated.Value(15)).current;
  const anim2 = useRef(new Animated.Value(30)).current;
  const anim3 = useRef(new Animated.Value(50)).current;
  const anim4 = useRef(new Animated.Value(25)).current;
  const anim5 = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    let animationLoop;
    if (isPlaying) {
      animationLoop = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(anim1, { toValue: 55, duration: 300, useNativeDriver: false }),
            Animated.timing(anim2, { toValue: 20, duration: 300, useNativeDriver: false }),
            Animated.timing(anim3, { toValue: 70, duration: 300, useNativeDriver: false }),
            Animated.timing(anim4, { toValue: 45, duration: 300, useNativeDriver: false }),
            Animated.timing(anim5, { toValue: 15, duration: 300, useNativeDriver: false }),
          ]),
          Animated.parallel([
            Animated.timing(anim1, { toValue: 20, duration: 300, useNativeDriver: false }),
            Animated.timing(anim2, { toValue: 60, duration: 300, useNativeDriver: false }),
            Animated.timing(anim3, { toValue: 30, duration: 300, useNativeDriver: false }),
            Animated.timing(anim4, { toValue: 70, duration: 300, useNativeDriver: false }),
            Animated.timing(anim5, { toValue: 50, duration: 300, useNativeDriver: false }),
          ]),
        ])
      );
      animationLoop.start();
    } else {
      Animated.parallel([
        Animated.timing(anim1, { toValue: 10, duration: 200, useNativeDriver: false }),
        Animated.timing(anim2, { toValue: 10, duration: 200, useNativeDriver: false }),
        Animated.timing(anim3, { toValue: 10, duration: 200, useNativeDriver: false }),
        Animated.timing(anim4, { toValue: 10, duration: 200, useNativeDriver: false }),
        Animated.timing(anim5, { toValue: 10, duration: 200, useNativeDriver: false }),
      ]).start();
    }
    return () => {
      if (animationLoop) animationLoop.stop();
    };
  }, [isPlaying]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  function onPlaybackStatusUpdate(status) {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setPositionMillis(status.positionMillis || 0);
      setDurationMillis(status.durationMillis || currentSongRef.current?.durationMillis || 1);
      
      if (status.didJustFinish) {
        handleTrackFinished();
      }
    }
  }

  async function handleTrackFinished() {
    const activeSong = currentSongRef.current;
    const mode = repeatModeRef.current;
    const activeSound = soundRef.current;
    
    if (!activeSong) return;

    if (mode === 'one') {
      if (activeSound) {
        try {
          await activeSound.setPositionAsync(0);
          await activeSound.playAsync();
        } catch (error) {
          console.log("Error looping track in repeat one mode", error);
        }
      }
    } else {
      const currentIndex = QURAN_TRACKS.findIndex(track => track.id === activeSong.id);
      const nextIndex = (currentIndex + 1) % QURAN_TRACKS.length;
      await handlePlaySong(QURAN_TRACKS[nextIndex]);
    }
  }

  async function handlePlaySong(song) {
    try {
      if (currentSongRef.current && currentSongRef.current.id === song.id && sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        return;
      }

      if (sound) {
        await sound.unloadAsync();
      }

      setCurrentSong(song);
      currentSongRef.current = song;
      setPositionMillis(0);
      setDurationMillis(song.durationMillis);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        song.uri,
        { 
          shouldPlay: true, 
          progressUpdateIntervalMillis: 250,
        },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      soundRef.current = newSound;
      setIsPlaying(true);

    } catch (error) {
      console.log("Error loading audio playback on Android", error);
    }
  }

  async function handleNextSong() {
    const activeSong = currentSongRef.current;
    if (!activeSong) return;
    const currentIndex = QURAN_TRACKS.findIndex(track => track.id === activeSong.id);
    const nextIndex = (currentIndex + 1) % QURAN_TRACKS.length;
    await handlePlaySong(QURAN_TRACKS[nextIndex]);
  }

  async function handlePrevSong() {
    const activeSong = currentSongRef.current;
    if (!activeSong) return;
    const currentIndex = QURAN_TRACKS.findIndex(track => track.id === activeSong.id);
    const prevIndex = (currentIndex - 1 + QURAN_TRACKS.length) % QURAN_TRACKS.length;
    await handlePlaySong(QURAN_TRACKS[prevIndex]);
  }

  async function togglePlayPause() {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  }

  function toggleRepeatMode() {
    if (repeatMode === 'all') {
      setRepeatMode('one');
    } else if (repeatMode === 'one') {
      setRepeatMode('off');
    } else {
      setRepeatMode('all');
    }
  }

  function toggleFavorite(songId) {
    if (favorites.includes(songId)) {
      setFavorites(favorites.filter(id => id !== songId));
    } else {
      setFavorites([...favorites, songId]);
    }
  }

  async function handleSeek(event) {
    if (!sound) return;
    const touchX = event.nativeEvent.locationX;
    const barWidth = 300; 
    const seekRatio = Math.max(0, Math.min(1, touchX / barWidth));
    const newPosition = seekRatio * durationMillis;
    
    await sound.setPositionAsync(newPosition);
    setPositionMillis(newPosition);
  }

  function formatTime(millis) {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function openYouTubeChannel() {
    const youtubeUrl = 'https://www.youtube.com'; 
    Linking.openURL(youtubeUrl).catch((err) => console.error("An error occurred opening YouTube link", err));
  }

  if (!isStarted) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.splashContent}>
          <Image 
            source={require('./assets/sheikh.png')} 
            style={styles.reciterSplashImage} 
          />
          <Text style={styles.splashTitle}>EO Player</Text>
          <Text style={styles.reciterNameText}>Sheikh Ja'afar Mahmoud Adam</Text>
          <Text style={styles.splashSubtitle}>Complete Quran Recitation (Offline)</Text>
          
          <TouchableOpacity style={styles.startButton} onPress={() => setIsStarted(true)}>
            <Text style={styles.startButtonText}>Open Recitations</Text>
            <Ionicons name="arrow-forward" size={20} color="#121212" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const progressPercent = durationMillis > 0 ? (positionMillis / durationMillis) * 100 : 0;

  let repeatColor = '#FFD700';
  if (repeatMode === 'off') {
    repeatColor = '#666';
  }

  const favoriteTracks = QURAN_TRACKS.filter(track => favorites.includes(track.id));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        
        {activeTab === 'Home' && (
          <View style={styles.tabView}>
            <View style={styles.reciterBanner}>
              <Image 
                source={require('./assets/sheikh.png')} 
                style={styles.bannerImage} 
              />
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={styles.bannerTitle}>Sheikh Ja'afar Mahmoud Adam</Text>
                <Text style={styles.bannerSubtitle}>Complete Offline Recitation</Text>
              </View>
            </View>

            <Text style={styles.headerTitle}>Complete Surahs</Text>
            <FlatList
              data={QURAN_TRACKS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelectedCurrent = currentSong?.id === item.id;
                const isFav = favorites.includes(item.id);
                return (
                  <TouchableOpacity 
                    style={[styles.songRow, isSelectedCurrent && styles.activeSongRow]} 
                    onPress={() => handlePlaySong(item)}
                  >
                    <Ionicons 
                      name={isSelectedCurrent && isPlaying ? "pause-circle" : "play-circle"} 
                      size={38} 
                      color="#FFD700" 
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={styles.songTitle}>{item.title}</Text>
                      <Text style={styles.songSubtitle}>{item.reciter} • {item.durationFormatted}</Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favRowBtn}>
                      <Ionicons name={isFav ? "heart" : "heart-outline"} size={22} color={isFav ? "#FFD700" : "#888"} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        {activeTab === 'Favorites' && (
          <View style={styles.tabView}>
            <Text style={styles.headerTitle}>Favourites ({favoriteTracks.length})</Text>
            {favoriteTracks.length === 0 ? (
              <Text style={styles.placeholderText}>No favourite surahs added yet. Tap the heart icon on any surah to add it here.</Text>
            ) : (
              <FlatList
                data={favoriteTracks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelectedCurrent = currentSong?.id === item.id;
                  return (
                    <TouchableOpacity 
                      style={[styles.songRow, isSelectedCurrent && styles.activeSongRow]} 
                      onPress={() => handlePlaySong(item)}
                    >
                      <Ionicons 
                        name={isSelectedCurrent && isPlaying ? "pause-circle" : "play-circle"} 
                        size={38} 
                        color="#FFD700" 
                      />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.songTitle}>{item.title}</Text>
                        <Text style={styles.songSubtitle}>{item.reciter} • {item.durationFormatted}</Text>
                      </View>
                      <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favRowBtn}>
                        <Ionicons name="heart" size={22} color="#FFD700" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        )}

        {activeTab === 'Settings' && (
          <ScrollView style={styles.tabView} showsVerticalScrollIndicator={false}>
            <Text style={styles.headerTitle}>Settings & About</Text>
            
            {/* Reciter Bio Section */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsSectionTitle}>About the Reciter</Text>
              <Text style={styles.settingsBodyText}>
                Sheikh Ja'afar Mahmoud Adam (1960–2007) was a renowned Nigerian Islamic scholar, prominent Salafi preacher, and exceptional Quran reciter. Known for his deep spiritual insight, clear melodious recitation style, and dedication to Islamic education, his legacy continues to inspire millions worldwide.
              </Text>
            </View>

            {/* App Info Section */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsSectionTitle}>App Information</Text>
              <Text style={styles.settingsBodyText}>
                EO Player is designed for seamless, offline Quran listening. Enjoy uninterrupted playback, custom favorite management, continuous loop features, and fully bundled audio chapters.
              </Text>
              <Text style={styles.versionText}>Version: 1.0.9 (Stable)</Text>
            </View>

            {/* YouTube Link Button */}
            <TouchableOpacity style={styles.youtubeButton} onPress={openYouTubeChannel}>
              <Ionicons name="logo-youtube" size={22} color="#121212" style={{ marginRight: 8 }} />
              <Text style={styles.youtubeButtonText}>Visit YouTube Channel</Text>
            </TouchableOpacity>
            
            <View style={{ height: 20 }} />
          </ScrollView>
        )}
      </View>

      {/* MINI PLAYER BAR */}
      {currentSong && (
        <TouchableOpacity style={styles.miniPlayer} activeOpacity={0.9} onPress={() => setIsModalVisible(true)}>
          <View style={{ flex: 1 }}>
            <Text style={styles.miniPlayerTitle} numberOfLines={1}>{currentSong.title}</Text>
            <Text style={styles.miniPlayerSubtitle}>{currentSong.reciter}</Text>
          </View>
          <TouchableOpacity onPress={(e) => { e.stopPropagation(); togglePlayPause(); }} style={styles.playPauseBtn}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={22} color="#121212" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* FULL SCREEN PLAYER MODAL */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <SafeAreaView style={{ flex: 1, width: '100%', alignItems: 'center', padding: 20 }}>
            
            <View style={styles.modalTopBar}>
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setIsModalVisible(false)}>
                <Ionicons name="chevron-down" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            <Image 
              source={require('./assets/sheikh.png')} 
              style={styles.modalArtwork} 
            />

            <Text style={styles.modalSongTitle}>{currentSong?.title}</Text>
            <Text style={styles.modalReciterText}>{currentSong?.reciter}</Text>

            {/* INTERACTIVE PROGRESS BAR */}
            <View style={styles.progressWrapper}>
              <TouchableOpacity activeOpacity={1} onPress={handleSeek} style={styles.progressBarTouchArea}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                </View>
              </TouchableOpacity>
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
                <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
              </View>
            </View>

            {/* ANIMATED AUDIO BARS */}
            <View style={styles.waveContainer}>
              <Animated.View style={[styles.waveBar, { height: anim1 }]} />
              <Animated.View style={[styles.waveBar, { height: anim2 }]} />
              <Animated.View style={[styles.waveBar, { height: anim3 }]} />
              <Animated.View style={[styles.waveBar, { height: anim4 }]} />
              <Animated.View style={[styles.waveBar, { height: anim5 }]} />
            </View>

            {/* Playback Controls Perfectly Centered with Favourites Button */}
            <View style={styles.modalControlsRow}>
              <TouchableOpacity onPress={toggleRepeatMode} style={styles.controlSecondaryBtn}>
                <Ionicons name="repeat" size={22} color={repeatColor} />
                <Text style={styles.repeatBadgeText}>{repeatMode.toUpperCase()}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handlePrevSong} style={styles.controlNavBtn}>
                <Text style={styles.navButtonText}>&lt;</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={togglePlayPause} style={styles.bigPlayButton}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#121212" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleNextSong} style={styles.controlNavBtn}>
                <Text style={styles.navButtonText}>&gt;</Text>
              </TouchableOpacity>

              {currentSong && (
                <TouchableOpacity onPress={() => toggleFavorite(currentSong.id)} style={styles.controlSecondaryBtn}>
                  <Ionicons 
                    name={favorites.includes(currentSong.id) ? "heart" : "heart-outline"} 
                    size={22} 
                    color={favorites.includes(currentSong.id) ? "#FFD700" : "#888"} 
                  />
                  <Text style={styles.repeatBadgeText}>FAV</Text>
                </TouchableOpacity>
              )}
            </View>

          </SafeAreaView>
        </View>
      </Modal>

      {/* BOTTOM TAB BAR */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Home')}>
          <Ionicons name={activeTab === 'Home' ? "home" : "home-outline"} size={24} color={activeTab === 'Home' ? "#FFD700" : "#888"} />
          <Text style={[styles.tabText, activeTab === 'Home' && { color: '#FFD700' }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Favorites')}>
          <Ionicons name={activeTab === 'Favorites' ? "heart" : "heart-outline"} size={24} color={activeTab === 'Favorites' ? "#FFD700" : "#888"} />
          <Text style={[styles.tabText, activeTab === 'Favorites' && { color: '#FFD700' }]}>Favourites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Settings')}>
          <Ionicons name={activeTab === 'Settings' ? "settings" : "settings-outline"} size={24} color={activeTab === 'Settings' ? "#FFD700" : "#888"} />
          <Text style={[styles.tabText, activeTab === 'Settings' && { color: '#FFD700' }]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  splashContainer: { flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center', alignItems: 'center', padding: 20 },
  splashContent: { alignItems: 'center' },
  reciterSplashImage: { width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: '#FFD700', marginBottom: 20, backgroundColor: '#333' },
  splashTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  reciterNameText: { fontSize: 16, color: '#FFD700', fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  splashSubtitle: { fontSize: 13, color: '#888', marginBottom: 40 },
  startButton: { flexDirection: 'row', backgroundColor: '#FFD700', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  startButtonText: { color: '#121212', fontWeight: 'bold', fontSize: 16 },
  contentContainer: { flex: 1, padding: 16 },
  tabView: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 12, marginTop: 10 },
  reciterBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 12, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  bannerImage: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#333' },
  bannerTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  bannerSubtitle: { color: '#888', fontSize: 12, marginTop: 2 },
  songRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 12, borderRadius: 10, marginBottom: 10 },
  activeSongRow: { borderWidth: 1, borderColor: '#FFD700' },
  songTitle: { color: '#fff', fontSize: 16, fontWeight: '500' },
  songSubtitle: { color: '#888', fontSize: 12, marginTop: 2 },
  favRowBtn: { padding: 8, marginLeft: 8 },
  placeholderText: { color: '#888', fontSize: 14, marginTop: 10 },
  settingsCard: { backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  settingsSectionTitle: { color: '#FFD700', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  settingsBodyText: { color: '#ccc', fontSize: 13, lineHeight: 20 },
  versionText: { color: '#888', fontSize: 12, marginTop: 10, fontStyle: 'italic' },
  youtubeButton: { flexDirection: 'row', backgroundColor: '#FFD700', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  youtubeButtonText: { color: '#121212', fontWeight: 'bold', fontSize: 15 },
  miniPlayer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#222', padding: 12, marginHorizontal: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#333' },
  miniPlayerTitle: { color: '#fff', fontWeight: '600', fontSize: 14 },
  miniPlayerSubtitle: { color: '#888', fontSize: 12 },
  playPauseBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  modalTopBar: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', marginBottom: 5 },
  closeModalBtn: { padding: 10 },
  modalArtwork: { width: 170, height: 170, borderRadius: 85, borderWidth: 3, borderColor: '#FFD700', marginBottom: 15, backgroundColor: '#333' },
  modalSongTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  modalReciterText: { color: '#FFD700', fontSize: 15, marginBottom: 15, textAlign: 'center' },
  progressWrapper: { width: 300, marginBottom: 15 },
  progressBarTouchArea: { paddingVertical: 10 },
  progressBarBackground: { height: 6, backgroundColor: '#333', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#FFD700' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  timeText: { color: '#888', fontSize: 12 },
  waveContainer: { flexDirection: 'row', height: 75, alignItems: 'flex-end', justifyContent: 'center', marginBottom: 25 },
  waveBar: { width: 8, backgroundColor: '#FFD700', marginHorizontal: 5, borderRadius: 4 },
  modalControlsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', gap: 15 },
  bigPlayButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center' },
  controlNavBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  navButtonText: { color: '#FFD700', fontSize: 20, fontWeight: 'bold' },
  controlSecondaryBtn: { alignItems: 'center', justifyContent: 'center', padding: 4, width: 45 },
  repeatBadgeText: { color: '#FFD700', fontSize: 9, fontWeight: 'bold', marginTop: 2 },
  tabBar: { flexDirection: 'row', height: 60, borderTopWidth: 1, borderTopColor: '#222', backgroundColor: '#181818', justifyContent: 'space-around', alignItems: 'center' },
  tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  tabText: { fontSize: 11, color: '#888', marginTop: 4 }
});