import React from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'

const ProtectedRoute = withAuthenticator(({ component: Component }: { component: React.ComponentType }) => {
    return <Component />
})

export default ProtectedRoute