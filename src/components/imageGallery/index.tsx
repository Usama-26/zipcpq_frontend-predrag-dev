import React, {useState} from 'react';
import Image from 'next/image';

const ImageGallery = ({mainImage, thumbnailImages}: any) => {
  const [currentImage, setCurrentImage] = useState(mainImage);

  const previousImage = () => {
    const currentIndex = thumbnailImages.indexOf(currentImage);
    const previousIndex =
      currentIndex === 0 ? thumbnailImages.length - 1 : currentIndex - 1;
    setCurrentImage(thumbnailImages[previousIndex]);
  };

  const nextImage = () => {
    const currentIndex = thumbnailImages.indexOf(currentImage);
    const nextIndex =
      currentIndex === thumbnailImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentImage(thumbnailImages[nextIndex]);
  };

  return (
    <div className="flex md:flex-row  flex-col justify-between gap-4">
      <div className="bg-[#FAF8F8] p-5">
        <img
          src={currentImage}
          className="mx-auto h-[320px] w-[320px] object-contain"
        />
      </div>
      <div className="flex md:flex-col justify-between mx-auto">
        <button
          className="p-2 mb-2 md:rotate-0 -rotate-90"
          onClick={previousImage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transform rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex md:flex-col flex-row">
          {thumbnailImages.map((thumbnail: any, index: any) => (
            <button
              key={index}
              onClick={() => setCurrentImage(thumbnail)}
              className="mb-3 border"
            >
              <Image
                src={thumbnail}
                width={50}
                height={50}
                className="rounded-lg"
                alt="product-image"
              />
            </button>
          ))}
        </div>
        <button className="p-2 mt-2 md:rotate-0 -rotate-90" onClick={nextImage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;
