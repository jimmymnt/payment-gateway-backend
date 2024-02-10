const urlWithPath = (req, path = null) => {
  const domain = req.protocol + '://' + req.get('host');
  return `${domain}/${path}`;
}

module.exports = {
  urlWithPath,
}