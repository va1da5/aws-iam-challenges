import { Link } from "@tanstack/react-router";

type Props = {};

export default function NavBar({}: Props) {
  return (
    <nav className="border-gray-200 bg-white dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between py-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/iam.svg" className="h-9 rounded" alt="iam" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            AWS IAM Policy Challenge
          </span>
        </div>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 md:dark:bg-gray-900 rtl:space-x-reverse">
            <li>
              <Link
                to="/"
                className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500 [&.active]:text-blue-700 [&.active]:dark:text-blue-500"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/challenge"
                className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500 [&.active]:text-blue-700 [&.active]:dark:text-blue-500"
              >
                Challenges
              </Link>
            </li>
            <li>
              <Link
                to="/sandbox"
                className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500 [&.active]:text-blue-700 [&.active]:dark:text-blue-500"
              >
                Sandbox
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
