import Link from 'next/link';
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const NotFound = () => {
    return (
        <>
            <DefaultLayout>
                <div className="flex flex-col items-center justify-center h-[85vh] text-center">
                    <h1 className="text-4xl font-bold">404</h1>
                    <p className="text-lg mt-2">Oops! The page you are looking for does not exist.</p>
                    <Link href="/">
                        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Go Home
                        </button>
                    </Link>
                </div>
            </DefaultLayout>
        </>
    );
};

export default NotFound;
