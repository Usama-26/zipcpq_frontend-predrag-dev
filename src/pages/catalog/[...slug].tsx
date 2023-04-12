import ProductCard from '@/components/ProductCard';
import {Tab} from '@headlessui/react';
import {ChevronRightIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';
import {Splide, SplideSlide} from '@splidejs/react-splide';
import dynamic from 'next/dynamic';
import ImageGallery from '../../components/imageGallery';

import '@splidejs/react-splide/css';
import {useState} from 'react';
import {TBreadCrumb} from '_types/ui';
import {setLicenseDB} from 'server/db';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import productModel from 'server/models/productModel';
import categoryModel from 'server/models/categoryModel';
const ProductDetail = dynamic(
  () => import('@/modules/Product/ProductDetail'),
  {}
);
const HomeLayout = dynamic(() => import('@/layouts/HomeLayout'), {});

export default function Index({
  product,
  breadcrumb,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('product', product);

  return (
    <HomeLayout breadcrumb={breadcrumb}>
      <ProductDetail product={product} />
    </HomeLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({query, req}) => {
  console.log('query', query);

  const {slug} = query;
  if (!(await setLicenseDB(req.headers.host)) || !(slug?.length === 2)) {
    return {
      notFound: true,
    };
  }
  const product = await productModel.findFirst({
    where: {slug: slug[1] as string},
    withJoins: [
      'pt',
      'product_identifiers',
      'product_medias',
      'related_products',
    ],
  });
  const category = await categoryModel.findFirst({
    where: {slug: slug[0] as string},
    withJoins: ['parent', 'children'],
  });
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
  });

  breadcrumb.push({
    title: product?.title || '',
    url: '/catalog/' + category.slug + product?.slug,
    active: true,
  });

  return {
    props: {
      product,
      breadcrumb,
    },
  };
};
