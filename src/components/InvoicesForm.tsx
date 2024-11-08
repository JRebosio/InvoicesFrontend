import { useState, useEffect } from "react";
import {
  Paper,
  Title,
  Button,
  Card,
  TextInput,
  Alert,
  Select,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { isAxiosError } from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Providers, Invoices } from "../api/providerApi";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROLES, Provider, Invoice } from "./DataInterfaces";


interface SelectOption {
  value: string;
  label: string;
}

const initialValues: Invoice = {
  id: "",
  user: "",
  provider: "",
  state: "PENDING",
  total_cost: "",
  items: [{ name: "", quantity: "", price: "" }],
};

const InvoiceComponent = () => {
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState(null);
  const [providers, setProviders] = useState<SelectOption[]>([]);
  const { auth } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = auth?.role === ROLES.PLACER;
  const form = useForm<Invoice>({
    initialValues,
    validate: {
      provider: (value) => (value !== "" ? null : " Provider is required"),
      items: (items) => {
        if (items.length === 0) {
          return "At least one item is required";
        }

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (!item.name) {
            return `Item ${i + 1}: Nombre is required`;
          }
          if (!item.quantity) {
            return `Item ${i + 1}: Cantidad is required`;
          }
          if (!item.price) {
            return `Item ${i + 1}: Precio is required`;
          }
        }
        return null;
      },
    },
  });

  useEffect(() => {
    const fetchInvoice = async () => {
      if (id === undefined) return;
      try {
        const response = await axiosPrivate.get(Invoices.get(id));
        const formData = {
          ...response.data,
        };
        form.setValues(formData);
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data.detail);
        }
      }
    };

    fetchInvoice();
  }, [id]);

  useEffect(() => {
    console.log(id);
    if (isAdmin) {
      const fetchProvidersData = async () => {
        try {
          const providers = await axiosPrivate.get(Providers.list);
          setProviders(
            providers.data.map((provider: Provider) => ({
              value: provider.name.toString(),
              label: provider.name,
            }))
          );
        } catch (err) {
          if (isAxiosError(err)) {
            setError(err.response?.data.detail);
          }
          console.error("Error fetching providers:", error);
        }
      };

      fetchProvidersData();
    }
  }, [id]);

  useEffect(() => {
    console.log(form.values);
  }, [form]);


  const createInvoice = async () => {
    try {
      await axiosPrivate.post(Invoices.create, form.values);
      alert("Nueva compra creada");
      navigate("/invoices");
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail);
      }
    }
  };

  const updateItems = async () => {
    if (id === undefined) return;
    try {
      await axiosPrivate.patch(Invoices.updateItems(id), form.values);
      alert("Actualizacion exitosa");
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail);
      }
    }
  };

  const deleteInvoice = async () => {
    if (id === undefined) return;
    try {
      await axiosPrivate.delete(Invoices.delete(id));
      navigate("/invoices");
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail);
      }
    }
  };
  const addItem = () => {
    form.insertListItem("items", { name: "", quantity: "", price: "" });
  };

  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <Paper p="sm">
      <Title order={2} mb="md">
        Nueva compra
      </Title>
      <Card withBorder shadow="sm" px="xl" mb="md">
        {id === undefined && (
          <Select
            label="Proveedor"
            mb="sm"
            readOnly={!isAdmin}
            {...form.getInputProps("provider")}
            data={providers}
          />
        )}
        {isAdmin && (
          <>
            {form.values.items.map((item, index) => (
              <Group key={index} mt="sm">
                <TextInput
                  label={`${index + 1}. Nombre del Item `}
                  required
                  {...form.getInputProps(`items.${index}.name`)}
                />
                <TextInput
                  label={`${index + 1}. Cantidad del Item`}
                  required
                  {...form.getInputProps(`items.${index}.quantity`)}
                />
                <TextInput
                  label={`${index + 1}. Precio del Item en S/.`}
                  required
                  {...form.getInputProps(`items.${index}.price`)}
                />
                <Button
                  onClick={() => form.removeListItem("items", index)}
                  color="red"
                >
                  X
                </Button>
              </Group>
            ))}
            <Button onClick={addItem} mt="sm">
              + Agregar Item
            </Button>
          </>
        )}

        {isAdmin ? (
          id === undefined ? (
            <Button mt="md" onClick={createInvoice} disabled={!form.isValid()}>
              Create
            </Button>
          ) : (
            <Group grow>
              <Button mt="md" onClick={updateItems}>
                Update
              </Button>
              <Button color="red" mt="md" onClick={deleteInvoice}>
                Delete
              </Button>
            </Group>
          )
        ) : (
          <Button mt="sm">
            Update Status
          </Button>
        )}
      </Card>
    </Paper>
  );
};

export default InvoiceComponent;
