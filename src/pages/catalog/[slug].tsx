/* eslint-disable prettier/prettier */
import ProductCardExtended from '@/components/ProductCardExtended';
import HomeLayout from '@/layouts/HomeLayout';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {Dialog, Popover, Transition} from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Fragment, useState} from 'react';
import CategoryCard from '@/components/CategoryCard';
import {setLicenseDB} from 'server/db';
import categoryModel from 'server/models/categoryModel';
import productModel from 'server/models/productModel';
import {TBreadCrumb} from '_types/ui';
import Typography from '@/components/Typography';
import {ETypographyVarient} from '_enums/ui';

export default function Index({
  products,
  sidebarCategories,
  breadcrumb,
  category,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('category', category);
  const router = useRouter();
  const {name, variants, image}: any = router.query;
  const dummyVariants = [106, 109, 96, 100, 20, 200, 321, 521, 512];
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const openModal = () => {
    setFilterModalOpen(true);
  };

  const closeModal = () => {
    setFilterModalOpen(false);
  };

  return (
    <HomeLayout
      sidebarCategories={sidebarCategories}
      breadcrumb={breadcrumb}
      showSideBar={true}
    >
      <div className="mx-2 self-start">
        <div className="flex justify-between items-center mx-2 pb-4 relative">
          <Typography varient={ETypographyVarient.H2} className="font-medium">
            {category?.name}
          </Typography>
          <div className="mt-5"></div>
          <Popover>
            {({open}) => (
              <>
                <Popover.Button className="inline-flex items-center gap-2 rounded-md border px-4 py-1 hover:text-black hover:border-black hover:bg-yellow-700">
                  <Image
                    src={'/icons/filter.png'}
                    height={18}
                    width={18}
                    alt={'Filter Icon'}
                  />
                  <span>Filter</span>
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute bg-white z-10 max-w-sm px-6 py-4 rounded-md right-0 shadow border mt-2">
                    <h3>Choose the model number of your Bobst die cutter</h3>

                    <div className="flex flex-col flex-wrap max-h-56 my-4 ">
                      {dummyVariants?.map((variant: any) => {
                        return (
                          <label
                            key={variant}
                            htmlFor={variant}
                            className="inline-flex gap-2 py-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="checkbox rounded border-2"
                              id={variant}
                            />
                            <span className="font-medium">{variant}</span>
                          </label>
                        );
                      })}
                    </div>

                    <button className="px-10 float-right py-2 bg-[#5B5B5B] rounded-lg font-medium border border-transparent text-white hover:text-black text-lg hover:border-black hover:bg-white transition duration-200 -translate-y-4">
                      Filter
                    </button>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
        <p className="mb-4 mx-2">
          {
            "Conway produces high quality gripper bars and related products that are interchangeable with the original manufacturer's product but at better price."
          }
        </p>
        <div className="h-[720px] overflow-y-scroll ">
          <Link href="/product/product_id">
            <ProductCardExtended />
            <ProductCardExtended />
            <ProductCardExtended />
            <ProductCardExtended />
          </Link>
        </div>
      </div>
    </HomeLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({query, req}) => {
  const {slug} = query;
  if (!(await setLicenseDB(req.headers.host))) {
    return {
      notFound: true,
    };
  }
  const category = await categoryModel.findFirst({
    where: {slug: slug as string},
    withJoins: ['parent'],
  });
  console.log('category', category);
  const breadcrumb: TBreadCrumb[] = [
    {
      title: 'Product Catalog',
      url: '/catalog',
    },
  ];
  if (category.parent) {
    breadcrumb.push({
      title: category.parent.name,
      url: '/catalog/' + category.parent.slug,
    });
  }

  breadcrumb.push({
    title: category.name,
    url: '/catalog/' + category.slug,
    active: true,
  });

  return {
    props: {
      products: await productModel.find({
        withJoins: ['created', 'pt'],
        where: {category_slugs: [slug as string]},
      }),
      sidebarCategories: await categoryModel.getCategoriesHierarchy({}),
      breadcrumb,
      category,
    },
  };
};
