class NewsArticle {
  final String id;
  final String title;
  final String summary;
  final String content;
  final String imageUrl;
  final String publishDate;
  final String author;

  NewsArticle({
    required this.id,
    required this.title,
    required this.summary,
    required this.content,
    required this.imageUrl,
    required this.publishDate,
    required this.author,
  });

  factory NewsArticle.fromJson(Map<String, dynamic> json) {
    String authorName = '';
    final rawAuthor = json['author'];
    if (rawAuthor is String) {
      authorName = rawAuthor;
    } else if (rawAuthor is Map<String, dynamic>) {
      authorName = (rawAuthor['name'] ?? '').toString();
    }

    return NewsArticle(
      id: json['id']?.toString() ?? '',
      title: (json['title'] ?? '').toString(),
      summary: (json['summary'] ?? json['excerpt'] ?? '').toString(),
      content: (json['content'] ?? '').toString(),
      imageUrl: (json['imageUrl'] ?? json['featuredImage'] ?? '').toString(),
      publishDate: (json['publishDate'] ?? json['publishedAt'] ?? json['createdAt'] ?? '').toString(),
      author: authorName,
    );
  }
}
