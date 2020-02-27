import React from 'react'

import CreateMessage from './components/create_message.component'
import DecodeMessage from './components/decode_message.component'
import ShareMessage from './components/share_message.component'

const App = () => {
  return (
    <div><br /><br />
      <CreateMessage /><br />
      <DecodeMessage /><br /><br />
      <ShareMessage />
    </div>
  )
}

export default App