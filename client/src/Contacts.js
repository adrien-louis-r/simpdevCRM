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

const CONTACT_FRAGMENT = gql`
  fragment ContactData on Contact {
    id
    email
    lastname
    firstname
  }
`;

const GET_CONTACT_LIST = gql`
  {
    contactList {
      ...ContactData
    }
  }
  ${CONTACT_FRAGMENT}
`;

const GET_CONTACT = gql`
  query contact($id: ID!) {
    contact(id: $id) {
      ...ContactData
    }
  }
  ${CONTACT_FRAGMENT}
`;

const ADD_CONTACT = gql`
  mutation addContact($contact: ContactInput!) {
    addContact(contact: $contact) {
      ...ContactData
      relationship {
        id
      }
    }
  }
  ${CONTACT_FRAGMENT}
`;

const REMOVE_CONTACT = gql`
  mutation removeContact($id: ID!) {
    removeContact(id: $id) {
      id
      success
    }
  }
`;

function ContactList() {
  const { loading, error, data } = useQuery(GET_CONTACT_LIST);
  const { url } = useRouteMatch();
  const [
    removeContact,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(REMOVE_CONTACT, {
    update(cache, { data: { removeContact } }) {
      const { contactList } = cache.readQuery({ query: GET_CONTACT_LIST });

      if (contactList && removeContact.success) {
        cache.writeQuery({
          query: GET_CONTACT_LIST,
          data: {
            contactList: contactList.filter(
              ({ id }) => id !== removeContact.id
            ),
          },
        });
      }
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.contactList.map(({ id, email, lastname, firstname }) => (
    <div key={id}>
      <p>
        <Link to={`${url}/${id}`}>
          {email}: {`${firstname} ${lastname}`}
        </Link>
        {mutationLoading ? (
          <button disabled>Loading...</button>
        ) : (
          <button onClick={() => removeContact({ variables: { id } })}>
            Delete
          </button>
        )}
        {mutationError && <p>Error :( Please try again</p>}
      </p>
    </div>
  ));
}

function Contact() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_CONTACT, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.contact.email;
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

  const handleErrors = (error) => {
    error.graphQLErrors.forEach((graphQLError) => {
      if (graphQLError.extensions.code === "BAD_USER_INPUT") {
        setFormErrors({
          ...initialValues,
          ...graphQLError.extensions.validationErrors,
        });
      }
    });
  };

  return { formFields, formErrors, createChangeHandler, handleErrors };
}

export function ContactForm() {
  const {
    formFields,
    formErrors,
    createChangeHandler,
    handleErrors,
  } = useFormFields({
    email: "",
    firstname: "",
    lastname: "",
  });

  const history = useHistory();

  const [addContact, { loading }] = useMutation(ADD_CONTACT, {
    onError: handleErrors,
    update(cache, { data: { addContact } }) {
      const { contactList } = cache.readQuery({ query: GET_CONTACT_LIST });

      if (contactList) {
        cache.writeQuery({
          query: GET_CONTACT_LIST,
          data: { contactList: contactList.concat([addContact]) },
        });
      }
    },
    onCompleted() {
      history.push("/contacts");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addContact({ variables: { contact: formFields } });
  };

  return (
    <form className="w-full max-w-xs" onSubmit={handleSubmit}>
      <InputGroup
        name="email"
        label="Email"
        value={formFields.email}
        error={formErrors.email}
        handler={createChangeHandler("email")}
      />
      <InputGroup
        name="firstname"
        label="firstname"
        value={formFields.firstname}
        error={formErrors.firstname}
        handler={createChangeHandler("firstname")}
      />
      <InputGroup
        name="lastname"
        label="lastname"
        value={formFields.lastname}
        error={formErrors.lastname}
        handler={createChangeHandler("lastname")}
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

export default function Contacts() {
  const { path } = useRouteMatch();

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="h1 mb-2">Contact management</h1>
        <Link className="btn btn-secondary" to={`${path}/new`}>
          Create new contact
        </Link>
      </div>

      <Switch>
        <Route exact path={path}>
          <ContactList />
        </Route>
        <Route path={`${path}/new`}>
          <ContactForm />
        </Route>
        <Route path={`${path}/:id`}>
          <Contact />
        </Route>
      </Switch>
    </div>
  );
}
