import Link from "next/link";

const UpdateProfileAlert = () => {
  return (
    <div className="flex flex-col items-center w-full text-center bg-warning bg-opacity-50">
      <p>Your profile is incomplete, 
        <Link href="/profile/update">
          <a className="text-blue-600 hover:text-blue-800"> update now</a>
        </Link>
      </p>
    </div>
  );
};

export default UpdateProfileAlert;
