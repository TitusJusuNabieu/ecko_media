import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config.dart';
import '../models/sermon.dart';
import '../models/news_article.dart';
import '../models/program.dart';
import '../models/leader.dart';

class ApiService {
  static String get baseUrl => Config.baseUrl;

  // Fetch programs schedule
  Future<List<Program>> fetchPrograms() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/programs'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          List<dynamic> programsData = data['data'];
          return programsData.map((json) => Program.fromJson(json)).toList();
        }
      }
      return _getMockPrograms();
    } catch (e) {
      debugPrint('Error fetching programs: $e');
      return _getMockPrograms();
    }
  }

  // Fetch sermons
  Future<List<Sermon>> fetchSermons() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/sermons'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          List<dynamic> sermonsData = data['data'];
          return sermonsData.map((json) => Sermon.fromJson(json)).toList();
        }
      }
      return _getMockSermons();
    } catch (e) {
      debugPrint('Error fetching sermons: $e');
      return _getMockSermons();
    }
  }

  // Fetch news articles
  Future<List<NewsArticle>> fetchNews() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/articles?limit=20'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          List<dynamic> articlesData = data['data'];
          return articlesData.map((json) => NewsArticle.fromJson(json)).toList();
        }
      }
      return _getMockNews();
    } catch (e) {
      debugPrint('Error fetching news: $e');
      return _getMockNews();
    }
  }

  // Fetch leaders
  Future<List<Leader>> fetchLeaders() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/ministry'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] && data['data']['leaders'] != null) {
          List<dynamic> leadersData = data['data']['leaders'];
          return leadersData.map((json) => Leader.fromJson(json)).toList();
        }
      }
      return _getMockLeaders();
    } catch (e) {
      debugPrint('Error fetching leaders: $e');
      return _getMockLeaders();
    }
  }

  // Process donation
  Future<Map<String, dynamic>> processDonation({
    required String category,
    required double amount,
    String? email,
    String? method,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/donations'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'category': category,
          'amount': amount,
          'email': email,
          'method': method ?? 'Orange Money',
        }),
      );
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body);
        return data;
      }
      
      return {'success': false, 'message': 'Failed to process donation'};
    } catch (e) {
      debugPrint('Error processing donation: $e');
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Submit song request
  Future<Map<String, dynamic>> submitSongRequest({
    required String songTitle,
    required String artist,
    required String requesterName,
    String? message,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/song-requests'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'song_title': songTitle,
          'artist': artist,
          'requester_name': requesterName,
          'message': message,
        }),
      );
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body);
        return data;
      }
      
      return {'success': false, 'message': 'Failed to submit request'};
    } catch (e) {
      debugPrint('Error submitting song request: $e');
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Submit shoutout
  Future<Map<String, dynamic>> submitShoutout({
    required String fromName,
    required String toName,
    required String message,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/shoutouts'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'from_name': fromName,
          'to_name': toName,
          'message': message,
        }),
      );
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body);
        return data;
      }
      
      return {'success': false, 'message': 'Failed to submit shoutout'};
    } catch (e) {
      debugPrint('Error submitting shoutout: $e');
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Submit contact message
  Future<Map<String, dynamic>> submitContact({
    required String name,
    required String email,
    required String message,
    String? phone,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/contact'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'name': name,
          'email': email,
          'phone': phone,
          'message': message,
        }),
      );
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body);
        return data;
      }
      
      return {'success': false, 'message': 'Failed to send message'};
    } catch (e) {
      debugPrint('Error submitting contact: $e');
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Mock data generators
  List<Program> _getMockPrograms() {
    return [
      Program(
        id: '1',
        title: 'Morning Devotion',
        host: 'Pastor John',
        startTime: '06:00 AM',
        endTime: '07:00 AM',
        description: 'Start your day with prayer and worship',
        day: 'Monday',
        category: 'Devotional',
      ),
      Program(
        id: '2',
        title: 'Gospel Vibes',
        host: 'DJ Faith',
        startTime: '07:00 AM',
        endTime: '09:00 AM',
        description: 'The best gospel music to energize your morning',
        day: 'Monday',
        category: 'Music',
      ),
      Program(
        id: '3',
        title: 'The Word Today',
        host: 'Pastor Sarah',
        startTime: '12:00 PM',
        endTime: '01:00 PM',
        description: 'Daily teaching from the Word of God',
        day: 'Monday',
        category: 'Teaching',
      ),
    ];
  }

  List<Sermon> _getMockSermons() {
    return [
      Sermon(
        id: '1',
        title: 'Walking in Faith',
        preacher: 'Pastor David Smith',
        date: '2024-01-15',
        thumbnailUrl: '',
        audioUrl: '',
        description: 'A powerful message about trusting God in difficult times',
        duration: '45:30',
      ),
      Sermon(
        id: '2',
        title: 'The Power of Prayer',
        preacher: 'Pastor Mary Johnson',
        date: '2024-01-08',
        thumbnailUrl: '',
        audioUrl: '',
        description: 'Understanding the importance of prayer in our daily lives',
        duration: '38:15',
      ),
    ];
  }

  List<NewsArticle> _getMockNews() {
    return [
      NewsArticle(
        id: '1',
        title: 'New Ministry Launch: Youth Outreach Program',
        summary: 'We are excited to announce a new youth outreach program starting next month',
        content: 'Full article content here...',
        imageUrl: '',
        publishDate: '2024-01-20',
        author: 'Communications Team',
      ),
      NewsArticle(
        id: '2',
        title: 'Annual Conference Registration Now Open',
        summary: 'Join us for our annual conference featuring renowned speakers and worship leaders',
        content: 'Full article content here...',
        imageUrl: '',
        publishDate: '2024-01-18',
        author: 'Events Team',
      ),
    ];
  }

  List<Leader> _getMockLeaders() {
    return [
      Leader(
        name: 'Bishop James Anderson',
        role: 'Senior Pastor',
        imageUrl: '',
        bio: 'Leading the ministry with vision and passion for over 20 years',
      ),
      Leader(
        name: 'Pastor Grace Wilson',
        role: 'Associate Pastor',
        imageUrl: '',
        bio: 'Dedicated to youth ministry and community outreach',
      ),
    ];
  }
}
