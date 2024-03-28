import { useEffect, useState } from "react";
import { HiArrowNarrowUp, HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";
import CountUp from "react-countup";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

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
            <h3 className="text-gray-500 font-semibold text-md uppercase">
              Total Users
            </h3>
            <p className="text-2xl">
              {" "}
              <CountUp end={totalusers} duration={1} />
            </p>
          </div>
          <HiOutlineUserGroup className="bg-sky-500 text-white rounded-full text-5xl p-3" />
        </div>
        <div className="flex gap-2 text-sm">
          <span className="text-green-500 flex items-center">
            <HiArrowNarrowUp />
            {lastmonthusers}
          </span>
          <div className="text-gray-500 ">Last Month</div>
        </div>
      </div>
      <div className="">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-lg ">
          <div className="flex justify-between p-3 text-sm font font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button>
              <Link to={"/admin-dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => {
                return(
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white">
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt='user profile picture'
                        className="w-10 h-10 rounded-full"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    
                  </Table.Row>
                </Table.Body>
                );
              })}
          </Table>
        </div>
      </div>
    </div>
  );
}
