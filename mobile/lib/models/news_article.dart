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
    return NewsArticle(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      summary: json['summary'] ?? '',
      content: json['content'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      publishDate: json['publishDate'] ?? '',
      author: json['author'] ?? '',
    );
  }
}
