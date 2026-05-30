class Leader {
  final String name;
  final String role;
  final String imageUrl;
  final String bio;

  Leader({
    required this.name,
    required this.role,
    required this.imageUrl,
    required this.bio,
  });

  factory Leader.fromJson(Map<String, dynamic> json) {
    return Leader(
      name: json['name'] ?? '',
      role: json['role'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      bio: json['bio'] ?? '',
    );
  }
}
