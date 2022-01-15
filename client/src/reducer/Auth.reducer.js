export default function reducer(state, action) {
  switch (action.type) {
    case 'auth':
      return {
        ...state,
        auth: action.payload,
      };
    case 'userType':
      return {
        ...state,
        userType: action.payload,
      };
    case 'user':
      return {
        ...state,
        user: action.payload,
      };
    default:
      throw new Error();
  }
}
