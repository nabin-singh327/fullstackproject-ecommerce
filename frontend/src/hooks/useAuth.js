import { useDispatch } from "react-redux";
import {
  getUser,
  loginUser,
  logoutUser,
  signUpUser,
} from "../services/auth.services";
import { Logout, setUser } from "../redux/features/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();

  const signUp = async (data) => {
    const res = await signUpUser(data);
    console.log(res);
    dispatch(setUser(res?.data));
  };

  const login = async (data) => {
    const res = await loginUser(data);
    dispatch(setUser(res?.data));
  };

  const logout = async () => {
    const res = await logoutUser();
    dispatch(Logout());
  };

  const fetchUser = async () => {
    const res = await getUser();
    dispatch(setUser(res?.data));
  };

  return {
    signUp,
    login,
    logout,
    fetchUser,
  };
};

export default useAuth;
