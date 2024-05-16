export default class Transaction {
  #id;

  #date;

  #amount;

  #description;

  #type;

  constructor(id, date, amount, description, type) {
    this.#id = id;
    this.#date = date;
    this.#amount = amount;
    this.#description = description;
    this.#type = type;
  }

  get id() {
    return this.#id;
  }

  get date() {
    const time = new Intl.DateTimeFormat('id', {
      timeStyle: 'medium',
      dateStyle: 'medium'
    });
    return time.format(new Date(this.#date));
  }

  get amount() {
    return this.#amount;
  }

  get description() {
    return this.#description;
  }

  get type() {
    return this.#type;
  }

  toJSON() {
    return {
      amount: `${this.#amount}`,
      date: this.#date,
      description: this.#description,
      type: this.#type
    };
  }

  comparesTo(anotherTransaction, sortBy, sortOrder = 'ascending') {
    const sortMultiplier = sortOrder === 'descending' ? -1 : 1;
    if (sortBy === 'date' || sortBy === 'description')
      return (
        this[sortBy].localeCompare(anotherTransaction[sortBy]) * sortMultiplier
      );

    if (sortBy === 'amount')
      return (this.#amount - anotherTransaction.#amount) * sortMultiplier;
    return (this.#id - anotherTransaction.#id) * sortMultiplier;
  }

  filter(query) {
    return this.#description.includes(query);
  }
}
