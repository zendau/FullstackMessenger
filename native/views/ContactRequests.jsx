import { useState } from "react";
import FlatContainer from "../components/FlatContainer";


function ContactRequestsScreen() {

  const [contactsData, setContactsData] = useState([
    { id: 1, message: 'a' },
    { id: 2, message: 'ab' },
    { id: 3, message: 'abc' },
    { id: 4, message: 'd' },
    { id: 5, message: 'de' }
  ])

  console.log('render')

  return (
    <FlatContainer listData={contactsData} noItemMessage='No Requests' isPeopleNavigate isRequestHeader setContactsData={setContactsData} />
  );
}

export default ContactRequestsScreen