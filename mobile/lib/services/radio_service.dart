import 'package:flutter/foundation.dart';
import 'package:just_audio/just_audio.dart';

class RadioService with ChangeNotifier {
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _isPlaying = false;
  double _volume = 0.7;
  String _currentSong = 'Awesome God';
  String _currentArtist = 'Hillsong Worship';
  String _currentProgram = 'Morning Glory';
  String _currentHost = 'Pastor John';

  AudioPlayer get audioPlayer => _audioPlayer;
  bool get isPlaying => _isPlaying;
  double get volume => _volume;
  String get currentSong => _currentSong;
  String get currentArtist => _currentArtist;
  String get currentProgram => _currentProgram;
  String get currentHost => _currentHost;

  // TODO: Replace with actual radio stream URL
  Future<void> initialize() async {
    try {
      // Example: await _audioPlayer.setUrl('https://your-radio-stream-url.com/stream');
      // await _audioPlayer.setUrl('https://example.com/stream'); // Placeholder
      await _audioPlayer.setVolume(_volume);
    } catch (e) {
      debugPrint('Error initializing radio: $e');
    }
  }

  Future<void> play() async {
    try {
      // TODO: Initialize stream URL if not already set
      // await _audioPlayer.play();
      _isPlaying = true;
      notifyListeners();
      
      // Start fetching now playing info
      _startNowPlayingUpdates();
    } catch (e) {
      debugPrint('Error playing radio: $e');
    }
  }

  Future<void> pause() async {
    try {
      // await _audioPlayer.pause();
      _isPlaying = false;
      notifyListeners();
    } catch (e) {
      debugPrint('Error pausing radio: $e');
    }
  }

  Future<void> setVolume(double value) async {
    try {
      _volume = value;
      await _audioPlayer.setVolume(value);
      notifyListeners();
    } catch (e) {
      debugPrint('Error setting volume: $e');
    }
  }

  void _startNowPlayingUpdates() {
    // TODO: Implement periodic API calls to fetch current track info
    // This would typically poll every 30-60 seconds
    Future.delayed(const Duration(seconds: 30), () {
      if (_isPlaying) {
        _fetchNowPlayingInfo();
        _startNowPlayingUpdates();
      }
    });
  }

  // TODO: Fetch from API
  Future<void> _fetchNowPlayingInfo() async {
    try {
      // API call to get current track info
      // final response = await http.get(Uri.parse('$baseUrl/now-playing'));
      // Update current song, artist, program, and host
      
      // Mock update for demonstration
      // In production, this would be replaced with actual API data
    } catch (e) {
      debugPrint('Error fetching now playing info: $e');
    }
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }
}
