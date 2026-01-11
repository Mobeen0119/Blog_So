import authService from '../../appwite/auth';
import {useDispatch} from 'react-redux';
import { logout } from '../../store/slicer';
import { useNavigate } from 'react-router-dom';


function Logout() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
const logouthandler=async()=>{
    try{
        await authService.logout();
        dispatch(logout());
        navigate('/login');
    }catch(error){
        console.error('Logout failed:',error);
    }}
    return (
        <button className='inline-block rounded-full px-4 py-2 duration-200 hover:bg-violet-500 hover:scale-3d' onClick={logouthandler}>Logout</button>
    );
}
export default Logout;