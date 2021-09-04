import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface IBasicProps {
  isOpen: boolean;
  isDangerousAction?: boolean;
  title: string;
  children: JSX.Element[] | JSX.Element;
  actions: { label: string; action: () => void }[];
  onCancel: () => void;
}

const BasicDialog = ({
  isOpen,
  isDangerousAction,
  title,
  children,
  actions,
  onCancel: handleCancel,
}: IBasicProps) => (
  <Transition show={isOpen} as={Fragment}>
    <Dialog
      as="div"
      id="save-collection-dialog"
      className="fixed inset-0 z-10 overflow-y-auto"
      static
      open={isOpen}
      onClose={handleCancel}
    >
      <div className="min-h-screen px-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-10" />
        </Transition.Child>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <Dialog.Title
              as="h3"
              className="text-lg font-semibold leading-6 text-gray-900"
            >
              {title}
            </Dialog.Title>

            <div className="mt-4 flex flex-col">{children}</div>

            <div className="mt-4 flex flex-row justify-end">
              {actions.map(({ action, label }, i) => (
                <button
                  key={label}
                  type="button"
                  className={[
                    'pushable rounded px-4 py-2 mx-2 text-sm font-bold',
                    i === 0 && (isDangerousAction ? 'danger' : 'primary'),
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={action}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                className="pushable rounded px-4 py-2 mx-2 text-sm font-bold"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
);

export default BasicDialog;
