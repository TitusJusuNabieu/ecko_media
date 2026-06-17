import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/leader.dart';
import '../services/api_service.dart';

class AboutScreen extends StatefulWidget {
  const AboutScreen({super.key});

  @override
  State<AboutScreen> createState() => _AboutScreenState();
}

class _AboutScreenState extends State<AboutScreen> {
  final ApiService _apiService = ApiService();
  List<Leader> _leaders = [];
  Map<String, dynamic>? _ministry;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final results = await Future.wait([
      _apiService.fetchLeaders(),
      _apiService.fetchMinistryInfo(),
    ]);
    if (mounted) {
      setState(() {
        _leaders = results[0] as List<Leader>;
        _ministry = results[1] as Map<String, dynamic>?;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final name = _ministry?['name'] ?? 'Ecko Media';
    final about = _ministry?['about'] as String?;
    final mission = _ministry?['mission'] as String?;
    final address = _ministry?['address'] as String?;
    final email = _ministry?['email'] as String?;
    final phone = _ministry?['phone'] as String?;
    final website = _ministry?['website'] as String?;

    return Scaffold(
      appBar: AppBar(title: const Text('About Us')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Hero Section
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [AppColors.deepNavy, AppColors.deepNavy.withOpacity(0.85)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                    child: Column(
                      children: [
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.gold.withOpacity(0.15),
                            border: Border.all(color: AppColors.gold, width: 2),
                          ),
                          child: Icon(Icons.campaign, size: 40, color: AppColors.gold),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          '$name 104.3 FM',
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                color: AppColors.white,
                                fontWeight: FontWeight.bold,
                              ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Connecting Voices — Freetown, Sierra Leone',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: AppColors.gold,
                              ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  if (about != null)
                    _buildSection(context, 'Who We Are', Icons.campaign, about),

                  if (mission != null)
                    _buildSection(context, 'Our Mission', Icons.flag, mission),

                  const SizedBox(height: 8),

                  // What We Do
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Text('What We Do', style: Theme.of(context).textTheme.headlineSmall),
                  ),
                  const SizedBox(height: 12),

                  _buildServiceCard(context, 'Radio — 104.3 FM', Icons.radio,
                      'Live FM broadcasting from Freetown — morning shows 7:30 AM Mon–Fri, talk programs, and entertainment all day.'),
                  _buildServiceCard(context, 'Newspaper', Icons.newspaper,
                      'In-depth newspaper review and local/national news coverage keeping every Sierra Leonean informed.'),
                  _buildServiceCard(context, 'Online Streaming', Icons.wifi,
                      'Stream Ecko Media live anywhere in the world — connecting the Sierra Leonean diaspora.'),
                  _buildServiceCard(context, 'Talk Shows & Community', Icons.mic,
                      'Governance reviews, cultural programs, and community voices — every voice regardless of status or region.'),

                  const SizedBox(height: 16),

                  // Leadership section
                  if (!_isLoading && _leaders.isNotEmpty) ...[
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Text('Our Team', style: Theme.of(context).textTheme.headlineSmall),
                    ),
                    const SizedBox(height: 12),
                    ..._leaders.map((leader) => _buildLeaderCard(context, leader)),
                    const SizedBox(height: 8),
                  ],

                  // Connect With Us
                  Container(
                    margin: const EdgeInsets.all(20),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppColors.accent,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.gold.withOpacity(0.3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Connect With Us', style: Theme.of(context).textTheme.titleLarge),
                        const SizedBox(height: 16),
                        _buildContactRow(Icons.radio, '104.3 FM — Freetown, Sierra Leone'),
                        if (website != null) ...[
                          const SizedBox(height: 12),
                          _buildContactRow(Icons.language, website),
                        ],
                        if (email != null) ...[
                          const SizedBox(height: 12),
                          _buildContactRow(Icons.email, email),
                        ],
                        if (phone != null) ...[
                          const SizedBox(height: 12),
                          _buildContactRow(Icons.phone, phone),
                        ],
                        if (address != null) ...[
                          const SizedBox(height: 12),
                          _buildContactRow(Icons.location_on, address),
                        ],
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),
                ],
              ),
            ),
    );
  }

  Widget _buildSection(BuildContext context, String title, IconData icon, String content) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: AppColors.gold, size: 28),
              const SizedBox(width: 12),
              Text(title, style: Theme.of(context).textTheme.titleLarge),
            ],
          ),
          const SizedBox(height: 12),
          Text(content, style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.6)),
        ],
      ),
    );
  }

  Widget _buildServiceCard(BuildContext context, String title, IconData icon, String description) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.gold.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppColors.gold),
        ),
        title: Text(title, style: Theme.of(context).textTheme.titleMedium),
        subtitle: Text(description, style: Theme.of(context).textTheme.bodyMedium),
      ),
    );
  }

  Widget _buildLeaderCard(BuildContext context, Leader leader) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(
              radius: 32,
              backgroundColor: AppColors.deepNavy,
              backgroundImage: leader.imageUrl.isNotEmpty ? NetworkImage(leader.imageUrl) : null,
              child: leader.imageUrl.isEmpty ? Icon(Icons.person, size: 32, color: AppColors.gold) : null,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(leader.name, style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 2),
                  Text(leader.role,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.gold)),
                  if (leader.bio.isNotEmpty) ...[
                    const SizedBox(height: 6),
                    Text(leader.bio, style: Theme.of(context).textTheme.bodyMedium),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContactRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 20, color: AppColors.gold),
        const SizedBox(width: 12),
        Expanded(
          child: Text(text, style: TextStyle(fontSize: 14, color: AppColors.deepNavy)),
        ),
      ],
    );
  }
}
