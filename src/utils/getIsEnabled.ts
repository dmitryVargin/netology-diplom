function getIsEnabled(user) {
  let isEnabled = false;
  if (user === undefined || user?.role === 'client') {
    isEnabled = true;
  }
  return isEnabled;
}

export default getIsEnabled;
