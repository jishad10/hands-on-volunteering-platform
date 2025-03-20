import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentUser, loading } = useSelector((state) => state.user);

console.log("Checking PrivateRoute. Current user:", currentUser, "Loading:", loading); 

if (loading) return <div>Loading...</div>; // Prevents redirect before Redux state is ready
return currentUser ? <Outlet /> : <Navigate to="/login" />;
}
