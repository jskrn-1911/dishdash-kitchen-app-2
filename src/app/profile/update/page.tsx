"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { useUser } from '@/contexts/AppContext';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface kitchen {
    phoneNumber: number;
    name: string;
    ownerName: string;
    region: string;
    address: Address;
    slogan: string;
    description: string;
    kitchenProfilePhoto: string | File | null;
    kitchenImages: string[];
}

const UpdateProfile = () => {
    const { kitchenData, setKitchenData, token } = useUser();
    const phoneNumber = kitchenData?.phoneNumber;
    const [data, setData] = useState<kitchen | null>(kitchenData); // Store original data
    const [formData, setFormData] = useState<kitchen>({
        phoneNumber: phoneNumber,
        name: "",
        ownerName: "",
        region: "",
        address: { street: "", city: "", state: "", postalCode: "", country: "India" },
        kitchenProfilePhoto: "",
        kitchenImages: [],
        slogan: "",
        description: "",
    });
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [kitchenImagePreviews, setKitchenImagePreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        if (phoneNumber) {
            const fetchKitchenDetails = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kitchen/get-kitchen-data?phoneNumber=${phoneNumber}`, {
                        method: 'GET',
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        // body: JSON.stringify({ phoneNumber })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        // setDriver(data.driver);
                        setFormData(data.kitchen);
                        setData(data.kitchen);
                        if (data.kitchen.kitchenProfilePhoto && typeof data.kitchen.kitchenProfilePhoto === 'string') {
                            setProfilePreview(data.kitchen.kitchenProfilePhoto);
                        }
                        console.log('Kitchen details fetched:', data.kitchen);
                    } else {
                        console.error('Error fetching Kitchen details:', data.message);
                        setErrorMessage("Error fetching Kitchen Details");
                    }
                } catch (error) {
                    console.error('Error fetching Kitchen details:', error);
                    setErrorMessage("Error fetching Kitchen Details");
                } finally {
                    setLoading(false);
                }
            };

            fetchKitchenDetails();
        }
    }, [phoneNumber]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev!,
            [name]: value,
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev!,
            address: { ...prev!.address, [name]: value },
        }));
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                setProfilePreview(URL.createObjectURL(file));
                setFormData((prev) => ({
                    ...prev,
                    kitchenProfilePhoto: file, // Ensure this is a File object
                }));
            }
        },
    });

    const { getRootProps: getKitchenProps, getInputProps: getKitchenInputProps } = useDropzone({
        accept: { "image/*": [] },
        multiple: true,
        onDrop: (acceptedFiles) => {
            const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
            setKitchenImagePreviews((prev) => [...prev, ...newPreviews]);
            setFormData((prev: any) => ({
                ...prev!,
                kitchenImages: [...prev!.kitchenImages, ...acceptedFiles],
            }));
        },
    });

    useEffect(() => {
        if (data) {
            setIsChanged(JSON.stringify(data) !== JSON.stringify(formData));

            if (data.kitchenProfilePhoto) {
                setProfilePreview(`${process.env.NEXT_PUBLIC_API_BASE_URL}/path/to/images/${data.kitchenProfilePhoto}`);
                console.log("Kitchen profile image", data.kitchenProfilePhoto)

            }
            if (data.kitchenImages && data.kitchenImages.length > 0) {
                const existingPreviews = data.kitchenImages.map((image) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/path/to/images/${image}`);
                setKitchenImagePreviews(existingPreviews);
                console.log("Kitchen images", data.kitchenImages)
            }
        }
    }, [data, formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (JSON.stringify(data) === JSON.stringify(formData)) {
            console.log("No changes detected.");
            return;
        }

        const form = new FormData();
        form.append("name", formData.name);
        form.append("ownerName", formData.ownerName);
        form.append("region", formData.region);
        form.append("slogan", formData.slogan);
        form.append("description", formData.description);

        if (formData.kitchenProfilePhoto instanceof File) {
            form.append("kitchenProfilePhoto", formData.kitchenProfilePhoto);
            console.log(formData.kitchenProfilePhoto)
        }

        Object.entries(formData.address).forEach(([key, value]) => form.append(`address[${key}]`, value));

        formData.kitchenImages.forEach((image: any) => {
            if (image instanceof File) {
                form.append("kitchenImages", image);
            }
        });

        try {
            console.log("form to send : ", form)
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kitchen/update-profile?phoneNumber=${phoneNumber}`,
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`,
                    },
                });

            if (response.status === 200) {
                setKitchenData(response.data.kitchen)
                if (response.data.kitchen.kitchenProfilePhoto) {
                    setProfilePreview(response.data.kitchen.kitchenProfilePhoto);
                }
                console.log("kitchen profile updated successfully!", response.data, response)
            } else {
                setErrorMessage("Error updating profile!")
                console.error("Failed to update kitchen profile", response.data.message)
            }

        } catch (error) {
            console.error('Error fetching Kitchen details:', error);
            setErrorMessage("Error fetching Kitchen Details");
        } finally {
            // setErrorMessage("");
            setLoading(false);
        }
    }

    return (
        <DefaultLayout>
            { }
            <div className="mx-auto max-w-270">
                <Breadcrumb pageName="update-profile" />
                <div className="space-y-6">
                    <div className='flex w-full justify-between items-center'>
                        <div className="justify-start text-red-600">
                            {errorMessage}
                        </div>
                        <div className="justify-end">
                            <button
                                disabled={!isChanged || loading}
                                onClick={handleSubmit}
                                type="submit"
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                            >
                                {loading ? "updating" : "Save Changes"}
                            </button>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                    >
                        <div className="grid grid-cols-5 gap-8">
                            <div className="col-span-5 xl:col-span-3">
                                <div className="">
                                    <div className="space-y-6">
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
                                                        onChange={handleChange}
                                                        id="name"
                                                        placeholder="kitchen name here..."
                                                    />
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
                                                            onChange={handleChange}
                                                            id="ownerName"
                                                            placeholder="owner name here..."
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">Phone Number</label>
                                                    <input
                                                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                        type="text"
                                                        disabled
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}
                                                        // onChange={handleChange}
                                                        id="phoneNumber"
                                                        placeholder="your phone number here..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">Region</label>
                                                    <select
                                                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                        name="region"
                                                        value={formData.region}
                                                        onChange={handleChange}
                                                        id="region"
                                                        title='region'
                                                    >
                                                        <option value="" disabled>Select Region</option>
                                                        <option value="North India">North India</option>
                                                        <option value="South India">South India</option>
                                                        <option value="East India">East India</option>
                                                        <option value="West India">West India</option>
                                                        <option value="Central India">Central India</option>
                                                        <option value="Northeast India">Northeast India</option>
                                                    </select>
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
                                                        onChange={handleAddressChange}
                                                        placeholder="street or shop here..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">City</label>
                                                    <input
                                                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                        type="text"
                                                        name="address.city"
                                                        value={formData.address.city}
                                                        onChange={handleAddressChange}
                                                        placeholder="city name here..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">Region</label>
                                                    <select
                                                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                        name="state"
                                                        value={formData.address.state}
                                                        onChange={handleAddressChange}
                                                        id="state"
                                                        title="state"
                                                    >
                                                        <option value="" disabled>Select state</option>
                                                        <option value="Punjab">Punjab</option>
                                                        <option value="Chandigarh">Chandigarh</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">Postal Code</label>
                                                    <input
                                                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                        type="text"
                                                        name="address.postalCode"
                                                        value={formData.address.postalCode}
                                                        onChange={handleAddressChange}
                                                        placeholder="postal code (140802) here..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Business Section */}
                                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                            <h2 className="font-medium text-black dark:text-white border-b border-stroke px-7 py-4 dark:border-strokedark">Kitchen Information</h2>

                                            <div className="grid grid-cols-1  gap-6 p-7">
                                                <div>
                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">Slogan</label>
                                                    <input
                                                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                        type="text"
                                                        name="slogan"
                                                        value={formData.slogan}
                                                        onChange={handleChange}
                                                        placeholder="company slogan here..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">Description</label>
                                                    <textarea
                                                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        placeholder="company description"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Images Section */}
                            <div className="col-span-5 xl:col-span-2">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                                        <h3 className="font-medium text-black dark:text-white">Profile Photo</h3>
                                    </div>
                                    <div className="p-7">
                                        <form>
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="h-32 w-32 rounded-full overflow-hidden">
                                                    <img
                                                        src={
                                                            formData.kitchenProfilePhoto instanceof File
                                                                ? URL.createObjectURL(formData.kitchenProfilePhoto) 
                                                                : formData.kitchenProfilePhoto || profilePreview || undefined
                                                        }
                                                        alt="Profile Preview"
                                                        className="object-cover h-full w-full"
                                                    />
                                                </div>

                                                <div>
                                                    <span className="mb-1.5 text-black dark:text-white">Edit profile photo</span>
                                                    <span className="flex gap-2.5">
                                                        <button className="text-sm hover:text-primary">Delete</button>
                                                        <button className="text-sm hover:text-primary">Update</button>
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                {...getRootProps()}
                                                id="ProfileImageUpload"
                                                className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5">
                                                <input {...getInputProps()}
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
                                                    <p><span className="text-primary">Click to upload</span> or drag and drop</p>
                                                    <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                                                    <p>(max, 800 X 800px)</p>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="rounded-sm border mt-6 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <h2 className="font-medium text-black dark:text-white border-b border-stroke px-7 py-4 dark:border-strokedark">Kitchen Images</h2>
                                    <div className="space-y-6 p-7">

                                        <div>
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Kitchen Images</label>
                                            <div className="grid grid-cols-3 gap-4 mt-2">
                                                {/* Display preview images that the user has uploaded */}
                                                {formData.kitchenImages.map((image, index) => (
                                                    <img src={image} alt={`Uploaded Kitchen Image ${index}`} key={index} className="preview rounded h-[150px] w-[150px]" />

                                                ))}

                                            </div>

                                            <div
                                                id="ImageFileUpload"
                                                className={`relative mt-4 mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5 `}
                                                {...getKitchenProps()}
                                            >
                                                <input
                                                    {...getKitchenInputProps()}
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default UpdateProfile;