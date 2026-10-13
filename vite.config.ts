import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
    {
      name: 'inject-ios-meta',
      transformIndexHtml(html) {
        // Update or insert viewport meta with viewport-fit=cover
        if (html.includes('name="viewport"')) {
          html = html.replace(
            /<meta\s+name="viewport"[^>]*>/i,
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />'
          );
        } else {
          html = html.replace('</head>', '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />\n</head>');
        }
        // Inject PWA meta + icon + manifest tags before </head>
        html = html.replace(
          '</head>',
          `<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Parallel" />
<meta name="theme-color" content="#1E1714" />
<link rel="icon" href="/icon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/icon.svg" />
<link rel="manifest" href="/manifest.json" />
</head>`
        );
        return html;
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],
})
