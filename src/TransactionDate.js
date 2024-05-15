export default class Transaction {
  #date;

  constructor(date) {
    this.#date = date;
  }

  toString() {
    const time = new Intl.DateTimeFormat('id', {
      timeStyle: 'medium',
      dateStyle: 'medium'
    });
    return time.format(new Date(this.#date));
  }
}
