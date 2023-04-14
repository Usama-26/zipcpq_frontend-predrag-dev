import {Button} from '@/components/Button';
import {TextInput} from '@/components/Form';
import {RHFTextField} from '@/components/HookForm';
import Modal from '@/components/Modal';
import HomeLayout from '@/layouts/HomeLayout';
import SidebarAccounts from '@/layouts/components/SidebarAccounts';
import Image from 'next/image';
import {useState} from 'react';

export default function DeactivateAccount() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  return (
    <HomeLayout>
      <>
        <SidebarAccounts />
        <div className="h-[700px] basis-full">
          <div className="mb-7">
            <h1>
              <span className="font-bold text-xl text-zinc-700 border-r border-r-zinc-700 pr-2">
                My Account
              </span>
              <span className="text-yellow-700 ml-4"> Hello, Emma Smith</span>
            </h1>
          </div>
          <div className=" rounded-md border text-black border-[#c0c0c0] p-10  h-[550px] overflow-auto">
            <div className="text-sm">
              <h2 className="text-xl font-bold mb-4">
                Delete or deactivate account
              </h2>
              <p>
                Deleting your account will permanently erase all of your data
                from our system, and you will no longer be able to access your
                profile, RFQs, or any other content associated with your
                account. This action is permanent and cannot be undone.
              </p>
              <p>Deleting account will do following:</p>
              <ul className="list-disc ml-6">
                <li>Log you out on all devices</li>
                <li>Delete all your account information.</li>
              </ul>
              <br />
              <p>
                On the other hand, deactivating your account will temporarily
                suspend your account and remove your profile and content.
                However, your data will remain stored in our system and can be
                reactivated at any time by logging back in to your account.
              </p>
              <p>
                {`If you are unsure about whether to delete or deactivate your
                account, we recommend deactivating your account first. This will
                allow you to take a break from our platform without losing your
                data or having to create a new account if you decide to come
                back later. However, if you are certain that you want to
                permanently delete your account, please select the 'Delete
                Account' option.`}
              </p>
            </div>
            <div className="text-right mt-24">
              <Button
                onClick={e => {
                  e.preventDefault();
                  setIsConfirmModalOpen(true);
                }}
                className="rounded-md mr-2 bg-gray-50 shadow-none text-[#717284] text-sm border border-[#c0c0c0] hover:text-white hover:!bg-zinc-700"
              >
                Delete Account
              </Button>
              <Button className="rounded-md shadow-none bg-yellow-700 text-black text-sm hover:text-white hover:!bg-zinc-700">
                Deactivate Account
              </Button>
            </div>
          </div>
        </div>
        <Modal
          header="To deactivate, enter your password"
          open={isConfirmModalOpen}
          setOpen={setIsConfirmModalOpen}
          footer={
            <div className="self-end">
              <Button className="rounded-md shadow-none bg-yellow-700 text-black hover:!text-white hover:!bg-zinc-700">
                Deactivate Account
              </Button>
            </div>
          }
        >
          <label htmlFor="inputPassword" className="relative block">
            <span className={'absolute left-2 top-2.5 z-10'}>
              <Image
                src={'/icons/lock-closed.svg'}
                width={15}
                height={19}
                alt="Password icon"
              />
            </span>
            <TextInput
              id="inputPassword"
              name="password"
              type="password"
              placeholder="Password"
              className={'text-zinc-700 py-2 w-full px-8 bg-zinc-100'}
            />
          </label>
        </Modal>
      </>
    </HomeLayout>
  );
}
