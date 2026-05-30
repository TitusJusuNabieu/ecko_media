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
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      preacher: json['preacher'] ?? '',
      date: json['date'] ?? '',
      thumbnailUrl: json['thumbnailUrl'] ?? '',
      audioUrl: json['audioUrl'] ?? '',
      description: json['description'] ?? '',
      duration: json['duration'] ?? '',
    );
  }
}
