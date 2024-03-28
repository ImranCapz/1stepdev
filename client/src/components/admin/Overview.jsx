import { useEffect, useState } from "react";
import { HiArrowNarrowUp, HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";
import CountUp from 'react-countup';

export default function Overview() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [totalusers, setTotalUsers] = useState(0);
  const [lastmonthusers, setLastMonthUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/server/user/getusers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);
  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-col p-3 bg-sky-200 gap-4 md:w-72 w-full rounded-md shadow-md">
        <div className="flex justify-between">
          <div className="">
            <h3 className="text-gray-500 font-semibold text-md uppercase">Total Users</h3>
            <p className="text-2xl"> <CountUp end={totalusers} duration={1}/></p> 
          </div>
          <HiOutlineUserGroup className="bg-amber-500 text-white rounded-full text-5xl p-3" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastmonthusers}
            </span>
            <div className="text-gray-500 ">Last Month</div>
          </div>
      </div>
    </div>
  );
}
