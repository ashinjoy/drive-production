import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FcSearch } from "react-icons/fc";

import AdminNavbar from "../../Components/Navbar/AdminNavbar";
import AdminSidebar from "../../Components/Navbar/AdminSidebar";
import {
 getUserDetails,
 blockUnblockUser
} from "../../Features/Admin/adminActions";

function UsersList() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.admin);
  console.log('userData',userData);
  useEffect(() => {
    dispatch(getUserDetails());
  }, []);
  const handleBlockUnBlock = (userId) => {
    dispatch(blockUnblockUser(userId));
  };
  const handleSearch = () => {
    console.log('hanlde');
    // dispatch(debouncedSearch)

  };

  return (
    <>
      <AdminNavbar />
      <AdminSidebar />
      <div className="mt-28 ml-64 w-3/4 h-[80%] bg-gradient-to-tl from-gray-100 to-white">
        <div className="h-1/2 drop-shadow-lg rounded-xl border-2 border-gray-300 p-6 bg-white">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">Users List</h1>
            <div className="w-1/3 h-10 flex">
              <form className="flex w-full h-full">
                <input
                  type="search"
                  name=""
                  id=""
                  // value={search}
                  // onChange={(e)=>setSearch(e.target.value)}
                  className="outline-none rounded-l-lg border-2 border-black w-full h-full px-3"
                  placeholder="Search Here ...."
                  onKeyUp={handleSearch}
                />
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-r-lg border-2 border-l-0 border-black w-10 h-full bg-white"
                >
                  <FcSearch size={22} />
                </button>
              </form>
            </div>
          </div>
          <div className="mt-[2rem] drop-shadow-md border-2 border-slate-300 rounded-lg bg-white overflow-hidden">
            <div className="flex flex-col">
              <div className="overflow-x-auto w-full">
                <div className="inline-block min-w-full py-2">
                  <div className="overflow-hidden">
                    <table className="min-w-full text-left text-sm font-light">
                      <thead className="border-b font-medium dark:border-neutral-500">
                        <tr>
                          <th scope="col" className="px-6 py-4">
                            Driver Name
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Phone
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Status
                          </th>
                          <th scope="col" className="px-7 py-4">
                            Action
                          </th>
                          <th scope="col" className="px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData && userData.length > 0
                          ? userData.map((user) => {
                              return (
                                <tr className="border-b dark:border-neutral-500" key={user._id}>
                                <td className="whitespace-nowrap px-6 py-3 font-medium">
                                  {user?.name}
                                </td>
                                <td className="whitespace-nowrap p-3 font-medium">
                                  {user?.email}
                                </td>
                                <td className="whitespace-nowrap p-3 font-medium">
                                  {user?.phone}
                                </td>
                                <td className="whitespace-nowrap p-3 font-medium">
                                  <span
                                    className={`rounded-lg px-4 py-2 ${
                                      !user.isBlocked ? 'text-green-500' : 'text-red-500'
                                    } transition duration-150`}
                                  >
                                    {!user.isBlocked ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap p-3">
                                  <button
                                    className={`rounded-lg ${
                                      !user.isBlocked
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-green-500 hover:bg-green-600'
                                    } text-white px-4 py-2 transition duration-150 font-medium`}
                                    onClick={() => handleBlockUnBlock(user._id)}
                                  >
                                    {!user.isBlocked ? 'Block' : 'Unblock'}
                                  </button>
                                </td>
                                {/* <td className="whitespace-nowrap p-3">
                                  <Link
                                    to={`/admin/viewuser-Detail/${user._id}`}
                                    className="font-medium text-blue-500 hover:text-blue-700 transition duration-150"
                                  >
                                    View Details
                                  </Link>
                                </td> */}
                              </tr>
                              );
                            })
                          :(
                            <tr>
                              <td colSpan={6} className="text-center">
                                  No Users Has Been Registerd Yet
                              </td>
                            </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UsersList;

