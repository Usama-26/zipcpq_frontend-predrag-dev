import {IMAGE_PLACEHOLDER} from '_constant';
import {TProduct} from '_types/types';
import Image from 'next/image';

interface IProductCardProps {
  product: TProduct;
}

export default function ProductCard({product}: IProductCardProps) {
  return (
    <div className=" rounded-md border border-[#C0C0C0] mx-auto ">
      <div className="p-4">
        <Image
          src={
            product.product_medias &&
            product?.product_medias[0] &&
            product?.product_medias[0].media
              ? process.env.NEXT_PUBLIC_MEDIA_BASE_PATH! +
                product?.product_medias[0].media.path
              : IMAGE_PLACEHOLDER
          }
          width={332}
          height={282}
          alt="Product Image"
          className="mx-auto"
        />
      </div>
      <h1 className="text-center font-medium py-3 border-y border-black">
        {product.title}
      </h1>
      <p className="my-6 text-center">{product.short_description}</p>
      <div className=" pb-6">
        <button className=" block w-4/5 mx-auto px-5 py-1.5 text-black rounded-lg font-medium border bg-yellow-700 border-black  transition duration-200 hover:font-bold">
          Learn more
        </button>
      </div>
    </div>
  );
}
