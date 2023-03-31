/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import HomeLayout from '@/layouts/HomeLayout';
import Image from 'next/image';
import Link from 'next/link';
import categories from '../../json/categories.json';
export default function Catalog() {
  return (
    <HomeLayout>
      <div>
        <h4 className="mt-5 pb-6">
          Choose a category to browse Conway product for that machine
        </h4>
        <div className="h-[740px] overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {/* Card */}
          {categories.map(category => {
            return (
              <Link
                key={category.name}
                href={{
                  pathname: `/catalog/${category.name.toLowerCase()}`,
                  query: category,
                }}
                as={`/catalog/${category.name.toLowerCase()}`}
                className="p-2 rounded hover:bg-neutral-600/10 transition-transform duration-500 zoomUP"
              >
                <div className="rounded border border-[#c0c0c0]">
                  <div className="relative h-36 bg-white rounded">
                    <Image
                      src={`/images/products/${category.image}.png`}
                      width={200}
                      height={120}
                      alt={'Product Name'}
                      className={'h-full object-contain'}
                    />
                    <div className="overlay absolute flex w-full h-full top-0 left-0 items-center justify-center hover:bg-gray-100/50 transition duration-500">
                      <div className="rounded-full p-6 bg-yellow-700/75 transition-all duration-500  opacity-0">
                        <Image
                          src={'/icons/arrow-forward.png'}
                          width={40}
                          height={40}
                          alt={'Forward Link Arrow'}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-700 py-1 text-black">
                    <h2 className="text-center uppercase">{category.name}</h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </HomeLayout>
  );
}
