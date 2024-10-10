'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import StandardizedComponent, {
  StandardizedInput,
  StandardizedButton,
  StandardizedForm,
  StandardizedText,
  StandardizedLink
} from './StandardizedComponent'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    setIsLoading(false)

    if (result.error) {
      setError('Invalid email or password')
    } else {
      router.push('/')
    }
  }

  return (
    <StandardizedComponent title="Sign in to your account" error={error}>
      <StandardizedForm onSubmit={handleSubmit}>
        <StandardizedInput
          label="Email address"
          id="email-address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="Email address"
        />
        <StandardizedInput
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="Password"
        />
        <StandardizedButton type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </StandardizedButton>
      </StandardizedForm>
      <StandardizedText className="mt-4 text-center">
        Don't have an account?{' '}
        <StandardizedLink href="/register">Register here</StandardizedLink>
      </StandardizedText>
    </StandardizedComponent>
  )
}
