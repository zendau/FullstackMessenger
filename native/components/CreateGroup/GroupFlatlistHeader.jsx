import { TextInput } from 'react-native'

function GroupFlatListHeader({ listData, setFilteredData }) {

  const onInputSearch = (e) => {
    const text = e.toLowerCase()
    setFilteredData(listData.filter(item => item.message.toLocaleLowerCase().includes(text)))
  }

  return (
    <TextInput
      onChangeText={onInputSearch}
      placeholder="Who would you like to add ?"
      placeholderTextColor={'gray'}
      style={{ fontSize: 18, textAlign: 'center', color: 'white' }}
    />
  )
}

export default GroupFlatListHeader