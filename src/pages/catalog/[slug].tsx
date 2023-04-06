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
import {FilterBox} from '@/components/FilterBox';

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
      <div className="mx-2 md:self-start">
        <div className="flex justify-between items-center mx-2 pb-4 relative">
          <Typography varient={ETypographyVarient.H2} className="font-medium">
            {category?.name}
          </Typography>
          <div className="mt-5"></div>
          <FilterBox dummyVariants={dummyVariants} />
        </div>
        <p className="mb-4 mx-2">
          {
            "Conway produces high quality gripper bars and related products that are interchangeable with the original manufacturer's product but at better price."
          }
        </p>
        <div className="md:h-[720px] md:overflow-y-scroll ">
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
