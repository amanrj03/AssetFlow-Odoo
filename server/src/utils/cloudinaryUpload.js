const streamifier = require("streamifier");
  const cloudinary = require("../config/cloudinary");

  const uploadBuffer = (buffer, folder = "assets") => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  };

  module.exports = {
    uploadBuffer,
  };
