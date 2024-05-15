export default class TransactionDate {
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
}
