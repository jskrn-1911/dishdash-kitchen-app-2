

"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
const initialData = {
    phoneNumber: "9876543210",
    name: "Tasty Treats Kitchen",
    ownerName: "John Doe",
    region: "North India",
    address: {
      street: "456 Spice Lane",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
    profilePhoto: "https://picsum.photos/150/150?random=1",
    kitchenImages: [
      "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
      "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg",
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
    ],
    slogan: "Taste the Tradition, Love the Flavor",
    description: "Authentic home-style Indian cuisine prepared with love and care.",
    status: "online",
    requestStatus: "approved",
    isNewKitchen: true,
  };
  
const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    phoneNumber: initialData.phoneNumber || '',
    name: initialData.name || '',
    ownerName: initialData.ownerName || '',
    region: initialData.region || '',
    address: {
      street: initialData.address?.street || '',
      city: initialData.address?.city || '',
      state: initialData.address?.state || '',
      postalCode: initialData.address?.postalCode || '',
      country: initialData.address?.country || 'India',
    },
    profilePhoto: initialData.profilePhoto || '',
    kitchenImages: initialData.kitchenImages || [],
    slogan: initialData.slogan || '',
    description: initialData.description || '',
    status: initialData.status || 'offline',
    requestStatus: initialData.requestStatus || 'pending approval',
    isNewKitchen: initialData.isNewKitchen || false,
  });


const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
  
    setFormData(prev => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.') as [keyof typeof prev, string];
  
        // Ensure parent is an object before spreading
        if (typeof prev[parent] === 'object' && prev[parent] !== null) {
          return {
            ...prev,
            [parent]: {
              ...prev[parent] as Record<string, any>, // Explicitly tell TypeScript it's an object
              [child]: value
            }
          };
        }
        return prev; // Return previous state if parent is not an object
      } else {
        return {
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        };
      }
    });
  };
  
  

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    // Add your submission logic here
    console.log('Form Data:', formData);
  };

  return (
    <DefaultLayout>
        <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
    <div className="">
      <div  className="space-y-6">
        {/* Basic Information Section */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="font-medium text-black dark:text-white border-b border-stroke px-7 py-4 dark:border-strokedark">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-7">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Kitchen Name</label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          id="name"
                          placeholder="Kitchen Name"
                      />
              {/* <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              /> */}
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Owner Name</label>
              <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                          id="ownerName"
                          placeholder="Devid Jhon"
                        />
                      </div>
              {/* <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              /> */}
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Phone Number</label>
              <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        id="phoneNumber"
                        placeholder="+990 3343 7865"
                      />
              {/* <input
                type="number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              /> */}
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Region</label>
              <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="region"
                value={formData.region}
                onChange={handleInputChange}
                        id="region"
                        placeholder="North India"
                      />
              {/* <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              /> */}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="font-medium text-black dark:text-white border-b border-stroke px-7 py-4 dark:border-strokedark">Address Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-7">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Street</label>
              <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        placeholder="+990 3343 7865"
                        defaultValue="+990 3343 7865"
                      />
              {/* <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              /> */}
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">City</label>
              <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        placeholder="+990 3343 7865"
                        defaultValue="+990 3343 7865"
                      />
              {/* <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              /> */}
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">State</label>
              <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        placeholder="+990 3343 7865"
                        defaultValue="+990 3343 7865"
                      />
              {/* <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              /> */}
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Postal Code</label>
              <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleInputChange}
                        placeholder="+990 3343 7865"
                        defaultValue="+990 3343 7865"
                      />
              {/* <input
                type="text"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              /> */}
            </div>
          </div>
        </div>

        {/* Business Section */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="font-medium text-black dark:text-white border-b border-stroke px-7 py-4 dark:border-strokedark">Business Information</h2>
       
          <div className="grid grid-cols-1  gap-6 p-7">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Slogan</label>
              <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="slogan"
                        value={formData.slogan}
                        onChange={handleInputChange}
                        placeholder="Slogan"
                      />
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Description</label>
              <textarea
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name="description"
                 value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                      />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="font-medium text-black dark:text-white border-b border-stroke px-7 py-4 dark:border-strokedark">Kitchen Information</h2>
          <div className="space-y-6 p-7">
        
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Kitchen Images</label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {formData.kitchenImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Kitchen ${index + 1}`}
                    // width={100}
                    // height={100}
                    className="rounded"
                  />
                ))}
              </div>
              <div
                    id="ImageFileUpload"
                    className="relative mt-4 mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {/* Handle image upload */}}
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p>
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>
              {/* <input
                type="file"
                multiple
                accept="image/*"
                // onChange={(e) => {}}
                className="mt-4 block w-full"
              /> */}
            </div>
          </div>
        </div>



        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
    </div>
     <div className="col-span-5 xl:col-span-2">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                      Your Photo
                    </h3>
                  </div>
                  <div className="p-7">
                    <form action="#">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="h-14 w-14 rounded-full">
                        {formData.profilePhoto && (
                <img
                  src={formData.profilePhoto}
                  alt="Profile"
                //   width={100}
                //   height={100}
                  className=" rounded-full"
                />
              )}
                          {/* <Image
                            src={"/images/user/user-03.png"}
                            width={55}
                            height={55}
                            alt="User"
                          /> */}
                        </div>
                        <div>
                          <span className="mb-1.5 text-black dark:text-white">
                            Edit your photo
                          </span>
                          <span className="flex gap-2.5">
                            <button className="text-sm hover:text-primary">
                              Delete
                            </button>
                            <button className="text-sm hover:text-primary">
                              Update
                            </button>
                          </span>
                        </div>
                      </div>
    
                      <div
                        id="ProfileImageUpload"
                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {/* Handle image upload */}}
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        />
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                fill="#3C50E0"
                              />
                            </svg>
                          </span>
                          <p>
                            <span className="text-primary">Click to upload</span> or
                            drag and drop
                          </p>
                          <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                          <p>(max, 800 X 800px)</p>
                        </div>
                      </div>
    
                      {/* <div className="flex justify-end gap-4.5">
                        <button
                          className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                          type="submit"
                        >
                          Cancel
                        </button>
                        <button
                          className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                          type="submit"
                        >
                          Save
                        </button>
                      </div> */}
                    </form>
                  </div>
                </div>
              </div>
    </div>
    </form>
    </div>
    </DefaultLayout>
  );
};

export default UpdateProfile;

