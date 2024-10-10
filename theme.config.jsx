import React from 'react'
import UserInfo from './app/components/UserInfo'

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
