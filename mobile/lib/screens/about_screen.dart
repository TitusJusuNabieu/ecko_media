import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/leader.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  // TODO: Replace with API call
  static final List<Leader> _leaders = [
    Leader(
      name: 'Pastor John Smith',
      role: 'Senior Pastor',
      imageUrl: '',
      bio: 'Leading the ministry with passion and dedication for over 20 years.',
    ),
    Leader(
      name: 'Rev. Sarah Johnson',
      role: 'Associate Pastor',
      imageUrl: '',
      bio: 'Committed to youth ministry and community outreach.',
    ),
    Leader(
      name: 'Dr. Michael Brown',
      role: 'Teaching Pastor',
      imageUrl: '',
      bio: 'Bringing biblical wisdom and practical teaching to the congregation.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('About Us'),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.deepNavy,
                    AppColors.deepNavy.withOpacity(0.9),
                  ],
                ),
              ),
              child: Column(
                children: [
                  Icon(
                    Icons.church,
                    size: 80,
                    color: AppColors.gold,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Ecko Media',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          color: AppColors.white,
                        ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Broadcasting Faith, Hope & Love Since 2010',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.gold,
                        ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Vision Section
            _buildSection(
              context,
              'Our Vision',
              Icons.visibility,
              'To be a beacon of hope and transformation, reaching souls across the globe with the life-changing message of Jesus Christ through radio, digital media, and community engagement.',
            ),

            // Mission Section
            _buildSection(
              context,
              'Our Mission',
              Icons.flag,
              'To spread the Gospel of Jesus Christ through powerful worship music, anointed preaching, and relevant content that inspires, encourages, and equips believers for victorious Christian living.',
            ),

            // About Ecko Media
            _buildSection(
              context,
              'About Ecko Media',
              Icons.radio,
              'Ecko Media is the official broadcasting arm of Ecko Media. We provide 24/7 Christian programming including worship music, sermons, Bible teaching, and inspirational content to uplift and strengthen your faith.',
            ),

            const SizedBox(height: 24),

            // Leadership Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                'Our Leadership',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
            ),
            const SizedBox(height: 16),

            ...(_leaders.map((leader) => _buildLeaderCard(context, leader))),

            const SizedBox(height: 24),

            // Ministries Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                'Our Ministries',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
            ),
            const SizedBox(height: 16),

            _buildMinistryCard(context, 'Youth Ministry', Icons.people, 
                'Empowering the next generation with biblical values and leadership skills.'),
            _buildMinistryCard(context, 'Women\'s Fellowship', Icons.woman,
                'A community of women growing in faith and supporting one another.'),
            _buildMinistryCard(context, 'Men\'s Fellowship', Icons.man,
                'Building strong, godly men who lead with integrity.'),
            _buildMinistryCard(context, 'Children\'s Church', Icons.child_care,
                'Teaching children about God\'s love in fun and engaging ways.'),
            _buildMinistryCard(context, 'Outreach & Missions', Icons.volunteer_activism,
                'Reaching the lost and serving communities locally and globally.'),

            const SizedBox(height: 24),

            // Contact Info
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
                  Text(
                    'Connect With Us',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 16),
                  _buildContactRow(Icons.language, 'www.eckomedia.sl'),
                  const SizedBox(height: 12),
                  _buildContactRow(Icons.email, 'info@eckomedia.sl'),
                  const SizedBox(height: 12),
                  _buildContactRow(Icons.phone, '+1 (555) 123-4567'),
                  const SizedBox(height: 12),
                  _buildContactRow(Icons.location_on, '123 Ministry Lane, City, State 12345'),
                ],
              ),
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(
    BuildContext context,
    String title,
    IconData icon,
    String content,
  ) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: AppColors.gold, size: 28),
              const SizedBox(width: 12),
              Text(
                title,
                style: Theme.of(context).textTheme.titleLarge,
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  height: 1.6,
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildLeaderCard(BuildContext context, Leader leader) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(
              radius: 40,
              backgroundColor: AppColors.deepNavy,
              child: Icon(
                Icons.person,
                size: 40,
                color: AppColors.gold,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    leader.name,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    leader.role,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.gold,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    leader.bio,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMinistryCard(
    BuildContext context,
    String title,
    IconData icon,
    String description,
  ) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.gold.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppColors.gold),
        ),
        title: Text(
          title,
          style: Theme.of(context).textTheme.titleMedium,
        ),
        subtitle: Text(
          description,
          style: Theme.of(context).textTheme.bodyMedium,
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
          child: Text(
            text,
            style: TextStyle(
              fontSize: 14,
              color: AppColors.deepNavy,
            ),
          ),
        ),
      ],
    );
  }
}
