import * as React from 'react'
import * as ReactDOM from 'react-dom'
import loadable from '@loadable/component'
const AppRouter  = loadable(()=>import('./router'))


ReactDOM.render(<AppRouter />, document.getElementById("root"))