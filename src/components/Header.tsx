import { Group, Anchor, Container, Button } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import classes from "../styles/Header.module.css"
import useAuth from "../hooks/useAuth"
import useLogout from "../hooks/useLogout"
import { ROLES } from "../components/DataInterfaces"

const Header = () => {
  const {
    auth: { role },
  } = useAuth()
  const navigate = useNavigate()
  const logout = useLogout()

  return (
    <header className={classes.header}>
      <Container className={classes.inner}>
        <Group>
        {role && [ROLES.PLACER].includes(role) && (
            <>
          <Anchor
            component="button"
            onClick={() => navigate("/providers")}
            size="lg"
            className={classes.link}
          >
            Proveedores
          </Anchor>
          </>
          )}
          {role && [ROLES.PLACER, ROLES.APPROVER].includes(role) && (
            <>
              <Anchor
                component="button"
                onClick={() => navigate("/invoices")}
                size="lg"
                className={classes.link}
              >
                Compras
              </Anchor>
            </>
          )}
        </Group>
        <Button onClick={logout} color="red">Salir</Button>
      </Container>
    </header>
  )
}

export default Header
