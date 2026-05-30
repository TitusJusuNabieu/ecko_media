# 📱 Ecko Media Mobile App

Flutter mobile application for Ecko Media 97.7 FM - Sierra Leone 🇸🇱

**See main project README:** `../README.md` for complete setup instructions.

---

## 🚀 Quick Start

```bash
# Install dependencies
flutter pub get

# Run on emulator/device
flutter run
```

---

## ⚙️ Configuration

Edit `lib/config.dart` to set API URL:

```dart
// For local development
static const String apiBaseUrl = 'http://localhost:3000/api';

// For Android emulator
static const String apiBaseUrl = 'http://10.0.2.2:3000/api';

// For physical device (use your computer's IP)
static const String apiBaseUrl = 'http://192.168.x.x:3000/api';

// For production
static const String prodApiUrl = 'https://yourdomain.com/api';
```

---

## 🎯 Features

- ✅ **Splash screen** with smooth animations
- ✅ **Onboarding flow** (4 screens) for first-time users
- ✅ Live radio streaming
- ✅ Browse programs & schedule
- ✅ Read sermons & articles
- ✅ Submit song requests
- ✅ Send shoutouts
- ✅ Contact ministry
- ✅ Make donations
- ✅ **Skeleton loaders** (animated loading states)
- ✅ **Empty states** (user-friendly messages when no data)
- ✅ **Error handling** with retry button
- ✅ Pull-to-refresh
- ✅ Offline fallback

### First Launch Experience

1. **Splash Screen** - Branded loading screen (3 seconds)
2. **Onboarding** - 4 informative screens (skip available)
   - Listen to Ecko Media
   - Browse Our Programs
   - Access Sermons & Articles
   - Connect with Us
3. **Home Screen** - Main app interface

**Note:** Onboarding shows only on first launch. To see it again, clear app data or use:
```dart
// In code
final prefs = await SharedPreferences.getInstance();
await prefs.remove('onboarding_complete');
```

---

## 🎨 New Widgets

### Skeleton Loaders (`lib/widgets/skeleton_loader.dart`)

```dart
import '../widgets/skeleton_loader.dart';

// Use in your screens
ListItemSkeleton()      // For list items
CardSkeleton()          // For cards
GridItemSkeleton()      // For grid items
```

### Empty States (`lib/widgets/empty_state.dart`)

```dart
import '../widgets/empty_state.dart';

// Predefined empty states
EmptySermons(onRetry: _loadSermons)
EmptyNews(onRetry: _loadNews)
EmptySchedule(onRetry: _loadSchedule)
ErrorState(message: 'Error message', onRetry: _retry)
NoConnection(onRetry: _retry)
```

---

## 🔄 Pattern for Loading/Empty States

See `lib/screens/sermons_screen_updated.dart` for complete example.

```dart
Widget _buildContent() {
  // 1. Show skeleton while loading
  if (_isLoading) {
    return ListView.builder(
      itemCount: 5,
      itemBuilder: (context, index) => const ListItemSkeleton(),
    );
  }

  // 2. Show error state
  if (_error != null) {
    return ErrorState(
      message: 'Failed to load data',
      onRetry: _loadData,
    );
  }

  // 3. Show empty state
  if (_data.isEmpty) {
    return EmptySermons(onRetry: _loadData);
  }

  // 4. Show actual content
  return RefreshIndicator(
    onRefresh: _loadData,
    child: ListView.builder(
      itemCount: _data.length,
      itemBuilder: (context, index) => _buildItem(_data[index]),
    ),
  );
}
```

**Apply this pattern to:**
- `news_screen.dart`
- `schedule_screen.dart`
- Any screen fetching data from API

---

## 🛠️ Commands

```bash
flutter run                    # Run app
flutter run --release          # Release mode
flutter build apk              # Build Android
flutter build ios              # Build iOS
flutter test                   # Run tests
flutter clean                  # Clean project
```

---

## 📱 Testing Tips

**Android Emulator:**
- Use `http://10.0.2.2:3000/api` in config

**Physical Device:**
1. Enable USB Debugging
2. Find your computer's IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
3. Update config: `http://YOUR_IP:3000/api`
4. Run: `flutter run`

---

## 🐛 Common Issues

**"No devices found"**
```bash
flutter devices
flutter doctor
```

**"Network error"**
- Check API URL in `lib/config.dart`
- Verify backend is running: `cd ../web && npm run dev`
- For emulator: use `10.0.2.2` not `localhost`

**"Build failed"**
```bash
flutter clean
flutter pub get
```

---

## 📚 Full Documentation

See main project README for complete documentation:
- **Setup:** `../README.md#quick-start`
- **API Docs:** `../README.md#api-documentation`
- **Deployment:** `../README.md#production-deployment`
- **Troubleshooting:** `../README.md#troubleshooting`

---

**Ecko Media 97.7 FM** 🎙️  
*Broadcasting stories that matter across Sierra Leone* 🇸🇱
