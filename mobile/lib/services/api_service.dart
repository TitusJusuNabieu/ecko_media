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

  Future<List<Program>> fetchPrograms() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/programs'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final List<dynamic> programsData = data['data'] ?? [];
          return programsData.map((j) => Program.fromJson(j as Map<String, dynamic>)).toList();
        }
      }
      return [];
    } catch (e) {
      debugPrint('Error fetching programs: $e');
      return [];
    }
  }

  Future<List<Sermon>> fetchSermons() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/sermons'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final List<dynamic> sermonsData = data['data'] ?? [];
          return sermonsData.map((j) => Sermon.fromJson(j as Map<String, dynamic>)).toList();
        }
      }
      return [];
    } catch (e) {
      debugPrint('Error fetching sermons: $e');
      return [];
    }
  }

  Future<List<NewsArticle>> fetchNews() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/articles?limit=20&status=published'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final List<dynamic> articlesData = data['data'] ?? [];
          return articlesData.map((j) => NewsArticle.fromJson(j as Map<String, dynamic>)).toList();
        }
      }
      return [];
    } catch (e) {
      debugPrint('Error fetching news: $e');
      return [];
    }
  }

  Future<List<Leader>> fetchLeaders() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/ministry'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true && data['data']?['leaders'] != null) {
          final List<dynamic> leadersData = data['data']['leaders'];
          return leadersData.map((j) => Leader.fromJson(j as Map<String, dynamic>)).toList();
        }
      }
      return [];
    } catch (e) {
      debugPrint('Error fetching leaders: $e');
      return [];
    }
  }

  Future<Map<String, dynamic>?> fetchMinistryInfo() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/ministry'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true && data['data'] != null) {
          return data['data'] as Map<String, dynamic>;
        }
      }
      return null;
    } catch (e) {
      debugPrint('Error fetching ministry info: $e');
      return null;
    }
  }

  Future<Map<String, dynamic>?> fetchCurrentStation() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/stations'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final List<dynamic> stations = data['data'] ?? [];
          if (stations.isNotEmpty) {
            return stations.first as Map<String, dynamic>;
          }
        }
      }
      return null;
    } catch (e) {
      debugPrint('Error fetching station: $e');
      return null;
    }
  }

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
        return json.decode(response.body) as Map<String, dynamic>;
      }
      return {'success': false, 'message': 'Failed to process donation'};
    } catch (e) {
      debugPrint('Error processing donation: $e');
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

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
        return json.decode(response.body) as Map<String, dynamic>;
      }
      return {'success': false, 'message': 'Failed to submit request'};
    } catch (e) {
      debugPrint('Error submitting song request: $e');
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

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
        return json.decode(response.body) as Map<String, dynamic>;
      }
      return {'success': false, 'message': 'Failed to submit shoutout'};
    } catch (e) {
      debugPrint('Error submitting shoutout: $e');
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

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
        return json.decode(response.body) as Map<String, dynamic>;
      }
      return {'success': false, 'message': 'Failed to send message'};
    } catch (e) {
      debugPrint('Error submitting contact: $e');
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }
}
