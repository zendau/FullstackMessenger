import { useState } from "react";
import FlatContainer from "../components/FlatContainer";


function ContactsScreen() {

  const [contactsData, serContactsData] = useState([
    { id: 1, message: 'a' },
    { id: 2, message: 'ab' },
    { id: 3, message: 'abc' },
    { id: 4, message: 'd' },
    { id: 5, message: 'de' },
    { id: 6, message: 'def' },
    { id: 7, message: 'g' },
    { id: 8, message: 'gh' },
    { id: 9, message: 'ghi' },
    { id: 10, message: 'j' },
    { id: 11, message: 'jo' },
  ])

  return (
    <FlatContainer listData={contactsData} noItemMessage='No contacts' />
  );
}

export default ContactsScreen