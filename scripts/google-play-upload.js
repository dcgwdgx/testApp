#!/usr/bin/env node
const { writeFileSync, readFileSync, createReadStream } = require('fs');
const { JWT } = require('google-auth-library');
const { google } = require('googleapis');

const AAB_PATH = process.argv[2];
const PACKAGE = 'com.petportrait.ai';
const KEY_FILE = '/tmp/google-play-key.json';

if (!AAB_PATH) {
  console.error('Usage: node google-play-upload.js <aab_path>');
  process.exit(1);
}

(async () => {
  const key = JSON.parse(readFileSync(KEY_FILE, 'utf8'));
  const auth = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });

  const publisher = google.androidpublisher({ version: 'v3', auth });

  console.log('Creating Play Store edit...');
  const edit = await publisher.edits.insert({ packageName: PACKAGE });
  const editId = edit.data.id;
  console.log('Edit ID:', editId);

  console.log('Uploading AAB...');
  const result = await publisher.edits.bundles.upload({
    packageName: PACKAGE,
    editId,
    media: { body: createReadStream(AAB_PATH) },
  });
  console.log('Bundle uploaded:', JSON.stringify(result.data));

  console.log('Setting track to production...');
  await publisher.edits.tracks.update({
    packageName: PACKAGE,
    editId,
    track: 'production',
    requestBody: { releases: [{ status: 'completed', versionCodes: [String(result.data.versionCode)] }] },
  });

  console.log('Committing edit...');
  await publisher.edits.commit({ packageName: PACKAGE, editId });
  console.log('SUCCESS — app submitted to Google Play production track.');
})().catch((err) => {
  console.error('Upload failed:', err.message);
  process.exit(1);
});
