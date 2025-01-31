"use client"

import { useUser } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const SigninComponent = () => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, setKitchenData } = useUser();
    const [error, setError] = useState("");

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!phoneNumber || phoneNumber.length < 10) {
            console.log("Invalid phone number:", phoneNumber);
            setError("Please enter a valid phone number.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kitchen/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phoneNumber }),
            })

            const data = await response.json();

            if (response.ok) {
                setOtpSent(true);
                setError("");
            } else if (response.status === 400) {
                console.error("Invalid phone number:", data.message);
                setError(data.message || "Invalid phone number. Please enter a valid phone number.");
            } else {
                console.error("Something happened:", data.message);
                setError(data.message || "Something went wrong. Please try again.");
            }
            // console.log(response.data.message)

        } catch (error) {
            console.error("Error sending OTP:", error.response?.data?.message || error.message);
            setError("Failed to send OTP. Please try again.")
            // alert("Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kitchen/login/verify`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber, otp }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            console.log("Response Data:", data);

            const { token, kitchen } = data;

            localStorage.setItem("KitchenToken", token);
            localStorage.setItem("kitchenId", kitchen._id);
            localStorage.setItem("kitchenData", JSON.stringify(kitchen));

            login(kitchen, token);
            setKitchenData(kitchen);

            router.push("/");
        } catch (error) {
            console.error("Error verifying OTP:", error.response?.data?.message || error.message);
            setError("Error logging in. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoginWithoutOtp = async (e) => {
        e.preventDefault();

        if (!phoneNumber || phoneNumber.length < 10) {
            console.log("Invalid phone number:", phoneNumber);
            setError("Please enter a valid phone number.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kitchen/login-without-otp`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber })
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            const data = await response.json();
            
            console.log("Response Data:", data);

            const { token, kitchen } = data;

            localStorage.setItem("KitchenToken", token);
            localStorage.setItem("kitchenId", kitchen._id);
            localStorage.setItem("kitchenData", JSON.stringify(kitchen));

            login(kitchen, token);
            setKitchenData(kitchen);

            router.push("/");
        } catch (error) {
            console.error("Error logging in:", error.message);
            setError("Error logging in. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                <span className="mb-1.5 block font-medium">Start with DishDash-Kitchens</span>
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    Sign In to DishDash Kitchen
                </h2>
                <div className=" mb-4 text-start text-red-600">
                    <p>{error}</p>
                </div>
                {!otpSent ?
                    <form>
                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Phone
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="mb-5 mt-10">
                            <button onClick={handleSendOtp} className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90">
                                {loading ? "loading..." : "Continue"}
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p>
                                Don’t have any account? just enter you mobile number & continue.
                            </p>
                        </div>
                        <div className="mt-2 text-center">
                            <p>
                                developer ? just enter mobile number and <span onClick={handleLoginWithoutOtp} className='text-blue-600 cursor-pointer font-bold'>click here</span>
                            </p>
                        </div>
                    </form>
                    :
                    <form>
                        <div className="mt-2 mb-2 text-start">
                            <p>
                                Otp sent to <span>{phoneNumber}</span> not correct?  <span onClick={() => setOtpSent(false)} className='text-blue-600 cursor-pointer font-bold'>change</span>
                            </p>
                        </div>
                        <div className="mb-6">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                OTP
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    max={6}
                                    placeholder="Enter OTP sent to your phone"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="mb-5 mt-10">
                            <button onClick={handleVerifyOtp} className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90">
                                {loading ? "loading..." : "Continue"}
                            </button>
                        </div>
                    </form>
                }
            </div>
        </div>
    )
}

export default SigninComponent
