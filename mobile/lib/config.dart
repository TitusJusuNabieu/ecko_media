class Config {
  // API Configuration
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000/api',
  );
  
  // Production URL
  static const String prodApiUrl = 'https://www.eckomedia.sl/api';
  
  // Use production URL in release mode
  static String get baseUrl {
    const bool isProduction = bool.fromEnvironment('dart.vm.product');
    return isProduction ? prodApiUrl : apiBaseUrl;
  }
  
  // App Configuration
  static const String appName = 'Ecko Media';
  static const String appVersion = '1.0.0';
  
  // Ministry Details
  static const String ministryName = 'Ecko Media';
  static const String radioFrequency = '97.7 FM';
  static const String location = 'Bo, Sierra Leone';
  
  // Contact Information
  static const String supportEmail = 'info@eckomedia.sl';
  static const String supportPhone = '+232 78 051555';
  static const String supportPhone2 = '+232 99 051555';
  
  // Social Media
  static const String facebookUrl = 'https://facebook.com/eckomedia';
  static const String instagramUrl = 'https://instagram.com/eckomedia';
  static const String twitterUrl = 'https://twitter.com/eckomedia';
  static const String youtubeUrl = 'https://youtube.com/@eckomedia';
  static const String websiteUrl = 'https://www.eckomedia.sl';
  
  // Donation Methods
  static const String orangeMoneyNumber = 'XXX XXX XXXX';
  static const String afrimoneyNumber = 'XXX XXX XXXX';
  
  // Streaming (update with your AzuraCast URL)
  static const String defaultStreamUrl = 'http://your-azuracast-ip:8000/radio.mp3';
}
