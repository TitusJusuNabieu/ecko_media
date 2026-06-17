class Program {
  final String id;
  final String title;
  final String host;
  final String startTime;
  final String endTime;
  final String description;
  final String day;
  final String category;
  final Map<String, dynamic>? scheduleJson;

  Program({
    required this.id,
    required this.title,
    required this.host,
    required this.startTime,
    required this.endTime,
    required this.description,
    required this.day,
    required this.category,
    this.scheduleJson,
  });

  bool hasDay(String dayName) {
    if (scheduleJson == null) return day == dayName;
    final slot = scheduleJson![dayName];
    return slot != null;
  }

  String getStartTimeForDay(String dayName) {
    if (scheduleJson == null) return startTime;
    final slot = scheduleJson![dayName];
    if (slot is Map) return (slot['start'] ?? startTime).toString();
    return startTime;
  }

  String getEndTimeForDay(String dayName) {
    if (scheduleJson == null) return endTime;
    final slot = scheduleJson![dayName];
    if (slot is Map) return (slot['end'] ?? endTime).toString();
    return endTime;
  }

  factory Program.fromJson(Map<String, dynamic> json) {
    String startTime = (json['startTime'] ?? '').toString();
    String endTime = (json['endTime'] ?? '').toString();
    String day = (json['day'] ?? '').toString();
    Map<String, dynamic>? scheduleJson;

    final dynamic rawSchedule = json['schedule'];
    if (rawSchedule is Map<String, dynamic>) {
      scheduleJson = rawSchedule;
      if (startTime.isEmpty && scheduleJson.isNotEmpty) {
        final firstDay = scheduleJson.keys.first;
        final slot = scheduleJson[firstDay];
        if (slot is Map) {
          startTime = (slot['start'] ?? '').toString();
          endTime = (slot['end'] ?? '').toString();
          day = firstDay;
        }
      }
    }

    return Program(
      id: json['id']?.toString() ?? '',
      title: (json['title'] ?? json['name'] ?? '').toString(),
      host: (json['host'] ?? json['hostName'] ?? json['host_name'] ?? '').toString(),
      startTime: startTime,
      endTime: endTime,
      description: (json['description'] ?? '').toString(),
      day: day,
      category: (json['category'] ?? '').toString(),
      scheduleJson: scheduleJson,
    );
  }
}
