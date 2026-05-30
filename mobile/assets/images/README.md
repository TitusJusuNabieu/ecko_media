# Assets Folder

## Logo Image

Place your logo image here as `logo.png` (recommended size: 512x512px).

For now, the app uses the radio icon from Material Icons. 

To add your custom logo:

1. Add your logo image: `assets/images/logo.png`
2. Run: `flutter pub run flutter_native_splash:create`

## Image Specifications

- **Format:** PNG with transparent background
- **Size:** 512x512px (for best quality)
- **Splash Screen:** Will be shown on app launch
- **App Icon:** Use same logo for app icon

## Generating App Icon

If you want to use the logo as app icon:

1. Install: `flutter pub add flutter_launcher_icons`
2. Add to `pubspec.yaml`:
```yaml
flutter_launcher_icons:
  android: true
  ios: true
  image_path: "assets/images/logo.png"
```
3. Run: `flutter pub run flutter_launcher_icons`
