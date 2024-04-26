import { Button } from "@material-tailwind/react";
import { Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { FcCancel, FcOk } from "react-icons/fc";
import { MdOutlineAccessTime } from "react-icons/md";
import { useSelector } from "react-redux";

export default function ProviderBooking() {
  const [appointment, setAppointment] = useState([]);
  const [provider, setProvider] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProvider = async () => {
      const res = await fetch(`/server/user/providers/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setProvider(data);
      console.log("Provider data:", data);

      const fetchBooking = async () => {
        const res = await fetch(`/server/booking/getbookings/${data[0]._id}`);
        const bookingData = await res.json();
        if (bookingData.success === false) {
          return;
        }
        setAppointment(bookingData);
        console.log("Booking data:", bookingData);
      };
      fetchBooking();
    };
    fetchProvider();
  }, [currentUser._id]);

  return (
    <>
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
        {appointment && appointment.length > 0 ? (
          <>
            <h1 className="text-2xl text-gray font-bold mb-5">
              Your Appointments :
            </h1>
            <Table hoverable className="shadow-md w-full">
              <Table.Head>
                <Table.HeadCell>Patient Name</Table.HeadCell>
                <Table.HeadCell>Services</Table.HeadCell>
                <Table.HeadCell>Scheduled Time</Table.HeadCell>
                <Table.HeadCell>Session Type</Table.HeadCell>
                <Table.HeadCell>Note</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
                {/* <Table.HeadCell>Edit</Table.HeadCell> */}
              </Table.Head>
              {appointment.map((bookingDetails) => (
                <Table.Body className="divide-y" key={bookingDetails._id}>
                  <Table.Row className="bg-white text-gray-600">
                    <Table.Cell>
                      {bookingDetails.patientDetails.fullName}
                    </Table.Cell>
                    <Table.Cell>{bookingDetails.service.join(", ")}</Table.Cell>
                    <Table.Cell>{bookingDetails.scheduledTime}</Table.Cell>
                    <Table.Cell>{bookingDetails.sessionType}</Table.Cell>
                    <Table.Cell>{bookingDetails.note}</Table.Cell>
                    <Table.Cell>{bookingDetails.status}</Table.Cell>
                    <Table.Cell className="flex flex-row gap-2">
                      <Button className='bg-emerald-600'>Approve</Button>
                      <Button className="bg-red-500">Reject</Button>
                    </Table.Cell>
                    {/* <Table.Cell>  
                    <Button>EDIT</Button>
                  </Table.Cell> */}
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </>
        ) : (
          <h1 className="text-2xl text-gray font-bold mb-5">No Bookings Yet</h1>
        )}
      </div>
    </>
  );
}
