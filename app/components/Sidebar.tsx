import { json } from "@remix-run/node";
import { Form, NavLink, useNavigation, useSubmit } from "@remix-run/react";

import { ContactRecord, createEmptyContact } from "../data";
import { useEffect } from "react";

export const action = async () => {
  const contact = await createEmptyContact();
  return json({ contact });
};

export default function Sidebar({
  q,
  contacts,
}: {
  q: string | null;
  contacts: ContactRecord[];
}) {
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);
  return (
    <div id="sidebar">
      <h1>Remix Todo</h1>
      <div>
        <Form
          id="search-form"
          role="search"
          onChange={(event) => {
            const isFirstSearch = q === null;
            // history stack
            submit(event.currentTarget, {
              replace: !isFirstSearch,
            });
          }}
        >
          <input
            id="q"
            className={searching ? "loading" : ""}
            defaultValue={q || ""}
            aria-label="Search contacts"
            placeholder="Search"
            type="search"
            name="q"
          />
          <div id="search-spinner" aria-hidden hidden={true} />
        </Form>
        <Form method="post">
          <button type="submit">New</button>
        </Form>
      </div>
      <nav>
        {contacts.length ? (
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id}>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "active" : isPending ? "pending" : ""
                  }
                  to={`contacts/${contact.id}`}
                >
                  {contact.first || contact.last ? (
                    <>
                      {contact.first} {contact.last}
                    </>
                  ) : (
                    <i>No Name</i>
                  )}{" "}
                  {contact.favorite ? <span>★</span> : null}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            <i>No contacts</i>
          </p>
        )}
      </nav>
    </div>
  );
}
