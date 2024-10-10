import React from 'react'
import dynamic from 'next/dynamic'

const UserInfo = dynamic(() => import('./app/components/UserInfo'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

const config = {
  logo: <span>My Nextra Documentation</span>,
  project: {
    link: 'https://github.com/shuding/nextra'
  },
  navbar: {
    extraContent: <UserInfo />
  },
  // ... other theme options
}

export default config
