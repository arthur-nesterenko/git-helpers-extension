# Git Helpers — Chrome Extension

Convert ticket names into clean, valid Git branch names. Supports snake_case and kebab-case formats with Latin diacritics normalization.

**[Install from Chrome Web Store](https://chromewebstore.google.com/detail/git-helpers/ihcgpcnhoigonkjamphfccejbaepdmam)**

<!-- TODO: Add screenshot -->

## Features

- Convert any ticket name to a valid Git branch name
- Snake case (`proj_123_create_profile`) or kebab case (`proj-123-create-profile`)
- Latin diacritics normalization (e→e, u→u, n→n)
- One-click copy for branch name or `git checkout -b` command
- Dark mode with system preference detection
- Settings persist between sessions

## Install

### Chrome Web Store

Install directly from the [Chrome Web Store listing](https://chromewebstore.google.com/detail/git-helpers/ihcgpcnhoigonkjamphfccejbaepdmam).

### Manual (from GitHub Releases)

1. Download the latest `git-helpers-vX.X.X.zip` from [Releases](../../releases)
2. Unzip the file
3. Go to `chrome://extensions/`
4. Enable **Developer mode** (top right)
5. Click **Load unpacked** and select the unzipped folder

## Development

```bash
# Install dependencies
npm install

# Watch mode (rebuilds on file changes)
npm run watch

# Run tests
npm test

# Production build
npm run build
```

To test locally:

1. Run `npm run build`
2. Go to `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `dist/` folder

## Release

```bash
git tag v2.0.0
git push origin v2.0.0
```

This triggers a GitHub Action that runs tests, builds, and creates a GitHub Release with a zip file. Download the zip and upload it to the Chrome Web Store manually.

## License

MIT
