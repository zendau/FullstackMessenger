import { useState } from "react"
import styled from "styled-components/native"
import TouchableButton from "../UI/TouchableButton"
import { View } from 'react-native'

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 2px auto;
`

function RequestsFlatListHeader({ setContactsData, setFilteredData }) {

  const [isPending, setIsPending] = useState(true)

  const pendingHandler = () => {

    if (!isPending) {
      setIsPending(true)
      console.log('handler')

      const data = [
        { id: 1, message: 'a' },
        { id: 2, message: 'ab' },
        { id: 3, message: 'abc' },
        { id: 4, message: 'd' },
        { id: 5, message: 'de' },
      ]

      setContactsData(data)
      setFilteredData(data)
    }


  }

  const outgoingHandler = () => {

    if (isPending) {
      setIsPending(false)
      console.log('outgoing')

      const data = [
        { id: 6, message: 'def' },
        { id: 7, message: 'g' },
        { id: 8, message: 'gh' },
        { id: 9, message: 'ghi' },
        { id: 10, message: 'j' },
        { id: 11, message: 'jo' },
      ]

      setContactsData(data)
      setFilteredData(data)

    }
  }


  return (
    <Container>
      <TouchableButton onPress={pendingHandler} title="Pending" />
      <TouchableButton onPress={outgoingHandler} title="Outgoing" />
    </Container>
  )
}

export default RequestsFlatListHeader