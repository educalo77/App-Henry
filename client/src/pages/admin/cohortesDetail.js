import React, { useMemo, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Tabla } from "components/Tabla";
import { COHORTE_BY_ID } from "apollo/querys/cohortes";
import {
  EDIT_COHORTE,
  ADD_USER_TO_COHORTE,
  DELETE_USER_TO_COHORTE,
} from "apollo/Mutations/cohortes";
import { useParams, useRouteMatch } from "react-router-dom";
import Groups from "./Cohortes/groups";
import Alumns from "./Cohortes/Alumns";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
} from "@material-ui/core";

function CohortesDetail({ className }) {
  let { id } = useParams();

  const [addUsersToCohorteMutation, resultCreate] = useMutation(
    ADD_USER_TO_COHORTE
  );
  const [deleteUsersToCohorteMutation, resultDelete] = useMutation(
    DELETE_USER_TO_COHORTE
  );

  const variables = { id: parseInt(id) };

  const { loading, error, data, refetch } = useQuery(COHORTE_BY_ID, {
    variables,
  });

  const tableData = useMemo(
    () => ({
      loading,
      error,
      data: data ? data.cohortes[0].user : data,

      columns: [
        { key: "id", label: "id", align: "left" },
        { key: "givenName", label: "Nombre", align: "left" },
        { key: "familyName", label: "Apellido", align: "left" },
      ],
      addButtonLabel: "Agregar alumno",
      actions: {
        create: {
          initialValues: {
            cohorteId: variables.variables,
            userId: undefined,
          },
          inputs: [{ key: "userId", label: "id", type: "number" }],
          onSubmit: async (values) => {
            await addUsersToCohorteMutation({
              variables: {
                cohorteId: parseInt(values.cohorteId),
                userId: parseInt(values.userId),
              },
            });
          },
          submitButtonLabel: "Agregar",
          title: "Agregar alumno",
        },

        delete: {
          onSubmit: async (userId) => {
            await deleteUsersToCohorteMutation({
              variables: {
                cohorteId: parseInt(variables.variables),
                userId: parseInt(userId),
              },
            });
          },
        },
      },
    }),
    [
      data,
      error,
      loading,
      addUsersToCohorteMutation,
      deleteUsersToCohorteMutation,
      variables.variables,
    ]
  );

  useEffect(() => {
    if (!resultCreate.loading && resultCreate.called) {
      refetch();
    }
  }, [resultCreate, refetch]);

  useEffect(() => {
    if (!resultDelete.loading && resultDelete.called) {
      refetch();
    }
  }, [resultDelete, refetch]);

  return (
    <Container className={className} style={{ paddingTop: "1rem" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardHeader title="Alumnos" />
            <CardContent>
              <Alumns data={data} loading={loading} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardHeader title="Grupos" />
            <CardContent>
              <Groups data={data} loading={loading} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CohortesDetail;
