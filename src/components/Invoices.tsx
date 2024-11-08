import { useState, useEffect } from "react";
import { Paper, Title, Alert, Table, Group, Button } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Invoices } from "../api/providerApi";
import { Invoice, ROLES, INVOICES_STATES } from "./DataInterfaces";
import useAuth from "../hooks/useAuth";
import { ButtonContainer, StyledButton } from "../styledComponents";

const InvoicesComponent = () => {
  const axiosPrivate = useAxiosPrivate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {
      const endpoint = Invoices.list;
      const response = await axiosPrivate.get(endpoint);
      setInvoices(response.data);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data.detail);
      }
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [auth.role]);

  const UpdateState = async (invoiceId, newState) => {
    if (invoiceId === undefined) return;
    try {
      await axiosPrivate.patch(Invoices.updateState(invoiceId), {
        state: newState,
      });
      fetchInvoices();
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail);
      }
    }
  };

  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <Paper p="sm">
      <Group mb="md" justify="space-between">
        <Title order={2}>Compras</Title>
        {auth.role === ROLES.PLACER && (
          <Button onClick={() => navigate("/invoices/create")}>
            Agregar nueva compra
          </Button>
        )}
      </Group>
      <Table.ScrollContainer minWidth={800}>
        <Table miw={700}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Identificador</Table.Th>
              <Table.Th>Proveedor</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Costo total</Table.Th>
              <Table.Th> </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {invoices.map((invoice) => (
              <Table.Tr key={invoice.id}>
                <Table.Td>
                  {invoice.id}
                  {/* <Link to={`/invoices/${invoice.id}`}>{invoice.id}</Link> */}
                </Table.Td>
                <Table.Td>{invoice.provider}</Table.Td>
                <Table.Td>{invoice.state}</Table.Td>
                <Table.Td>S/. {invoice.total_cost}</Table.Td>
                <Table.Td>
                  {auth.role === ROLES.APPROVER ? (
                    <>
                      {invoice.state === INVOICES_STATES.PENDING && (
                        <>
                          <ButtonContainer>
                            <StyledButton
                              color="blue"
                              onClick={() =>
                                UpdateState(
                                  invoice.id,
                                  INVOICES_STATES.APPROVED
                                )
                              }
                            >
                              Aprobar
                            </StyledButton>
                            <StyledButton
                              color="red"
                              onClick={() =>
                                UpdateState(
                                  invoice.id,
                                  INVOICES_STATES.REJECTED
                                )
                              }
                            >
                              Desaprobar
                            </StyledButton>
                          </ButtonContainer>
                        </>
                      )}
                      {invoice.state === INVOICES_STATES.APPROVED && (
                        <ButtonContainer>
                          <StyledButton
                            color="red"
                            onClick={() =>
                              UpdateState(invoice.id, INVOICES_STATES.REJECTED)
                            }
                          >
                            Desaprobar
                          </StyledButton>
                        </ButtonContainer>
                      )}
                      {invoice.state === INVOICES_STATES.REJECTED && (
                        <ButtonContainer>
                          <StyledButton
                            color="blue"
                            onClick={() =>
                              UpdateState(invoice.id, INVOICES_STATES.APPROVED)
                            }
                          >
                            Aprobar
                          </StyledButton>
                        </ButtonContainer>
                      )}
                    </>
                  ) : (
                    <Button
                      component={Link}
                      to={`/invoices/${invoice.id}`}
                      color="green"
                    >
                      Editar
                    </Button>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
};

export default InvoicesComponent;
