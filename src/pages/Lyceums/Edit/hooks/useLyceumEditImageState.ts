import { useEffect, useRef, useState } from "react";

import type { PendingLyceumImage } from "../types";

export const useLyceumEditImageState = () => {
  const [mainImage, setMainImage] = useState<PendingLyceumImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<PendingLyceumImage[]>([]);
  const [mainImageError, setMainImageError] = useState<string | null>(null);
  const [galleryImageError, setGalleryImageError] = useState<string | null>(
    null,
  );

  const imageStateRef = useRef({
    mainImage: null as PendingLyceumImage | null,
    galleryImages: [] as PendingLyceumImage[],
  });

  const clearImageState = (image: PendingLyceumImage | null) => {
    if (!image) return;
    URL.revokeObjectURL(image.previewUrl);
  };

  const replaceMainImage = (image: PendingLyceumImage | null) => {
    clearImageState(mainImage);
    setMainImage(image);
  };

  const addGalleryImages = (images: PendingLyceumImage[]) => {
    setGalleryImages((prev) => [...prev, ...images]);
  };

  const removeMainImage = () => {
    clearImageState(mainImage);
    setMainImage(null);
    setMainImageError(null);
  };

  const removeGalleryImage = (id: string) => {
    setGalleryImages((prev) => {
      const target = prev.find((image) => image.id === id);
      if (target) {
        clearImageState(target);
      }
      return prev.filter((image) => image.id !== id);
    });
  };

  const updateMainAltText = (value: string) => {
    setMainImage((prev) => (prev ? { ...prev, altText: value } : prev));
  };

  const updateGalleryAltText = (id: string, value: string) => {
    setGalleryImages((prev) =>
      prev.map((image) =>
        image.id === id ? { ...image, altText: value } : image,
      ),
    );
  };

  const updateImageState = (
    id: string,
    updates: Partial<PendingLyceumImage>,
  ) => {
    setMainImage((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev,
    );
    setGalleryImages((prev) =>
      prev.map((image) => (image.id === id ? { ...image, ...updates } : image)),
    );
  };

  const markImageError = (id: string, message: string) => {
    updateImageState(id, { status: "error", error: message });
  };

  useEffect(() => {
    imageStateRef.current = {
      mainImage,
      galleryImages,
    };
  }, [mainImage, galleryImages]);

  useEffect(() => {
    return () => {
      const current = imageStateRef.current;
      if (current.mainImage) {
        URL.revokeObjectURL(current.mainImage.previewUrl);
      }
      current.galleryImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, []);

  return {
    mainImage,
    galleryImages,
    mainImageError,
    galleryImageError,
    setMainImageError,
    setGalleryImageError,
    replaceMainImage,
    addGalleryImages,
    removeMainImage,
    removeGalleryImage,
    updateMainAltText,
    updateGalleryAltText,
    updateImageState,
    markImageError,
  };
};
