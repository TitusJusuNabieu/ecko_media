import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'about_screen.dart';
import 'schedule_screen.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('More'),
      ),
      body: ListView(
        children: [
          const SizedBox(height: 16),

          // Profile/Ministry Info Header
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.deepNavy,
                  AppColors.deepNavy.withOpacity(0.9),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.gold,
                  ),
                  child: Icon(
                    Icons.church,
                    size: 40,
                    color: AppColors.deepNavy,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Ecko Media',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        color: AppColors.white,
                      ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 4),
                Text(
                  'Ecko Media',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.gold,
                      ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 8),

          // Menu Items
          _buildMenuSection(
            context,
            'Content',
            [
              _MenuItem(
                icon: Icons.schedule,
                title: 'Program Schedule',
                subtitle: 'View daily radio programs',
                onTap: () => _navigateToSchedule(context),
              ),
              _MenuItem(
                icon: Icons.info_outline,
                title: 'About the Ministry',
                subtitle: 'Learn more about us',
                onTap: () => _navigateToAbout(context),
              ),
            ],
          ),

          _buildMenuSection(
            context,
            'Connect',
            [
              _MenuItem(
                icon: Icons.language,
                title: 'Visit Website',
                subtitle: 'www.eckomedia.sl',
                onTap: () => _launchUrl('https://www.eckomedia.sl'),
              ),
              _MenuItem(
                icon: Icons.email,
                title: 'Contact Us',
                subtitle: 'Get in touch',
                onTap: () => _contactUs(context),
              ),
              _MenuItem(
                icon: Icons.share,
                title: 'Share App',
                subtitle: 'Tell others about Ecko Media',
                onTap: () => _shareApp(context),
              ),
            ],
          ),

          _buildMenuSection(
            context,
            'Settings',
            [
              _MenuItem(
                icon: Icons.notifications_outlined,
                title: 'Notifications',
                subtitle: 'Manage notification preferences',
                trailing: Switch(
                  value: true,
                  onChanged: (value) {},
                  activeTrackColor: AppColors.gold,
                ),
              ),
              _MenuItem(
                icon: Icons.download,
                title: 'Download Quality',
                subtitle: 'High',
                onTap: () {},
              ),
            ],
          ),

          _buildMenuSection(
            context,
            'Legal',
            [
              _MenuItem(
                icon: Icons.privacy_tip_outlined,
                title: 'Privacy Policy',
                onTap: () {},
              ),
              _MenuItem(
                icon: Icons.description_outlined,
                title: 'Terms of Service',
                onTap: () {},
              ),
            ],
          ),

          const SizedBox(height: 24),

          // App Version
          Center(
            child: Text(
              'Ecko Media v1.0.0',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.darkGray,
                  ),
            ),
          ),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildMenuSection(
    BuildContext context,
    String title,
    List<_MenuItem> items,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Text(
            title.toUpperCase(),
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  fontSize: 12,
                  letterSpacing: 1.2,
                ),
          ),
        ),
        ...items.map((item) => _buildMenuItem(context, item)),
      ],
    );
  }

  Widget _buildMenuItem(BuildContext context, _MenuItem item) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: AppColors.mediumGray.withOpacity(0.3)),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: AppColors.gold.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            item.icon,
            color: AppColors.gold,
            size: 24,
          ),
        ),
        title: Text(
          item.title,
          style: Theme.of(context).textTheme.titleMedium,
        ),
        subtitle: item.subtitle != null
            ? Text(
                item.subtitle!,
                style: Theme.of(context).textTheme.bodyMedium,
              )
            : null,
        trailing: item.trailing ??
            Icon(
              Icons.chevron_right,
              color: AppColors.darkGray,
            ),
        onTap: item.onTap,
      ),
    );
  }

  void _navigateToSchedule(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const ScheduleScreen()),
    );
  }

  void _navigateToAbout(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const AboutScreen()),
    );
  }

  void _launchUrl(String url) {
    // TODO: Implement URL launching with url_launcher package
    debugPrint('Launch URL: $url');
  }

  void _contactUs(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text('Contact Us'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildContactItem(Icons.email, 'info@eckomedia.sl'),
            const SizedBox(height: 12),
            _buildContactItem(Icons.phone, '+1 (555) 123-4567'),
            const SizedBox(height: 12),
            _buildContactItem(Icons.location_on, '123 Ministry Lane, City, State'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  Widget _buildContactItem(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 20, color: AppColors.gold),
        const SizedBox(width: 12),
        Expanded(
          child: Text(text),
        ),
      ],
    );
  }

  void _shareApp(BuildContext context) {
    // TODO: Implement share functionality
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Share functionality coming soon!'),
        backgroundColor: AppColors.deepNavy,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}

class _MenuItem {
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback? onTap;
  final Widget? trailing;

  _MenuItem({
    required this.icon,
    required this.title,
    this.subtitle,
    this.onTap,
    this.trailing,
  });
}
