// src/services/sanity/image.js
import imageUrlBuilder from '@sanity/image-url';
import { getSanityClient } from './client';

let _builder = null;

const getBuilder = () => {
  if (_builder) return _builder;
  const client = getSanityClient();
  if (!client) return null;
  _builder = imageUrlBuilder(client);
  return _builder;
};

export const urlForImage = (source) => {
  if (!source) return null;
  const builder = getBuilder();
  if (!builder) return null;
  return builder.image(source);
};

