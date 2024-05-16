import React from 'react';

export default function GreetingUser({ user }) {
  return (
    <section className="greetings-wrapper">
      Hello,
      <h1>{user?.name}</h1>
    </section>
  );
}
