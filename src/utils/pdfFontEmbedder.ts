let cachedEmbeddedFontCss: string | null = null;

const GOOGLE_FONTS_CSS_URL =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Fetches Google Fonts CSS and inlines all remote .woff2/.ttf font files as base64 data URLs.
 * Passing the returned string as `fontEmbedCSS` to `html-to-image` avoids reading `document.styleSheets`
 * (preventing CORS SecurityError) while guaranteeing 100% identical font rendering in the exported PDF.
 */
export async function getEmbeddedGoogleFontsCss(): Promise<string> {
  if (cachedEmbeddedFontCss !== null) {
    return cachedEmbeddedFontCss;
  }

  try {
    const cssResponse = await fetch(GOOGLE_FONTS_CSS_URL, { mode: 'cors' });
    if (!cssResponse.ok) {
      cachedEmbeddedFontCss = '';
      return '';
    }
    let cssText = await cssResponse.text();

    // Find all url(...) in @font-face rules
    const urlRegex = /url\((['"]?)(https:\/\/[^)'"]+)\1\)/g;
    const matches = Array.from(cssText.matchAll(urlRegex));
    const uniqueUrls = Array.from(new Set(matches.map((m) => m[2])));

    await Promise.all(
      uniqueUrls.map(async (fontUrl) => {
        try {
          const fontResp = await fetch(fontUrl, { mode: 'cors', cache: 'force-cache' });
          if (!fontResp.ok) return;
          const buf = await fontResp.arrayBuffer();
          const b64 = arrayBufferToBase64(buf);
          const mime = fontUrl.includes('.woff2')
            ? 'font/woff2'
            : fontUrl.includes('.woff')
            ? 'font/woff'
            : 'font/truetype';
          const dataUrl = `data:${mime};base64,${b64}`;
          cssText = cssText.split(fontUrl).join(dataUrl);
        } catch {
          // Keep original URL if individual font fetch fails
        }
      })
    );

    cachedEmbeddedFontCss = cssText;
    return cssText;
  } catch {
    cachedEmbeddedFontCss = '';
    return '';
  }
}
