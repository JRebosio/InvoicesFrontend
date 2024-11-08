import { useState } from "react";
import { Button, TextInput, Card, Alert, Paper, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import useAuth from "../hooks/useAuth";
import { ROLES, Provider } from "./DataInterfaces";
import { Providers } from "../api/providerApi";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useForm } from "@mantine/form";

const initialValues: Provider = {
  id: "",
  name: "",
  address: "",
  phone_number: "",
};

const ProviderComponent = () => {
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState<null | string>(null);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const isAdmin = auth?.role === ROLES.PLACER;
  const form = useForm<Provider>({ initialValues });

  const createProvider = async () => {
    try {
      const endpoint = Providers.create;
      await axiosPrivate.post(endpoint, form.values);
      alert("Created successfully.");
      navigate("/providers");
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail);
      }
    }
  };

  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <Paper p="sm">
      <Title order={2} mb="md">
        Proveedor
      </Title>
      <Card withBorder shadow="sm" px="xl" mb="md">
        <TextInput
          label="Nombre"
          mb="sm"
          required
          readOnly={!isAdmin}
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Direccion"
          mb="sm"
          required
          readOnly={!isAdmin}
          {...form.getInputProps("address")}
        />
        <TextInput
          label="Numero de contacto"
          mb="sm"
          required
          readOnly={!isAdmin}
          {...form.getInputProps("phone_number")}
        />
        <Button mt="md" onClick={() => createProvider()}>
          Create
        </Button>
      </Card>
    </Paper>
  );
};

export default ProviderComponent;
