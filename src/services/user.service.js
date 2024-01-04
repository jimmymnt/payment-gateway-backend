async function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) {
    throw new Error("Email is not valid email.");
  }

  const existed = await this.constructor.findOne({email})
  if (!!existed) throw new Error("A user is already registered with this email address.")
}

module.exports = {
  validateEmail
}