# Pet Portrait AI

An Expo SDK 54 mobile app that creates occasion-based pet portraits.

## Local development

1. Copy `.env.example` to `.env`.
2. Set `ARK_API_KEY`.
3. Start Expo with `npm start`.

The app uses the original direct Volcengine API setup. EAS builds read
`ARK_API_KEY` from the existing build environment.

## Store products

Create matching consumable in-app products in both App Store Connect and Google
Play Console:

| Product ID | Credits | Suggested price |
| --- | ---: | ---: |
| `gen_10_1` | 10 | $0.99 |
| `gen_30` | 30 | $1.99 |
| `gen_60` | 60 | $2.99 |

Prices displayed by the app come from the store when available. The values in
code are offline fallbacks. Free usage, credits, processed purchase IDs, and
basic funnel events are stored locally on the device.

## Store assets

Run `npm run store:assets` to rebuild the five 1290×2796 screenshots,
1080×1920 video slides, and the 1024×500 Google Play feature graphic from the
approved source portraits in `store-assets/source`.
