import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    proxy: {
      '/download-zip': {
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            if (req.url === '/download-zip') {
              const jsonData = JSON.stringify({ message: "Hello, world!", status: 200 }, null, 2);

              import('jszip').then(JSZipModule => {
                const JSZip = JSZipModule.default;
                const zip = new JSZip();
                zip.file("data.json", jsonData);
                zip.generateAsync({ type: "blob" })
                  .then(function(content) {
                    const url = URL.createObjectURL(content);
                    res.setHeader('Content-Disposition', 'attachment; filename="data.zip"');
                    res.setHeader('Content-Type', 'application/zip');
                    res.writeHead(200);

                    const reader = new FileReader();
                    reader.onload = () => {
                      res.end(Buffer.from(reader.result as ArrayBuffer));
                      URL.revokeObjectURL(url);
                    };
                    reader.readAsArrayBuffer(content);
                  });
              })
            }
          })
        }
      }
    }
  }
})
