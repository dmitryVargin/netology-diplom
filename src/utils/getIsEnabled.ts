import { RequestUser } from './types';

function getIsEnabled(user: RequestUser | undefined) {
  let isEnabled = false;
  if (user === undefined || user?.role === 'client') {
    isEnabled = true;
  }
  return isEnabled;
}

export default getIsEnabled;
