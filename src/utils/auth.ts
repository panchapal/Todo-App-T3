// import jwt from 'jsonwebtoken';

// export const getToken = (token: string) => {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET!);
//   } catch (error) {
//     return null;
//   }
// };


import jwt from 'jsonwebtoken';

export const getToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded; // Ensure decoded user info is returned
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
