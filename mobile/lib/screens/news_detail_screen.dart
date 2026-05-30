import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/news_article.dart';

class NewsDetailScreen extends StatelessWidget {
  final NewsArticle article;

  const NewsDetailScreen({super.key, required this.article});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Article'),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Image
            Container(
              height: 250,
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppColors.deepNavy,
                gradient: LinearGradient(
                  colors: [
                    AppColors.deepNavy,
                    AppColors.deepNavy.withOpacity(0.8),
                  ],
                ),
              ),
              child: Center(
                child: Icon(
                  Icons.article,
                  size: 80,
                  color: AppColors.gold.withOpacity(0.5),
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    article.title,
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),

                  const SizedBox(height: 16),

                  // Meta Info
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.gold.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.person,
                              size: 14,
                              color: AppColors.deepNavy,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              article.author,
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Icon(
                        Icons.access_time,
                        size: 16,
                        color: AppColors.darkGray,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _formatDate(article.publishDate),
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Summary
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.accent,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: AppColors.gold.withOpacity(0.3),
                      ),
                    ),
                    child: Text(
                      article.summary,
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            fontStyle: FontStyle.italic,
                          ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Content
                  Text(
                    article.content,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          height: 1.6,
                        ),
                  ),

                  const SizedBox(height: 32),

                  // Share/Actions
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildActionButton(
                        context,
                        Icons.share,
                        'Share',
                        () {},
                      ),
                      _buildActionButton(
                        context,
                        Icons.bookmark_border,
                        'Save',
                        () {},
                      ),
                    ],
                  ),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context,
    IconData icon,
    String label,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.gold),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Icon(icon, color: AppColors.gold, size: 20),
            const SizedBox(width: 8),
            Text(
              label,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.gold,
                    fontWeight: FontWeight.w600,
                  ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(String date) {
    final dateTime = DateTime.parse(date);
    final months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return '${months[dateTime.month - 1]} ${dateTime.day}, ${dateTime.year}';
  }
}
