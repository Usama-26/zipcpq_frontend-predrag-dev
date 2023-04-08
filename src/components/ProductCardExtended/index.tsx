import {TProduct} from '_types/types';
import Image from 'next/image';
import {Suspense} from 'react';

interface IProductCardExtendedProps {
  product: TProduct;
}

export default function ProductCardExtended({
  product,
}: IProductCardExtendedProps) {
  return (
    <div className="flex flex-col gap-y-1">
      <div className=" transition-transform duration-100 hover:bg-[#EEEAEA] p-2 rounded-md ">
        <div className="w-full flex md:flex-row flex-col justify-between items-center rounded-md py-5 px-4 pr-0 font-poppins text-black border bg-white cursor-pointer ">
          <div className="md:basis-3/5 basis-full md:order-1 order-2 md:py-0 py-4">
            <h1 className="md:text-2xl text-xl font-bold">{product.title}</h1>
            <div className="my-2">
              {product?.product_identifiers?.map(identifier => (
                <Suspense key={identifier.id}>
                  <span>
                    {identifier.pi.short_name} # {identifier.value}
                  </span>
                  <br />
                </Suspense>
              ))}

              <span>Compare to BSA04120000FM</span>
            </div>
            <p className="mb-8 md:text-base text-sm font-poppins">
              {product.description}
            </p>
            <div className="flex gap-3 font-poppins">
              <button className="px-5 py-1 bg-[#5B5B5B] rounded-lg font-medium border border-transparent text-white hover:text-black sm:text-base text-sm hover:border-black hover:bg-white transition duration-200 ">
                Learn More
              </button>
              <button className="px-5 py-1 text-black rounded-lg font-medium border border-transparent bg-yellow-700 hover:border-black sm:text-base text-sm hover:bg-white transition duration-200 ">
                Quote Now
              </button>
            </div>
          </div>
          <div className="md:basis-2/5 basis-full md:order-2 order-1 md:py-0 py-4">
            <Image
              // src={`/images/products/${'bobst-large'}.png`}
              src={`${
                product.product_medias && product.product_medias.length > 0
                  ? process.env.NEXT_PUBLIC_MEDIA_BASE_PATH! +
                    product.product_medias[0].media?.path
                  : `/images/products/${'bobst-large'}.png`
              }`}
              alt={'Product Image'}
              width={350}
              height={200}
              className={'h-full object-contain'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
