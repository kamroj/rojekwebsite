export const RESOURCE_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
};

// Determine the resource type by file extension.
export const getResourceType = (url) => {
  const extension = String(url).split('.').pop().toLowerCase();

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
    return RESOURCE_TYPES.IMAGE;
  }

  if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(extension)) {
    return RESOURCE_TYPES.VIDEO;
  }

  if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
    return RESOURCE_TYPES.AUDIO;
  }

  // Default: treat as image.
  return RESOURCE_TYPES.IMAGE;
};
