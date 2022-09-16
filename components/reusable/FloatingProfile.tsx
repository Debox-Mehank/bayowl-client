import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLogoutLazyQuery } from "../../graphql/generated/graphql";

function FloatingProfile({
  name,
  email,
  position,
  onTop
}: {
  name?: string | null;
  email?: string | null;
  position: string;
  onTop?: boolean;
}) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [logoutQuery] = useLogoutLazyQuery();

  const logoutHandler = async () => {
    try {
      const { data: logoutData, error: logoutError } = await logoutQuery({
        fetchPolicy: "network-only",
      });

      if (logoutError !== undefined) {
        toast.error(logoutError.message);
        return false;
      }

      if (logoutData === undefined || logoutData.logout === false) {
        toast.error("Something went wrong, try again later.");
        return false;
      }
      localStorage.clear();
      sessionStorage.clear();
      router.replace("/login");
    } catch (error: any) {
      if (error) {
        toast.error(error.toString());
        return false;
      }
    }
  };

  return (
    <div className="static z-[100]">
      <div
        onClick={() => setIsProfileOpen((prev) => !prev)}
        onBlur={() => setIsProfileOpen(false)}
        className={`z-50 ${position} ${position === "absolute" && "mx-auto lg:mx-0 space-x-2 left-0 right-0 lg:left-auto lg:right-0"} bottom-10 lg:bottom-auto lg:top-10 lg:right-0 overflow-clip flex justify-center items-center gap-1 md:gap-2 cursor-pointer duration-300 transition-colors text-white lg:px-8`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="inline h-8 w-8 md:h-10 md:w-10"
          viewBox="0 0 16 16"
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
          <path
            fillRule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
          />
        </svg>
        <span>{name}</span>
        {/* Expanded */}
        <div
          className={`fixed space-y-3 bg-blueGradient-2/70 filter backdrop-blur-lg p-3 rounded-lg ${onTop ? "top-20 right-2" : "bottom-20 left-4"} lg:bottom-auto lg:left-auto lg:top-[6.5rem] lg:right-10 min-w-[20rem] transition-all duration-300 ${isProfileOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10 invisible"
            }`}
        >
          <Link href={"/dashboard"}>
            <div className="flex items-center justify-start gap-4 px-1 py-2 w-full hover:bg-blueGradient-2/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="inline"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
              <div className="flex flex-col w-full">
                <span>{name}</span>
                <span>{email}</span>
              </div>
            </div>
          </Link>

          <div
            onClick={logoutHandler}
            className="flex items-center justify-start gap-4 px-1 py-2 hover:bg-blueGradient-2/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              className="inline"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
              />
              <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
              />
            </svg>
            <span>{"Log Out"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloatingProfile;
