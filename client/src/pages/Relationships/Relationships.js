import React from "react";
import {
  Switch,
  Route,
  useParams,
  useRouteMatch,
  useHistory,
  Redirect,
} from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  REMOVE_RELATIONSHIP,
  ADD_RELATIONSHIP,
  GET_RELATIONSHIP_LIST,
  GET_RELATIONSHIP,
} from "./RelationshipsQueries";
import { H1 } from "../../components/Heading";
import Link from "../../components/Link";
import Button from "../../components/Button";
import FormItem from "../../components/FormItem";
import Pagination from "../../modules/Pagination";
import usePagination from "../../hooks/usePagination";

function RelationshipList() {
  const { size, from, pageCount, prev, next } = usePagination();
  const { loading, error, data } = useQuery(GET_RELATIONSHIP_LIST, {
    variables: {
      params: {
        size,
        from,
      },
    },
  });
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

  return (
    <div>
      <Pagination
        total={data.relationshipList.total}
        pageCount={pageCount(data.relationshipList.total)}
        prev={prev}
        next={next}
      />
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="w-1/2 px-4 py-2">Name</th>
            <th className="w-1/4 px-4 py-2">Type</th>
            <th className="w-1/4 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.relationshipList.items.map(({ id, name, type }) => (
            <tr key={id}>
              <td className="border px-4 py-2">
                <Link to={`${url}/${id}`}>{name}</Link>
              </td>
              <td className="border px-4 py-2 text-center">{type}</td>
              <td className="border px-4 py-2 text-center">
                {mutationLoading ? (
                  <Button importance="tertiary" destructive disabled>
                    Loading...
                  </Button>
                ) : (
                  <Button
                    importance="tertiary"
                    destructive
                    onClick={() => removeRelationship({ variables: { id } })}
                  >
                    Delete
                  </Button>
                )}
                {mutationError && <p>Error :( Please try again</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Relationship() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_RELATIONSHIP, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  if (
    data.relationship.__typename === "InvalidParam" ||
    data.relationship.__typename === "NotFoundEntity"
  ) {
    return <Redirect to="/404" />;
  }
  return data.relationship.name;
}

function useFormFields(initialValues) {
  const [formFields, setFormFields] = React.useState(initialValues);
  const [formErrors, setFormErrors] = React.useState(initialValues);

  const createChangeHandler = key => e => {
    const value = e.target.value;
    setFormFields(prev => ({ ...prev, [key]: value }));
  };

  const handleErrors = errors => {
    const betterErrors = errors.reduce((acc, error) => {
      acc[error.field] = error.message;
      return acc;
    }, {});
    errors.forEach(error => {
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

  const handleSubmit = e => {
    e.preventDefault();
    addRelationship({ variables: { relationship: formFields } });
  };

  return (
    <form className="w-full max-w-xs" onSubmit={handleSubmit}>
      <FormItem
        name="name"
        label="Name"
        value={formFields.name}
        error={formErrors.name}
        handler={createChangeHandler("name")}
      />
      <FormItem
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

export default function RelationshipsRelationships() {
  const { path } = useRouteMatch();

  return (
    <div className="container">
      <div className="flex items-center my-12">
        <H1>Relationship management</H1>
        <Link
          buttonAppearance
          className="ml-auto flex-shrink-0"
          to={`${path}/new`}
        >
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
