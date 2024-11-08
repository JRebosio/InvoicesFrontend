import { useState } from "react"
import { isAxiosError } from "axios"
import { useForm } from "@mantine/form"
import { useNavigate } from "react-router-dom"
import {
  TextInput,
  PasswordInput,
  Paper,
  Button,
  Title,
  Alert,
  Container,
} from "@mantine/core"
import useAuth from "../hooks/useAuth"
import axios from "../api/axios"

interface FormValues {
  username: string
  password: string
}

const LoginForm = () => {
  const { setAuth } = useAuth()
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const form = useForm<FormValues>({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      password: (value) =>
        value.length < 2 ? "Password must be at least 6 characters" : null,
    },
  })

  const handleSubmit = async (values: FormValues) => {
    const payload = {
      username: values.username,
      password: values.password,
    }

    try {
      const response = await axios.post("/api/login/", payload, {
        withCredentials: true,
      })
      const { access, user_type } = response?.data
      setAuth({ accessToken: access, role: user_type })
      navigate("/invoices/")
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data.detail)
      }
    }
  }

  return (
    <Container size={420} my={40}>
      <Title order={2} ta="center">
        Bienvenido
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Usuario"
            placeholder="Your username"
            required
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="Contrasena"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" type="submit">
            Login
          </Button>
        </form>
      </Paper>
      {error && (
        <Alert color="red" my="lg">
          {error}
        </Alert>
      )}
    </Container>
  )
}

export default LoginForm
