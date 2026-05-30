import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/news_article.dart';
import 'news_detail_screen.dart';

class NewsScreen extends StatefulWidget {
  const NewsScreen({super.key});

  @override
  State<NewsScreen> createState() => _NewsScreenState();
}

class _NewsScreenState extends State<NewsScreen> {
  // TODO: Replace with API call to fetch news articles
  final List<NewsArticle> _articles = [
    NewsArticle(
      id: '1',
      title: 'New Ministry Building Dedication',
      summary: 'Join us for the grand opening and dedication of our new ministry center this Sunday.',
      content: 'We are excited to announce the dedication of our new ministry building...',
      imageUrl: '',
      publishDate: '2024-11-28',
      author: 'Ministry Team',
    ),
    NewsArticle(
      id: '2',
      title: 'Youth Conference 2024 Registration Open',
      summary: 'Register now for our annual youth conference featuring guest speakers and worship sessions.',
      content: 'The 2024 Youth Conference is coming up...',
      imageUrl: '',
      publishDate: '2024-11-25',
      author: 'Youth Ministry',
    ),
    NewsArticle(
      id: '3',
      title: 'Christmas Outreach Program',
      summary: 'Help us spread joy this holiday season through our community outreach initiatives.',
      content: 'This Christmas, we are launching several outreach programs...',
      imageUrl: '',
      publishDate: '2024-11-22',
      author: 'Outreach Team',
    ),
    NewsArticle(
      id: '4',
      title: 'New Radio Programming Schedule',
      summary: 'Check out our updated radio schedule with new programs and exciting content.',
      content: 'Ecko Media is thrilled to introduce our new programming schedule...',
      imageUrl: '',
      publishDate: '2024-11-20',
      author: 'Radio Team',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('News & Announcements'),
      ),
      body: RefreshIndicator(
        onRefresh: _refreshNews,
        color: AppColors.gold,
        child: ListView.builder(
          padding: const EdgeInsets.only(top: 8, bottom: 16),
          itemCount: _articles.length,
          itemBuilder: (context, index) {
            final article = _articles[index];
            return _buildNewsCard(article);
          },
        ),
      ),
    );
  }

  Future<void> _refreshNews() async {
    // TODO: Implement API call to refresh news
    await Future.delayed(const Duration(seconds: 1));
  }

  Widget _buildNewsCard(NewsArticle article) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: InkWell(
        onTap: () => _openArticle(article),
        borderRadius: BorderRadius.circular(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppColors.deepNavy,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
                gradient: LinearGradient(
                  colors: [
                    AppColors.deepNavy,
                    AppColors.deepNavy.withOpacity(0.8),
                  ],
                ),
              ),
              child: Stack(
                children: [
                  Center(
                    child: Icon(
                      Icons.article,
                      size: 64,
                      color: AppColors.gold.withOpacity(0.5),
                    ),
                  ),
                  Positioned(
                    top: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.gold,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        'NEW',
                        style: TextStyle(
                          color: AppColors.deepNavy,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    article.title,
                    style: Theme.of(context).textTheme.titleLarge,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    article.summary,
                    style: Theme.of(context).textTheme.bodyMedium,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(
                        Icons.person_outline,
                        size: 16,
                        color: AppColors.darkGray,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        article.author,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const SizedBox(width: 16),
                      Icon(
                        Icons.calendar_today,
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
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton.icon(
                        onPressed: () => _openArticle(article),
                        icon: const Text('Read More'),
                        label: Icon(
                          Icons.arrow_forward,
                          size: 16,
                          color: AppColors.gold,
                        ),
                        style: TextButton.styleFrom(
                          foregroundColor: AppColors.gold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(String date) {
    final dateTime = DateTime.parse(date);
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      final months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      return '${months[dateTime.month - 1]} ${dateTime.day}, ${dateTime.year}';
    }
  }

  void _openArticle(NewsArticle article) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => NewsDetailScreen(article: article),
      ),
    );
  }
}
