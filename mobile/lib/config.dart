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
  
  // Media House Details
  static const String ministryName = 'Ecko Media';
  static const String radioFrequency = '104.3 FM';
  static const String location = 'Freetown, Sierra Leone';
  static const String address = '48 Siaka Stevens Street, Freetown, Sierra Leone';
  static const String tagline = 'Connecting Voices';

  // Contact Information
  static const String supportEmail = 'eckomedia3@gmail.com';
  static const String supportPhone = '076946946';
  static const String supportPhone2 = '+13464936503';
  
  // Social Media
  static const String facebookUrl = 'https://www.facebook.com/eckomedia232';
  static const String instagramUrl = 'https://instagram.com/eckomedia';
  static const String twitterUrl = 'https://twitter.com/eckomedia';
  static const String youtubeUrl = 'https://youtube.com/@eckomedia';
  static const String websiteUrl = 'https://www.eckomedia.sl';
  
  // Donation Methods
  static const String orangeMoneyNumber = 'XXX XXX XXXX';
  static const String afrimoneyNumber = 'XXX XXX XXXX';
  
  // Streaming (update with your AzuraCast URL)
  static const String defaultStreamUrl = 'http://stream.eckomedia.sl:8000/live.mp3';
}
