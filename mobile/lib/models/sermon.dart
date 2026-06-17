class Sermon {
  final String id;
  final String title;
  final String preacher;
  final String date;
  final String thumbnailUrl;
  final String audioUrl;
  final String description;
  final String duration;

  Sermon({
    required this.id,
    required this.title,
    required this.preacher,
    required this.date,
    required this.thumbnailUrl,
    required this.audioUrl,
    required this.description,
    required this.duration,
  });

  factory Sermon.fromJson(Map<String, dynamic> json) {
    return Sermon(
      id: json['id']?.toString() ?? '',
      title: (json['title'] ?? '').toString(),
      preacher: (json['preacher'] ?? json['speaker'] ?? '').toString(),
      date: (json['date'] ?? json['sermonDate'] ?? '').toString(),
      thumbnailUrl: (json['thumbnailUrl'] ?? json['imageUrl'] ?? '').toString(),
      audioUrl: (json['audioUrl'] ?? '').toString(),
      description: (json['description'] ?? '').toString(),
      duration: json['duration']?.toString() ?? '',
    );
  }
}
