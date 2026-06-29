import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';

// Génère l'OG image au moment du build (compatible output: 'export').
export const dynamic = 'force-static';

export const alt = 'Invitation — Bar Mitsva Chmouel Journo · Dimanche 30 août 2026';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  // Lecture en build-time des assets locaux pour les embarquer dans l'image.
  const crownPath = path.join(process.cwd(), 'public/images/logo-chmouel-crown.png');
  const wordmarkPath = path.join(process.cwd(), 'public/images/wordmark-chmouel.png');
  const crownBase64 = `data:image/png;base64,${fs.readFileSync(crownPath).toString('base64')}`;
  const wordmarkBase64 = `data:image/png;base64,${fs.readFileSync(wordmarkPath).toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F6F1E6', // crème
          fontFamily: 'Georgia, serif',
          color: '#1C4D2C', // vert royal
          position: 'relative',
        }}
      >
        {/* Double filet doré en haut */}
        <div
          style={{
            position: 'absolute',
            top: 26,
            left: 60,
            right: 60,
            height: 1,
            background: '#C08E2C',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 33,
            left: 60,
            right: 60,
            height: 1,
            background: '#C08E2C',
          }}
        />
        {/* Double filet en bas */}
        <div
          style={{
            position: 'absolute',
            bottom: 26,
            left: 60,
            right: 60,
            height: 1,
            background: '#C08E2C',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 33,
            left: 60,
            right: 60,
            height: 1,
            background: '#C08E2C',
          }}
        />

        {/* Couronne dorée */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={crownBase64} alt="" width={150} height={100} style={{ marginBottom: 12 }} />

        {/* INVITATION en petites caps */}
        <div
          style={{
            fontSize: 22,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: '#C08E2C',
            marginBottom: 16,
          }}
        >
          Invitation
        </div>

        {/* BAR MITSVA */}
        <div
          style={{
            fontSize: 50,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#1C4D2C',
            fontWeight: 400,
            marginBottom: 22,
          }}
        >
          Bar Mitsva
        </div>

        {/* Wordmark CHMOUEL */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={wordmarkBase64} alt="" width={520} height={75} style={{ marginBottom: 24 }} />

        {/* Date en italique */}
        <div
          style={{
            fontSize: 30,
            fontStyle: 'italic',
            color: '#3a3a3a',
          }}
        >
          Dimanche 30 août 2026
        </div>
      </div>
    ),
    { ...size }
  );
}
