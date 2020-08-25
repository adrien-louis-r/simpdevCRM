import React from "react";
import Link from "../components/Link";
import Button from "../components/Button";
import { H1, H2, H3, H4, H5, H6 } from "../components/Heading";
import FormItem from "../components/FormItem";

function Section({ title, children, closed = false }) {
  const [open, setOpen] = React.useState(!closed);

  return (
    <section>
      <h2
        id="buttons-section"
        className="text-3xl text-center font-bold my-6 underline cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {title}
      </h2>
      {open && children}
    </section>
  );
}

function Styleguide() {
  return (
    <div className="container">
      <h1 className="text-5xl text-center font-bold my-8">Styleguide</h1>
      <Section title="Headings">
        <H1>Heading 1</H1>
        <H2>Heading 2</H2>
        <H3>Heading 3</H3>
        <H4>Heading 4</H4>
        <H5>Heading 5</H5>
        <H6>Heading 6</H6>
      </Section>
      <Section title="Inputs">
        <FormItem
          name="name"
          label="Name"
          value="John Doe"
          error={false}
          handler={() => {}}
        />
        <FormItem
          name="email"
          label="Email"
          value="invalide.email:example.com"
          error="Invalid email address"
          handler={() => {}}
        />
      </Section>
      <Section title="Buttons">
        <div className="flex justify-center p-6 mb-4">
          <Button importance="primary">Button Primary</Button>
          <Button importance="secondary" className="mx-4">
            Button Secondary
          </Button>
          <Button importance="tertiary">Button Tertiary</Button>
        </div>
        <div className="flex justify-center bg-primary p-6 mb-4">
          <Button importance="primary" reverse>
            Button Primary
          </Button>
          <Button importance="secondary" reverse className="mx-4">
            Button Secondary
          </Button>
          <Button importance="tertiary" reverse>
            Button Tertiary
          </Button>
        </div>
        <div className="flex justify-center bg-secondary p-6">
          <Button importance="primary">Button Primary</Button>
          <Button importance="secondary" reverse className="mx-4">
            Button Secondary
          </Button>
          <Button importance="tertiary">Button Tertiary</Button>
        </div>
        <em className="block text-center text-grey my-8">
          For destructive actions:
        </em>
        <div className="flex justify-center p-6 mb-4">
          <Button importance="primary" destructive>
            Button Primary
          </Button>
          <Button importance="secondary" destructive className="mx-4">
            Button Secondary
          </Button>
          <Button importance="tertiary" destructive>
            Button Tertiary
          </Button>
        </div>
        <div className="flex justify-center bg-primary p-6 mb-4">
          <Button importance="primary" destructive reverse>
            Button Primary
          </Button>
          <Button importance="secondary" destructive reverse className="mx-4">
            Button Secondary
          </Button>
          <Button importance="tertiary" destructive reverse>
            Button Tertiary
          </Button>
        </div>
        <div className="flex justify-center bg-secondary p-6">
          <Button importance="primary" destructive>
            Button Primary
          </Button>
          <Button importance="secondary" destructive reverse className="mx-4">
            Button Secondary
          </Button>
          <Button importance="tertiary" destructive>
            Button Tertiary
          </Button>
        </div>
      </Section>
      <Section title="Links">
        <div className="flex justify-center p-6 mb-4">
          <Link to="#links-section" className="mr-2">
            Link default
          </Link>
          <Link to="#links-section" raw className="ml-2">
            Link raw
          </Link>
        </div>
        <em className="block text-center text-grey">
          You can style links as button if needed
        </em>
        <div className="flex justify-center p-6 mb-4">
          <Link
            to="#links-section"
            buttonAppearance
            buttonProps={{
              importance: "primary",
            }}
          >
            Link Primary as Button
          </Link>
          <Link
            to="#links-section"
            buttonAppearance
            buttonProps={{
              importance: "secondary",
            }}
            className="mx-4"
          >
            Link Secondary as Button
          </Link>
          <Link
            to="#links-section"
            buttonAppearance
            buttonProps={{
              importance: "tertiary",
            }}
          >
            Link Tertiary as Button
          </Link>
        </div>
      </Section>
    </div>
  );
}

export default Styleguide;
