const parseCloudinaryUrl = (value?: string) => {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== 'cloudinary:') {
      return null;
    }

    return {
      cloudName: url.hostname || '',
      apiKey: decodeURIComponent(url.username || ''),
      apiSecret: decodeURIComponent(url.password || ''),
    };
  } catch {
    return null;
  }
};

const sanitizeCloudinaryValue = (value?: string) => value?.trim() || '';

export default () => {
  const parsedUrl = parseCloudinaryUrl(process.env.CLOUDINARY_URL);

  return {
    cloudinary: {
      cloudName: sanitizeCloudinaryValue(
        process.env.CLOUDINARY_CLOUD_NAME || parsedUrl?.cloudName,
      ),
      apiKey: sanitizeCloudinaryValue(
        process.env.CLOUDINARY_API_KEY || parsedUrl?.apiKey,
      ),
      apiSecret: sanitizeCloudinaryValue(
        process.env.CLOUDINARY_API_SECRET || parsedUrl?.apiSecret,
      ),
      folder: sanitizeCloudinaryValue(process.env.CLOUDINARY_FOLDER) || 'portfolio',
    },
  };
};
