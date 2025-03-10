import type { GraphQLFormattedError } from "graphql/error/GraphQLError";

export const handleClientErrors = (errors: readonly GraphQLFormattedError[]) => {
  errors.forEach((error) => {
    console.info("Error: ", error.message, error.path);
  });

  window.alert("Error: " + errors[0].message);
};
