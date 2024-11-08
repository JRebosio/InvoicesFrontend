import { useState, useEffect } from "react"
import { Paper, Title, Alert, Table, Group, Button } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import useAuth from "../hooks/useAuth"
import { Providers } from "../api/providerApi"
import { Provider, ROLES } from "./DataInterfaces"



const ListProviders = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const [providers, setProviders] = useState<Provider[]>([])
  const [error, setError] = useState<null | string>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const endpoint = Providers.list
        const params =
          auth.role === ROLES.PLACER ? { status: "awaiting" } : {}
        const response = await axiosPrivate.get(endpoint, { params })
        setProviders(response.data)
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data.detail)
        }
      }
    }
    fetchProviders()
  }, [])

  if (error) return <Alert color="red">{error}</Alert>

  return (
    <Paper p="sm">
      <Group mb="md" justify="space-between">
        <Title order={2}>Proveedores</Title>
        {auth.role === ROLES.PLACER && (
          <Button onClick={() => navigate("/providers/create")}>
            Agregar Proveedor
          </Button>
        )}
      </Group>
      <Table.ScrollContainer minWidth={800}>
        <Table miw={700}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Identificador</Table.Th>
              <Table.Th>Direccion</Table.Th>
              <Table.Th>Numero de contacto</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {providers.map((provider) => (
              <Table.Tr key={provider.id}>
                <Table.Td>
                {provider.name}
                </Table.Td>
                <Table.Td>{provider.id}</Table.Td>
                <Table.Td>{provider.address}</Table.Td>
                <Table.Td>{provider.phone_number}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  )
}

const Dashboard = () => {
  return <ListProviders />
}

export default Dashboard
