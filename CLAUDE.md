# Pet Portrait AI — Build Checklist

## Before every iOS build
1. Check last submitted build number on App Store Connect
2. Increment `ios.buildNumber` in `app.config.js` (e.g., 1→2→3)
3. Commit + push → GitHub Actions auto-builds

## Before every TestFlight submit
1. Wait for GitHub Actions build to finish (green)
2. Run: `eas submit --platform ios --id <build-id> --profile production`
3. If "build number already used" error → increment build number, rebuild, resubmit

## Architecture
- Framework: Expo SDK 54 + expo-router
- AI: Volcengine Doubao Seedream 5.0 Lite (img2img)
- Build: GitHub Actions → EAS cloud
- Submit: EAS → TestFlight
