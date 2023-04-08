/* eslint-disable prettier/prettier */
import Image from 'next/image';

export default function ProductCard() {
  return (
    <div className=" rounded-md border border-[#C0C0C0] mx-auto ">
      <div className="p-4">
        <Image
          src="/images/products/gear.png"
          width={332}
          height={282}
          alt="Product Image"
          className="mx-auto"
        />
      </div>
      <h1 className="text-center font-medium py-3 border-y border-black">
        Conway Gripper Bar Chain
      </h1>
      <p className="my-6 text-center">
        Conway Roller Drive Chain used in conjunction with the gripper bars in
        varius Bobst Die Cutters
      </p>
      <div className=" pb-6">
        <button className=" block w-4/5 mx-auto px-5 py-1.5 text-black rounded-lg font-medium border bg-yellow-700 border-black  transition duration-200 hover:font-bold">
          Learn more
        </button>
      </div>
    </div>
  );
}
