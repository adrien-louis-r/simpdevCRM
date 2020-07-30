import React from "react";
import {
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const RELATIONSHIP_FRAGMENT = gql`
  fragment RelationshipData on Relationship {
    id
    name
    type
  }
`;

const GET_RELATIONSHIP_LIST = gql`
  {
    relationshipList {
      ...RelationshipData
    }
  }
  ${RELATIONSHIP_FRAGMENT}
`;

const GET_RELATIONSHIP = gql`
  query relationship($id: ID!) {
    relationship(id: $id) {
      ...RelationshipData
    }
  }
  ${RELATIONSHIP_FRAGMENT}
`;

const ADD_RELATIONSHIP = gql`
  mutation addRelationship($relationship: RelationshipInput!) {
    addRelationship(relationship: $relationship) {
      ...RelationshipData
      ... on BadUserInput {
        errors {
          field
          message
        }
      }
    }
  }
  ${RELATIONSHIP_FRAGMENT}
`;

const REMOVE_RELATIONSHIP = gql`
  mutation removeRelationship($id: ID!) {
    removeRelationship(id: $id) {
      id
      success
    }
  }
`;

function RelationshipList() {
  const { loading, error, data } = useQuery(GET_RELATIONSHIP_LIST);
  const { url } = useRouteMatch();
  const [
    removeRelationship,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(REMOVE_RELATIONSHIP, {
    update(cache, { data: { removeRelationship } }) {
      const { relationshipList } = cache.readQuery({
        query: GET_RELATIONSHIP_LIST,
      });

      if (relationshipList && removeRelationship.success) {
        cache.writeQuery({
          query: GET_RELATIONSHIP_LIST,
          data: {
            relationshipList: relationshipList.filter(
              ({ id }) => id !== removeRelationship.id
            ),
          },
        });
      }
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.relationshipList.map(({ id, name, type }) => (
    <div key={id}>
      <p>
        <Link to={`${url}/${id}`}>
          {type}: {name}
        </Link>
        {mutationLoading ? (
          <button disabled>Loading...</button>
        ) : (
          <button onClick={() => removeRelationship({ variables: { id } })}>
            Delete
          </button>
        )}
        {mutationError && <p>Error :( Please try again</p>}
      </p>
    </div>
  ));
}

function Relationship() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_RELATIONSHIP, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.relationship.email;
}

function InputGroup({ name, label, value, handler, error }) {
  const className =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className={error ? `${className} border-red-500` : className}
        type={name}
        id={name}
        value={value}
        onChange={handler}
      />
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  );
}

function useFormFields(initialValues) {
  const [formFields, setFormFields] = React.useState(initialValues);
  const [formErrors, setFormErrors] = React.useState(initialValues);

  const createChangeHandler = (key) => (e) => {
    const value = e.target.value;
    setFormFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleErrors = (errors) => {
    const betterErrors = errors.reduce((acc, error) => {
      acc[error.field] = error.message;
      return acc;
    }, {});
    errors.forEach((error) => {
      setFormErrors({
        ...initialValues,
        ...betterErrors,
      });
    });
  };

  return { formFields, formErrors, createChangeHandler, handleErrors };
}

export function RelationshipForm() {
  const {
    formFields,
    formErrors,
    createChangeHandler,
    handleErrors,
  } = useFormFields({
    name: "",
    type: "",
  });

  const history = useHistory();

  const [addRelationship, { loading }] = useMutation(ADD_RELATIONSHIP, {
    onCompleted(data) {
      if (data.addRelationship.__typename === "UserRegisterResultSuccess") {
        history.push("/relationships");
      } else {
        handleErrors(data.addRelationship.errors);
      }
    },
    update(cache, { data: { addRelationship } }) {
      const { relationshipList } = cache.readQuery({
        query: GET_RELATIONSHIP_LIST,
      });

      if (relationshipList) {
        cache.writeQuery({
          query: GET_RELATIONSHIP_LIST,
          data: {
            relationshipList: relationshipList.concat([addRelationship]),
          },
        });
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addRelationship({ variables: { relationship: formFields } });
  };

  return (
    <form className="w-full max-w-xs" onSubmit={handleSubmit}>
      <InputGroup
        name="name"
        label="Name"
        value={formFields.name}
        error={formErrors.name}
        handler={createChangeHandler("name")}
      />
      <InputGroup
        name="type"
        label="Type"
        value={formFields.type}
        error={formErrors.type}
        handler={createChangeHandler("type")}
      />
      <div>
        <input
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          value="Submit"
        />
        {loading && <p>Loading...</p>}
      </div>
    </form>
  );
}

export default function Relationships() {
  const { path } = useRouteMatch();

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="h1 mb-2">Relationship management</h1>
        <Link className="btn btn-secondary" to={`${path}/new`}>
          Create new relationship
        </Link>
      </div>

      <Switch>
        <Route exact path={path}>
          <RelationshipList />
        </Route>
        <Route path={`${path}/new`}>
          <RelationshipForm />
        </Route>
        <Route path={`${path}/:id`}>
          <Relationship />
        </Route>
      </Switch>
    </div>
  );
}
