import 'package:flutter/foundation.dart';
import 'package:just_audio/just_audio.dart';
import '../config.dart';
import 'api_service.dart';

class RadioService with ChangeNotifier {
  final AudioPlayer _audioPlayer = AudioPlayer();
  final ApiService _apiService = ApiService();
  bool _isPlaying = false;
  bool _isInitialized = false;
  double _volume = 0.7;
  String _currentSong = 'Live Stream';
  String _currentArtist = 'Ecko Media 104.3 FM';
  String _currentProgram = 'Ecko Media Live';
  String _currentHost = 'Ecko Media';

  AudioPlayer get audioPlayer => _audioPlayer;
  bool get isPlaying => _isPlaying;
  double get volume => _volume;
  String get currentSong => _currentSong;
  String get currentArtist => _currentArtist;
  String get currentProgram => _currentProgram;
  String get currentHost => _currentHost;

  Future<void> initialize() async {
    if (_isInitialized) return;
    try {
      String streamUrl = Config.defaultStreamUrl;

      final station = await _apiService.fetchCurrentStation();
      if (station != null) {
        final apiUrl = station['streamUrl']?.toString();
        if (apiUrl != null && apiUrl.isNotEmpty) {
          streamUrl = apiUrl;
        }
        final name = station['name']?.toString();
        if (name != null && name.isNotEmpty) {
          _currentProgram = name;
          notifyListeners();
        }
      }

      await _audioPlayer.setUrl(streamUrl);
      await _audioPlayer.setVolume(_volume);
      _isInitialized = true;
    } catch (e) {
      debugPrint('Error initializing radio: $e');
    }
  }

  Future<void> play() async {
    try {
      if (!_isInitialized) {
        await initialize();
      }
      await _audioPlayer.play();
      _isPlaying = true;
      notifyListeners();
      _startNowPlayingUpdates();
    } catch (e) {
      debugPrint('Error playing radio: $e');
      _isPlaying = false;
      notifyListeners();
    }
  }

  Future<void> pause() async {
    try {
      await _audioPlayer.pause();
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
    Future.delayed(const Duration(seconds: 30), () {
      if (_isPlaying) {
        _fetchNowPlayingInfo();
        _startNowPlayingUpdates();
      }
    });
  }

  Future<void> _fetchNowPlayingInfo() async {
    try {
      final station = await _apiService.fetchCurrentStation();
      if (station != null) {
        final name = station['name']?.toString();
        if (name != null && name.isNotEmpty) {
          _currentProgram = name;
          notifyListeners();
        }
      }
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
