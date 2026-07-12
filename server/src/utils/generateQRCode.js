const QRCode = require("qrcode");
const { uploadBuffer } = require("./cloudinaryUpload");

const generateQRCode = async (text) => {
  try {
    const buffer = await QRCode.toBuffer(text, {
      errorCorrectionLevel: "H",
      type: "png",
      margin: 1,
      width: 300,
    });

    const result = await uploadBuffer(buffer, "qrcodes");
    return result.secure_url;
  } catch (error) {
    console.error("QR Code generation or upload failed:", error);
    throw new Error("Failed to generate and upload QR code.");
  }
};

module.exports = generateQRCode;
