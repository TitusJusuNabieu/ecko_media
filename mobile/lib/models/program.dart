class Program {
  final String id;
  final String title;
  final String host;
  final String startTime;
  final String endTime;
  final String description;
  final String day;
  final String category;

  Program({
    required this.id,
    required this.title,
    required this.host,
    required this.startTime,
    required this.endTime,
    required this.description,
    required this.day,
    required this.category,
  });

  factory Program.fromJson(Map<String, dynamic> json) {
    return Program(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      host: json['host'] ?? '',
      startTime: json['startTime'] ?? '',
      endTime: json['endTime'] ?? '',
      description: json['description'] ?? '',
      day: json['day'] ?? '',
      category: json['category'] ?? '',
    );
  }
}
