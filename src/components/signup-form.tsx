import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authAPI } from "@/services/api"
import { toast } from "sonner"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    organizationName: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    if (!passwordRegex.test(formData.password)) {
      toast.error('Password must contain at least one lowercase letter, one uppercase letter, and one number')
      return
    }

    setIsLoading(true)

    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        ...(formData.organizationName && { organizationName: formData.organizationName })
      }

      const response = await authAPI.register(registrationData)
      
      if (response.success) {
        toast.success('Account created successfully! Please log in.')
        navigate('/login')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Join PulseGen</CardTitle>
          <CardDescription>
            Create your account to start uploading and streaming videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    type="text" 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required 
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    type="text" 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required 
                  />
                </Field>
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="organizationName">Organization Name (Optional)</FieldLabel>
                <Input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  placeholder="Your company or organization"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input 
                      id="password" 
                      name="password"
                      type="password" 
                      value={formData.password}
                      onChange={handleInputChange}
                      required 
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword"
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required 
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 6 characters long with uppercase, lowercase, and number.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login" className="text-primary hover:underline">Sign in here</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-sm text-muted-foreground">
        By creating an account, you agree to PulseGen&apos;s <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
        and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
