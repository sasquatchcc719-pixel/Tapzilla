import QRCode from "qrcode";

/** Render a URL to QR path data usable inside our card SVGs. */
export async function qrForUrl(url: string): Promise<{ path: string; size: number }> {
  const qr = QRCode.create(url, { errorCorrectionLevel: "M" });
  const size = qr.modules.size;
  let path = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (qr.modules.get(x, y)) path += `M${x} ${y}h1v1h-1z`;
    }
  }
  return { path, size };
}
